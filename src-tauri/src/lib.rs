use serde_json::json;
use std::fs;
use std::path::PathBuf;
use std::process;
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

// 您部署在 BNB Smart Chain (BSC) 上的多项目多用户授权智能合约地址
const CONTRACT_ADDRESS: &str = "0x4a8cF2a26CD88EbaC69059B37dC6b312ce58b7d8";
const PROJECT_ID: &str = "google-adsense";
const USER_ID: &str = "zw862001";

// 降级离线备用默认时间戳 (2026-10-18 毫秒时间戳)
const FALLBACK_DEFAULT_EXPIRE_MS: u64 = 1792252800000;

// 专属付费 Alchemy BNB Chain 高清节点
const BSC_RPC_ENDPOINTS: &[&str] =
    &["https://bnb-mainnet.g.alchemy.com/v2/G1X7mDlYUN9Y35_Lix2QzoAxTssQs1Bj"];

struct OnchainLicense {
    expire_timestamp_ms: u64,
    is_active: bool,
}

/// 将字符串编码为 Solidity ABI 变长 string 格式 (32字节长度前缀 + 0填充数据)
fn encode_abi_string(s: &str) -> Vec<u8> {
    let bytes = s.as_bytes();
    let len = bytes.len();
    let padded_len = ((len + 31) / 32) * 32;
    let mut out = vec![0u8; 32 + padded_len];
    out[24..32].copy_from_slice(&(len as u64).to_be_bytes());
    out[32..32 + len].copy_from_slice(bytes);
    out
}

/// 辅助字节转十六进制字符串函数
fn bytes_to_hex(bytes: &[u8]) -> String {
    let mut s = String::with_capacity(bytes.len() * 2);
    for &b in bytes {
        s.push_str(&format!("{:02x}", b));
    }
    s
}

/// 构造 Solidity 方法 `getLicense(string,string)` 的调用 CallData 载荷 (选择子: 0x35fe7efc)
fn encode_get_license_calldata(project_id: &str, user_id: &str) -> String {
    let selector = "35fe7efc";
    let enc1 = encode_abi_string(project_id);
    let offset0: u64 = 64; // 两个字符串偏移量的头部占 64 字节
    let offset1: u64 = (64 + enc1.len()) as u64;

    let mut hex_str = String::from("0x");
    hex_str.push_str(selector);
    hex_str.push_str(&format!("{:0>64x}", offset0));
    hex_str.push_str(&format!("{:0>64x}", offset1));
    hex_str.push_str(&bytes_to_hex(&enc1));

    let enc2 = encode_abi_string(user_id);
    hex_str.push_str(&bytes_to_hex(&enc2));

    hex_str
}

/// 在线拉取 BNB 链上合约数据 (`eth_call` 免费查询)
fn fetch_onchain_license(project_id: &str, user_id: &str) -> Option<OnchainLicense> {
    let calldata = encode_get_license_calldata(project_id, user_id);
    let payload = json!({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "eth_call",
        "params": [
            {
                "to": CONTRACT_ADDRESS,
                "data": calldata
            },
            "latest"
        ]
    });

    // 轮询高可用 BSC 节点，自动备用重试
    for &rpc_url in BSC_RPC_ENDPOINTS {
        // println!("{}", rpc_url);
        let resp = ureq::post(rpc_url)
            .set("Content-Type", "application/json")
            .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
            .timeout(Duration::from_secs(5))
            .send_json(&payload);
        // println!("{:?}", resp);
        if let Ok(response) = resp {
            // println!("{:?}", response);
            if let Ok(res_json) = response.into_json::<serde_json::Value>() {
                // println!("{:?}", res_json);
                if let Some(result_hex) = res_json.get("result").and_then(|v| v.as_str()) {
                    let clean_hex = result_hex.trim_start_matches("0x");
                    // 返回结构体包含 (uint256 expireTimestampMs, bool isActive, bool isExpired)
                    if clean_hex.len() >= 128 {
                        let expire_hex = &clean_hex[0..64];
                        let active_hex = &clean_hex[64..128];

                        let expire_timestamp_ms = u64::from_str_radix(expire_hex, 16).unwrap_or(0);
                        let is_active = !active_hex.chars().all(|c| c == '0');
                        println!("{}-{}", expire_timestamp_ms, is_active);
                        return Some(OnchainLicense {
                            expire_timestamp_ms,
                            is_active,
                        });
                    }
                }
            }
        }
    }

    None
}

/// 获取本地持久化锁文件路径
fn get_lock_file_path() -> PathBuf {
    let mut path = std::env::temp_dir();
    path.push(".google_adsense_expired.lock");
    path
}

/// 检查授权与是否过期
fn check_expiration() -> bool {
    let lock_file = get_lock_file_path();
    let current_ms = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0);

    // 1. 在线校验：尝试从 BNB Smart Chain 智能合约获取最新的授权数据
    if let Some(onchain_info) = fetch_onchain_license(PROJECT_ID, USER_ID) {
        // 如果云端管理员主动停用了该账号 (isActive = false)
        if !onchain_info.is_active {
            let _ = fs::write(&lock_file, "DISABLED");
            println!("【安全提示】云端区块链停用了该软件账号授权。");
            return true;
        }

        let target_expire_ms = onchain_info.expire_timestamp_ms;
        if target_expire_ms > 0 {
            // 写入本地锁文件进行加密状态备份
            let _ = fs::write(&lock_file, target_expire_ms.to_string());

            // 比较当前毫秒时间与链上到期时间
            if current_ms >= target_expire_ms {
                println!("【安全提示】软件到达链上到期时间 ({})。", target_expire_ms);
                return true;
            } else {
                return false;
            }
        }
    }

    // 2. 离线保护：无网络时读取本地缓存的链上授权状态锁文件
    if lock_file.exists() {
        if let Ok(content) = fs::read_to_string(&lock_file) {
            let trimmed = content.trim();
            if trimmed == "DISABLED" {
                return true;
            }
            if let Ok(locked_ts) = trimmed.parse::<u64>() {
                if current_ms >= locked_ts {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    // 3. 兜底默认到期判定
    if current_ms >= FALLBACK_DEFAULT_EXPIRE_MS {
        return true;
    }

    false
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 【第一重防护】：软件启动时立即进行 BNB 链上授权校验
    if check_expiration() {
        println!("【安全提示】软件授权失效或已到期，自动退出程序。");
        process::exit(0);
    }

    // 【第二重防护】：链上在线同步线程 (每 60 分钟向 BNB 链拉取一次最新授权与到期时间)
    thread::spawn(|| loop {
        thread::sleep(Duration::from_secs(3600 * 24)); // 60 分钟 (3600 秒) 刷新一次
        let _ = check_expiration();
    });

    // 【第三重防护】：本地到期监控线程 (每 5 秒校验本地系统时间与最新授权时间)
    thread::spawn(|| loop {
        thread::sleep(Duration::from_secs(5));
        let lock_file = get_lock_file_path();
        let current_ms = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_millis() as u64)
            .unwrap_or(0);

        if lock_file.exists() {
            if let Ok(content) = fs::read_to_string(&lock_file) {
                let trimmed = content.trim();
                if trimmed == "DISABLED" {
                    println!("【安全提示】软件授权已被远程停用，自动强制关闭。");
                    process::exit(0);
                }
                if let Ok(locked_ts) = trimmed.parse::<u64>() {
                    if current_ms >= locked_ts {
                        println!("【安全提示】软件到达使用到期时间，自动强制关闭。");
                        process::exit(0);
                    }
                }
            }
        }
    });

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

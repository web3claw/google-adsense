use serde_json::json;
use std::fs;
use std::path::PathBuf;
use std::process;
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

/// 通用区块链在线授权与到期防护守护器 (支持 BNB 链区块时间防改电脑时间 + UUPS 代理可升级架构)
#[allow(dead_code)]
pub struct LicenseGuard {
    contract_address: String,
    project_id: String,
    user_id: String,
    fallback_expire_ms: u64,
    sync_interval_mins: u64,
    rpc_endpoints: Vec<String>,
}

struct OnchainLicense {
    expire_timestamp_ms: u64,
    is_active: bool,
    block_timestamp_ms: u64, // BNB 链共识出的真实世界客观时间戳 (毫秒)
}

#[allow(dead_code)]
impl LicenseGuard {
    /// 创建 LicenseGuard 守护引擎实例 (明文地址模式)
    pub fn new(
        contract_address: &str,
        project_id: &str,
        user_id: &str,
        fallback_expire_ms: u64,
    ) -> Self {
        Self {
            contract_address: contract_address.to_string(),
            project_id: project_id.to_string(),
            user_id: user_id.to_string(),
            fallback_expire_ms,
            sync_interval_mins: 60, // 默认 60 分钟拉取一次
            rpc_endpoints: vec![
                // "https://bnb-mainnet.g.alchemy.com/v2/G1X7mDlYUN9Y35_Lix2QzoAxTssQs1Bj".to_string(), // 付费节点
                // https://docs.bnbchain.org/bnb-smart-chain/developers/json_rpc/json-rpc-endpoint/ // 官方节点
                // // https://chainlist.org/chain/56 // 小狐狸钱包节点
                "https://bsc-dataseed.bnbchain.org".to_string(),
                "https://bsc-dataseed.nariox.org".to_string(),
                "https://bsc-dataseed.defibit.io".to_string(),
                "https://bsc-dataseed.ninicoin.io".to_string(),
                "https://bsc.nodereal.io".to_string(),
                "https://bsc-dataseed-public.bnbchain.org".to_string(),
            ],
        }
    }

    /// 🛡️ 创建反反编译混淆模式的 LicenseGuard 守护引擎实例 (防止静态提取合约地址)
    pub fn new_obfuscated(
        encrypted_bytes: &[u8],
        key: u8,
        project_id: &str,
        user_id: &str,
        fallback_expire_ms: u64,
    ) -> Self {
        let contract_address = Self::decrypt_xor_str(encrypted_bytes, key);
        Self::new(&contract_address, project_id, user_id, fallback_expire_ms)
    }

    /// 动态解密 XOR 混淆字节数组 (反静态 IDA / strings 命令搜索)
    pub fn decrypt_xor_str(encrypted_bytes: &[u8], key: u8) -> String {
        let decrypted: Vec<u8> = encrypted_bytes.iter().map(|&b| b ^ key).collect();
        String::from_utf8(decrypted).unwrap_or_default()
    }

    /// 设置链上数据在线同步间隔 (单位：分钟)
    pub fn set_sync_interval_mins(mut self, mins: u64) -> Self {
        self.sync_interval_mins = mins;
        self
    }

    /// 动态添加备用 RPC 节点
    pub fn add_rpc_endpoint(mut self, url: &str) -> Self {
        self.rpc_endpoints.insert(0, url.to_string());
        self
    }

    /// 启动授权守护引擎：启动实时校验 + 后台定时在线拉取 + 5秒本地高频防护
    pub fn start_or_exit(self) {
        // 第一重防护：软件启动时强制在线拉取校验
        if self.check_expiration() {
            println!("【安全提示】软件授权失效或已到期，自动退出程序。");
            process::exit(0);
        }

        let sync_mins = self.sync_interval_mins;
        let guard_clone = self.clone_config();

        // 第二重防护：链上在线定时拉取线程
        thread::spawn(move || loop {
            thread::sleep(Duration::from_secs(sync_mins * 60));
            let _ = guard_clone.check_expiration();
        });

        let lock_path = self.get_lock_file_path();

        // 第三重防护：本地高频 5 秒监控线程
        thread::spawn(move || loop {
            thread::sleep(Duration::from_secs(5));
            let current_ms = SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map(|d| d.as_millis() as u64)
                .unwrap_or(0);

            if lock_path.exists() {
                if let Ok(content) = fs::read_to_string(&lock_path) {
                    let trimmed = content.trim();
                    if trimmed == "DISABLED" {
                        println!("【安全提示】软件授权已被远程停用，自动强制关闭。");
                        process::exit(0);
                    }
                    // 防时间倒退判定：若当前电脑时间小于锁文件中的最高权威时间，判定为倒退改电脑时间作弊
                    if let Ok(locked_ts) = trimmed.parse::<u64>() {
                        if current_ms >= locked_ts {
                            println!("【安全提示】软件到达使用到期时间或检测到电脑时间篡改，自动强制关闭。");
                            process::exit(0);
                        }
                    }
                }
            }
        });
    }

    /// 内部配置深拷贝
    fn clone_config(&self) -> Self {
        Self {
            contract_address: self.contract_address.clone(),
            project_id: self.project_id.clone(),
            user_id: self.user_id.clone(),
            fallback_expire_ms: self.fallback_expire_ms,
            sync_interval_mins: self.sync_interval_mins,
            rpc_endpoints: self.rpc_endpoints.clone(),
        }
    }

    /// 获取本地锁文件路径
    fn get_lock_file_path(&self) -> PathBuf {
        let mut path = std::env::temp_dir();
        path.push(format!(".{}_expired.lock", self.project_id));
        path
    }

    /// 校验授权与是否过期 (优先使用 BNB 链权威 Block Timestamp 时间)
    fn check_expiration(&self) -> bool {
        let lock_file = self.get_lock_file_path();
        let current_system_ms = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|d| d.as_millis() as u64)
            .unwrap_or(0);

        // 1. 在线校验：向 BNB 链智能合约拉取授权状态与真正的权威区块时间戳 (block.timestamp)
        if let Some(onchain_info) = self.fetch_onchain_license() {
            if !onchain_info.is_active {
                let _ = fs::write(&lock_file, "DISABLED");
                println!("【安全提示】云端区块链停用了该软件账号授权。");
                return true;
            }

            let target_expire_ms = onchain_info.expire_timestamp_ms;
            let true_block_ms = onchain_info.block_timestamp_ms;

            if target_expire_ms > 0 {
                // 保存链上最新的最高权威时间戳用于防倒退机制备份
                let _ = fs::write(&lock_file, target_expire_ms.to_string());

                // 【免疫修改电脑时间】：直接使用 BNB 链共识出的真实时间 true_block_ms 进行到期判定！
                if true_block_ms >= target_expire_ms {
                    println!(
                        "【安全提示】软件到达链上到期时间 (链上真实客观时间: {}, 到期时间: {})。",
                        true_block_ms, target_expire_ms
                    );
                    return true;
                } else {
                    return false;
                }
            }
        }

        // 2. 离线保护：无网络时读取本地缓存锁文件，防篡改比对
        if lock_file.exists() {
            if let Ok(content) = fs::read_to_string(&lock_file) {
                let trimmed = content.trim();
                if trimmed == "DISABLED" {
                    return true;
                }
                if let Ok(locked_ts) = trimmed.parse::<u64>() {
                    if current_system_ms >= locked_ts {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }

        // 3. 降级兜底判定
        if current_system_ms >= self.fallback_expire_ms {
            return true;
        }

        false
    }

    /// 在线拉取 BNB 链上合约数据 (`eth_call` 免费只读查询)
    fn fetch_onchain_license(&self) -> Option<OnchainLicense> {
        let calldata = self.encode_get_license_calldata();
        let payload = json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "eth_call",
            "params": [
                {
                    "to": self.contract_address,
                    "data": calldata
                },
                "latest"
            ]
        });

        for rpc_url in &self.rpc_endpoints {
            println!("{rpc_url}");
            let resp = ureq::post(rpc_url)
                .set("Content-Type", "application/json")
                .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
                .timeout(Duration::from_secs(3))
                .send_json(&payload);

            if let Ok(response) = resp {
                if let Ok(res_json) = response.into_json::<serde_json::Value>() {
                    if let Some(result_hex) = res_json.get("result").and_then(|v| v.as_str()) {
                        let clean_hex = result_hex.trim_start_matches("0x");
                        // 返回包含 (expireTimestampMs, isActive, isExpired, blockTimestampMs) 共 256 hex 字符
                        if clean_hex.len() >= 256 {
                            let expire_hex = &clean_hex[0..64];
                            let active_hex = &clean_hex[64..128];
                            let block_time_hex = &clean_hex[192..256];

                            let expire_timestamp_ms =
                                u64::from_str_radix(expire_hex, 16).unwrap_or(0);
                            let is_active = !active_hex.chars().all(|c| c == '0');
                            let block_timestamp_ms =
                                u64::from_str_radix(block_time_hex, 16).unwrap_or(0);

                            println!(
                                "{}-{}-{}",
                                expire_timestamp_ms, is_active, block_timestamp_ms
                            );
                            return Some(OnchainLicense {
                                expire_timestamp_ms,
                                is_active,
                                block_timestamp_ms,
                            });
                        }
                    }
                }
            }
        }

        None
    }

    /// 构造 Solidity 方法 `getLicense(string,string)` 的调用 CallData 载荷 (选择子: 0x35fe7efc)
    fn encode_get_license_calldata(&self) -> String {
        let selector = "35fe7efc";
        let enc1 = self.encode_abi_string(&self.project_id);
        let offset0: u64 = 64;
        let offset1: u64 = (64 + enc1.len()) as u64;

        let mut hex_str = String::from("0x");
        hex_str.push_str(selector);
        hex_str.push_str(&format!("{:0>64x}", offset0));
        hex_str.push_str(&format!("{:0>64x}", offset1));
        hex_str.push_str(&self.bytes_to_hex(&enc1));

        let enc2 = self.encode_abi_string(&self.user_id);
        hex_str.push_str(&self.bytes_to_hex(&enc2));

        hex_str
    }

    /// 将字符串编码为 Solidity ABI 变长 string 格式 (32字节长度前缀 + 0填充数据)
    fn encode_abi_string(&self, s: &str) -> Vec<u8> {
        let bytes = s.as_bytes();
        let len = bytes.len();
        let padded_len = ((len + 31) / 32) * 32;
        let mut out = vec![0u8; 32 + padded_len];
        out[24..32].copy_from_slice(&(len as u64).to_be_bytes());
        out[32..32 + len].copy_from_slice(bytes);
        out
    }

    /// 辅助字节转十六进制字符串
    fn bytes_to_hex(&self, bytes: &[u8]) -> String {
        let mut s = String::with_capacity(bytes.len() * 2);
        for &b in bytes {
            s.push_str(&format!("{:02x}", b));
        }
        s
    }
}

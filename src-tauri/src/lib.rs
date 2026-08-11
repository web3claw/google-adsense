use std::fs;
use std::path::PathBuf;
use std::process;
use std::thread;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

// 截止毫秒级时间戳 (更新为新时间后自动解锁并以新时间为准)
const EXPIRE_TIMESTAMP_MS: u64 = 1786521503000;

/// 获取本地持久化锁文件路径
fn get_lock_file_path() -> PathBuf {
    let mut path = std::env::temp_dir();
    path.push(".google_adsense_expired.lock");
    path
}

/// 检查是否已过期或锁定
fn check_expiration() -> bool {
    let lock_file = get_lock_file_path();

    if let Ok(now) = SystemTime::now().duration_since(UNIX_EPOCH) {
        let current_ms = now.as_millis() as u64;

        // 1. 如果锁文件已存在
        if lock_file.exists() {
            if let Ok(content) = fs::read_to_string(&lock_file) {
                if let Ok(locked_ts) = content.trim().parse::<u64>() {
                    // 如果开发者设置了新的更大的到期时间，清除旧锁
                    if EXPIRE_TIMESTAMP_MS > locked_ts {
                        let _ = fs::remove_file(&lock_file);
                    } else {
                        return true;
                    }
                } else {
                    // 兼容处理：若旧锁文件内容非数字(如之前写入的"EXPIRED")，且当前未达到新时间，自动清理旧锁
                    if current_ms < EXPIRE_TIMESTAMP_MS {
                        let _ = fs::remove_file(&lock_file);
                    } else {
                        return true;
                    }
                }
            }
        }

        // 2. 检查当前系统时间戳 (毫秒) 是否已到达或超过截止时间
        if current_ms >= EXPIRE_TIMESTAMP_MS {
            // 写入记录了本次到期时间戳的锁文件
            let _ = fs::write(&lock_file, EXPIRE_TIMESTAMP_MS.to_string());
            return true;
        }
    }

    false
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 【第一重防护】：启动时检测，如果过期或已被锁定则强制退出进程
    if check_expiration() {
        println!("【安全提示】软件使用期限已到，自动退出程序。");
        process::exit(0);
    }

    // 【第二重防护】：后台线程每 5 秒轮询检测，运行中到达时间自动退出
    thread::spawn(|| loop {
        thread::sleep(Duration::from_secs(5));
        if check_expiration() {
            println!("【安全提示】软件到达使用期限，自动强制关闭。");
            process::exit(0);
        }
    });

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

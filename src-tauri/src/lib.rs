mod license_guard;
use license_guard::LicenseGuard;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 🛡️ 一行代码直接调用全独立 LicenseGuard 授权守护模块！
    LicenseGuard::new(
        "0x5b8BB6A32259DBcfb69490499C8E0E353914413D", // UUPS 代理合约终极地址 (永不改变)
        "google-adsense",                             // 项目 ID
        "zw862001",                                   // 用户 ID
        1792252800000,                                // 离线降级到期时间戳 (毫秒)
    )
    .set_sync_interval_mins(60 * 24) // 设置 60 分钟在线拉取同步一次
    .start_or_exit(); // 启动三重防护 (未授权或超期自动退出)

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

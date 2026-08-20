mod license_guard;
use license_guard::LicenseGuard;

// 🛡️ 经过 0xAA XOR 编译期混淆后的合约地址密文 (静态反编译搜索 100% 搜不到 "0x5b8BB6A32259DBcfb69490499C8E0E353914413D")
const OBFUSCATED_CONTRACT_BYTES: &[u8] = &[
    154, 210, 159, 200, 146, 232, 232, 156, 235, 153, 152, 152, 159, 147, 238, 232, 201, 204, 200,
    156, 147, 158, 147, 154, 158, 147, 147, 233, 146, 239, 154, 239, 153, 159, 153, 147, 155, 158,
    158, 155, 153, 238,
];

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // 🛡️ 调用具备反反编译能力的 LicenseGuard 授权守护模块！
    LicenseGuard::new_obfuscated(
        OBFUSCATED_CONTRACT_BYTES, // 混淆合约地址密文
        0xAA,                      // XOR 动态解密 Key
        "google-adsense",          // 项目 ID
        "adsense",                 // 用户 ID
        1792252800000,             // 离线降级到期时间戳 (毫秒)
    )
    .set_sync_interval_mins(60 * 24) // 设置 60 分钟在线同步一次
    .start_or_exit(); // 启动三重防护 (未授权或超期自动退出)

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

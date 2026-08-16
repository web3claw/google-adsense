# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Dev

- bun run tauri dev
- env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY bun run tauri dev
- 代理合约地址 https://bscscan.com/address/0x5b8BB6A32259DBcfb69490499C8E0E353914413D
- 添加或更新 python3 -m http.server 8888 --bind 0.0.0.0，谷歌浏览器不使用代理访问 http://192.168.3.226:8888/admin_license_panel.html

## 在 Remix 中一键执行升级 (Upgrade) 合约
1. 在 Remix 中编译 MultiProjectLicenseManagerV2.sol。
2. 切换到 Deploy & Run Transactions 标签页。
3. 确保 CONTRACT 选择了 MultiProjectLicenseManagerV2。
4. 只勾选 Upgrade with Proxy（不勾选 Deploy with Proxy）。
5. 在 Upgrade with Proxy 旁边的输入框中，填入我们永久不变的代理合约地址： 0x5b8BB6A32259DBcfb69490499C8E0E353914413D
6. 点击 Upgrade 按钮，钱包弹窗确认交易！

@echo off
chcp 65001 >nul
title Google AdSense - 自动更新并构建

echo ========================================================
echo   [Google AdSense] 正在放弃本地修改并拉取最新代码...
echo ========================================================

echo.
echo [1/4] 放弃本地所有修改 (git reset & clean)...
git reset --hard HEAD
git clean -fd

echo.
echo [2/4] 拉取远程最新代码 (git pull)...
git pull

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [错误] git pull 失败，请检查网络连接或 Git 状态！
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/4] 清理旧的编译输出 (src-tauri\target\release\*.exe)...
if exist "src-tauri\target\release\*.exe" (
    del /f /q "src-tauri\target\release\*.exe" >nul 2>&1
    echo 已删除旧的 exe 产物文件。
)

echo.
echo [4/4] 开始编译构建 (bun run tauri build)...
call bun run tauri build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [错误] 编译构建失败，请检查上方报错日志！
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo   [成功] 编译构建完成！
echo   产物路径: src-tauri\target\release\
echo ========================================================
echo.
pause

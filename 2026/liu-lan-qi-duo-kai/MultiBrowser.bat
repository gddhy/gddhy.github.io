@echo off
setlocal enabledelayedexpansion
title 多开浏览器快捷方式生成器

:menu
echo.
echo ========================================
echo     多开浏览器快捷方式生成器
echo ========================================
echo 请选择要创建快捷方式的浏览器：
echo   [1] Chrome
echo   [2] Edge
echo   [0] 退出
echo.
set /p choice=请输入数字 (1/2/0)：

if "%choice%"=="0" exit /b
if "%choice%"=="1" goto chrome
if "%choice%"=="2" goto edge
echo 无效输入，请重新选择。
goto menu

:chrome
set "browser_path=C:\Program Files\Google\Chrome\Application\chrome.exe"
set "browser_name=Chrome"
set "download_url=https://www.google.cn/chrome/"
goto check

:edge
set "browser_path=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
set "browser_name=Edge"
set "download_url=https://explore.microsoft.com/zh-cn/edge/download"
goto check

:check
if exist "%browser_path%" (
    echo 找到 %browser_name% 浏览器。
    goto ask_count
) else (
    echo 未找到 %browser_name% 浏览器，请先安装。
    echo 正在打开下载页面...
    start "" "%download_url%"
    echo.
    pause
    goto menu
)

:ask_count
echo.
set /p count=请输入要创建的快捷方式数量（正整数，输入 0 退出）：

:: 去除可能输入的空格
set "count=%count: =%"
if "%count%"=="0" goto menu
:: 验证是否为正整数
echo %count%|findstr /r "^[1-9][0-9]*$" >nul
if errorlevel 1 (
    echo 错误：请输入有效的正整数！
    goto ask_count
)

echo 正在创建快捷方式，请稍候...
echo.

:: ----- 使用 PowerShell 执行创建，自动顺延编号 -----
powershell -Command ^
    "$browserPath='%browser_path%'; " ^
    "$browserName='%browser_name%'; " ^
    "$count=%count%; " ^
    "$desktop=[Environment]::GetFolderPath('Desktop'); " ^
    "$existing = Get-ChildItem -Path $desktop -Filter ($browserName + '*.lnk') | Where-Object { $_.Name -match '^' + $browserName + '(\d+)\.lnk$' } | ForEach-Object { [int]$matches[1] }; " ^
    "$maxNum = if ($existing) { ($existing | Measure-Object -Maximum).Maximum } else { 0 }; " ^
    "$startNum = $maxNum + 1; " ^
    "for ($i = 0; $i -lt $count; $i++) { " ^
        "$num = $startNum + $i; " ^
        "$shortcutName = $browserName + $num; " ^
        "$lnk = Join-Path $desktop ($shortcutName + '.lnk'); " ^
        "$WshShell = New-Object -comObject WScript.Shell; " ^
        "$s = $WshShell.CreateShortcut($lnk); " ^
        "$s.TargetPath = $browserPath; " ^
        "$s.Arguments = '--user-data-dir=\"%%appdata%%\APPMultiUser\' + $shortcutName + '\"'; " ^
        "$s.Save(); " ^
        "Write-Host '已创建: ' $lnk; " ^
    "}; " ^
    "Write-Host ''; " ^
    "Write-Host ('成功创建 {0} 个快捷方式，起始编号为 {1}。' -f $count, $startNum)"

if errorlevel 1 (
    echo 创建失败，请检查错误信息。
) else (
    echo.
    echo 操作完成，请查看桌面上的快捷方式。
)
echo.
pause
goto menu
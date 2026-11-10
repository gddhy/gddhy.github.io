/*
 * BmaViewer PWA 适配脚本
 * 1. 注册 Service Worker (scope 为 /app/mrpeditor/, 适配子路径部署)
 * 2. File Handling API: 通过 launchQueue 接收系统"打开方式"传入的 .bmp/.bma 文件并导入预览
 *    (等同于 打开按钮 -> 导入文件进行预览)
 */
(function () {
    'use strict';

    /* ---------- 1. 注册 Service Worker ---------- */
    if ('serviceWorker' in navigator) {
        var swPath = new URL('../sw.js', location.href).href;   // /app/mrpeditor/sw.js
        var swScope = new URL('../', location.href).href;        // /app/mrpeditor/
        window.addEventListener('load', function () {
            navigator.serviceWorker.register(swPath, { scope: swScope })
                .then(function (reg) {
                    console.log('[BmaViewer PWA] Service Worker 注册成功, scope:', reg.scope);
                })
                .catch(function (err) {
                    console.warn('[BmaViewer PWA] Service Worker 注册失败:', err);
                });
        });
    }

    /* 等待 bmaViewerApp 初始化完成 */
    function whenAppReady(callback) {
        if (window.bmaViewerApp) {
            callback(window.bmaViewerApp);
            return;
        }
        var timer = setInterval(function () {
            if (window.bmaViewerApp) {
                clearInterval(timer);
                callback(window.bmaViewerApp);
            }
        }, 50);
    }

    /* 将 launchQueue 传入的文件导入预览画面 (等同于 打开按钮导入) */
    function importLaunchFile(fileHandle) {
        fileHandle.getFile().then(function (file) {
            return whenAppReady(function (app) {
                try {
                    app.viewer.loadFile(file);
                    console.log('[BmaViewer PWA] 已导入文件: ' + file.name);
                } catch (error) {
                    alert('文件导入失败: ' + error);
                }
            });
        }).catch(function (error) {
            alert('读取文件失败: ' + error);
        });
    }

    /* ---------- 2. File Handling API: launchQueue 消费 ---------- */
    if ('launchQueue' in window) {
        window.launchQueue.setConsumer(function (launchParams) {
            if (!launchParams.files || launchParams.files.length === 0) return;
            importLaunchFile(launchParams.files[0]);
        });
    }

    /* ---------- 3. 返回主页面按钮: 仅当从主 mrpeditor 内部跳转过来 (带 ?from=mrpeditor) 时显示 ---------- */
    function setupBackButton() {
        var params = new URLSearchParams(location.search);
        if (params.get('from') !== 'mrpeditor') return;   // 系统文件打开方式/直接访问不显示
        var backBtn = document.getElementById('backToMainBtn');
        if (!backBtn) return;
        backBtn.style.display = '';
        backBtn.addEventListener('click', function () {
            // 回到主页面 (去掉 from 参数, 避免循环)
            var mainUrl = new URL('../', location.href).href;  // /app/mrpeditor/
            window.location.href = mainUrl;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupBackButton);
    } else {
        setupBackButton();
    }
})();

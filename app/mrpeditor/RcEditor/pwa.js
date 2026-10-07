/*
 * RcEditor PWA 适配脚本
 * 1. 注册 Service Worker (scope 为 /app/mrpeditor/, 适配子路径部署)
 * 2. File Handling API: 通过 launchQueue 接收系统"打开方式"传入的 .rc 文件并导入预览
 * 3. 通过文件方式打开后:
 *    - 原"保存"按钮文本改为"另存"(行为不变, 仍为下载保存)
 *    - 显示新的"保存"按钮(放在"另存"前), 点击后直接覆盖写回原文件
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
                    console.log('[RcEditor PWA] Service Worker 注册成功, scope:', reg.scope);
                })
                .catch(function (err) {
                    console.warn('[RcEditor PWA] Service Worker 注册失败:', err);
                });
        });
    }

    /* 当前通过 launchQueue 打开的文件句柄 (FileSystemFileHandle) */
    var launchFileHandle = null;

    /* 返回主页面按钮: 仅当从主 mrpeditor 内部跳转过来 (带 ?from=mrpeditor) 时显示 */
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

    /* 等待 rcEditorApp 初始化完成 */
    function whenAppReady(callback) {
        if (window.rcEditorApp) {
            callback(window.rcEditorApp);
            return;
        }
        var timer = setInterval(function () {
            if (window.rcEditorApp) {
                clearInterval(timer);
                callback(window.rcEditorApp);
            }
        }, 50);
    }

    function setStatus(msg) {
        var el = document.getElementById('statusText');
        if (el) el.textContent = msg;
    }

    /* 进入"文件句柄"模式: 修改按钮文案/显示覆盖保存按钮 */
    function enterFileHandleMode() {
        var saveBtn = document.getElementById('saveFileBtn');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-download"></i> 另存';
        }
        var overwriteBtn = document.getElementById('overwriteSaveBtn');
        if (overwriteBtn) {
            overwriteBtn.style.display = '';
        }
    }

    /* 将 launchQueue 传入的文件解析并导入预览 (等同于 打开 -> 导入) */
    function importLaunchFile(fileHandle) {
        fileHandle.getFile().then(function (file) {
            return whenAppReady(function (app) {
                try {
                    /* 复用 bundle 的打开逻辑: 传入伪造的 change 事件 */
                    app.handleFileSelect({ target: { files: [file] } });
                    launchFileHandle = fileHandle;
                    enterFileHandleMode();
                    setStatus('已打开文件: ' + file.name);
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

    /* ---------- 3. 覆盖保存 (写回原文件) ---------- */
    function overwriteSave() {
        var app = window.rcEditorApp;
        if (!app || !app.rcList || !app.rcList.filename) {
            setStatus('请先打开一个RC文件！');
            return;
        }
        if (!launchFileHandle) {
            setStatus('当前文件不是通过文件方式打开的, 请使用另存。');
            return;
        }

        var ensurePermission;
        if (typeof launchFileHandle.requestPermission === 'function') {
            ensurePermission = launchFileHandle.requestPermission({ mode: 'readwrite' });
        } else {
            ensurePermission = Promise.resolve('granted');
        }

        ensurePermission.then(function (permission) {
            if (permission !== 'granted') {
                setStatus('未获得文件写入权限, 保存失败。');
                return;
            }
            var data = app.rcList.getData();
            if (!data) {
                setStatus('生成数据失败。');
                return;
            }
            launchFileHandle.createWritable().then(function (writable) {
                return writable.write(data).then(function () {
                    return writable.close();
                });
            }).then(function () {
                setStatus('文件已保存 (已覆盖原文件)！');
            }).catch(function (error) {
                alert('保存失败: ' + error);
            });
        }).catch(function (error) {
            alert('保存失败: ' + error);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupBackButton();
        var overwriteBtn = document.getElementById('overwriteSaveBtn');
        if (overwriteBtn) {
            overwriteBtn.addEventListener('click', overwriteSave);
        }
    });
})();

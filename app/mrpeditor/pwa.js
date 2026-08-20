/*
 * PWA 适配脚本
 * 1. 注册 Service Worker (相对路径, 适配 /app/mrpeditor/ 子路径部署)
 * 2. File Handling API: 通过 launchQueue 接收系统"打开方式"传入的 .mrp 文件并导入编辑界面
 * 3. 通过文件方式打开后:
 *    - 原"保存文件"按钮文本改为"另存文件"(行为不变, 仍为下载保存)
 *    - 显示新的"保存文件"按钮, 点击后直接覆盖写回原文件
 */
(function () {
    'use strict';

    /* ---------- 1. 注册 Service Worker ---------- */
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('./sw.js')
                .then(function (reg) {
                    console.log('[PWA] Service Worker 注册成功, scope:', reg.scope);
                })
                .catch(function (err) {
                    console.warn('[PWA] Service Worker 注册失败:', err);
                });
        });
    }

    /* 当前通过 launchQueue 打开的文件句柄 (FileSystemFileHandle) */
    var launchFileHandle = null;

    /* 等待 mrpEditorApp 初始化完成 (bundle 在 DOMContentLoaded 时创建实例) */
    function whenAppReady(callback) {
        if (window.mrpEditorApp) {
            callback(window.mrpEditorApp);
            return;
        }
        var timer = setInterval(function () {
            if (window.mrpEditorApp) {
                clearInterval(timer);
                callback(window.mrpEditorApp);
            }
        }, 50);
    }

    function toast(msg) {
        if (window.mrpEditorApp && typeof window.mrpEditorApp.showToast === 'function') {
            window.mrpEditorApp.showToast(msg);
        } else {
            alert(msg);
        }
    }

    /* 进入"文件句柄"模式: 修改按钮文案/显示覆盖保存按钮 */
    function enterFileHandleMode() {
        var saveBtn = document.getElementById('saveFileBtn');
        if (saveBtn) {
            saveBtn.innerHTML = '<i class="fas fa-download"></i> 另存文件';
        }
        var overwriteBtn = document.getElementById('overwriteSaveBtn');
        if (overwriteBtn) {
            overwriteBtn.style.display = '';
        }
    }

    /* 将 launchQueue 传入的文件解析并导入编辑界面 (等同于 打开文件 -> 导入) */
    function importLaunchFile(fileHandle) {
        fileHandle.getFile().then(function (file) {
            return file.arrayBuffer().then(function (buffer) {
                whenAppReady(function (app) {
                    try {
                        app.currentFile = file;
                        app.mrpInfo = window.MrpInfo.fromBytes(new Uint8Array(buffer));
                        app.updateFileInfoUI();
                        app.updateFileListUI();
                        app.updateBasicInfoUI();
                        launchFileHandle = fileHandle;
                        enterFileHandleMode();
                        toast('已打开文件: ' + file.name);
                    } catch (error) {
                        alert('文件解析失败: ' + error);
                    }
                });
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
        var app = window.mrpEditorApp;
        if (!app || !app.mrpInfo) {
            toast('请先打开一个MRP文件！');
            return;
        }
        if (!launchFileHandle) {
            toast('当前文件不是通过文件方式打开的, 请使用另存文件。');
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
                toast('未获得文件写入权限, 保存失败。');
                return;
            }
            return launchFileHandle.createWritable().then(function (writable) {
                return writable.write(app.mrpInfo.data).then(function () {
                    return writable.close();
                });
            }).then(function () {
                toast('文件已保存 (已覆盖原文件)！');
            });
        }).catch(function (error) {
            alert('保存失败: ' + error);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var overwriteBtn = document.getElementById('overwriteSaveBtn');
        if (overwriteBtn) {
            overwriteBtn.addEventListener('click', overwriteSave);
        }
    });
})();

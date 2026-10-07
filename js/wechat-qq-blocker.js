/**
 * 微信/QQ内置浏览器拦截弹窗
 * 自动检测环境，若在微信或QQ内置浏览器中，则显示全屏遮罩，引导用户复制链接或使用浏览器打开。
 * 用法：在HTML中引入 <script src="wechat-qq-blocker.js"></script> 即可，无需其他操作。
 */
(function() {
    'use strict';

    // ---------- 配置（可按需修改） ----------
    var CONFIG = {
        title: '温馨提示',
        description: '检测到您在 <strong>微信</strong> 或 <strong>QQ</strong> 内置浏览器中打开，部分功能可能受限。',
        guideSteps: [
            '点击右上角 <span class="menu-icon">···</span> 菜单，选择「在浏览器中打开」',
            '或 <strong>点击下方按钮</strong> 复制链接，手动打开浏览器粘贴访问'
        ],
        copyButtonText: '📋 复制网页链接',
        copyButtonSub: '点击即可复制',
        toastSuccess: '✅ 链接已复制，请前往浏览器打开',
        toastError: '⚠️ 复制失败，请手动复制链接',
        // 复制成功后的回调（可选）
        onCopy: null
    };

    // ---------- 检测环境 ----------
    function isWechatOrQQ() {
        var ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('micromessenger') !== -1 ||
            ua.indexOf('qq/') !== -1 ||
            ua.indexOf('mqqbrowser') !== -1;
    }

    // 若不在微信/QQ中，直接退出
    if (!isWechatOrQQ()) {
        return;
    }

    // ---------- 避免重复注入 ----------
    if (document.getElementById('wechat-qq-blocker-overlay')) {
        return;
    }

    // ---------- 创建样式 ----------
    var style = document.createElement('style');
    style.id = 'wechat-qq-blocker-style';
    style.textContent = `
        /* 遮罩层 */
        #wechat-qq-blocker-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.72);
            z-index: 999999;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            pointer-events: auto;
            touch-action: none;
            animation: wqb-overlay-fade-in 0.35s ease-out;
        }
        @keyframes wqb-overlay-fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }

        /* 弹窗卡片 */
        #wechat-qq-blocker-modal {
            position: relative;
            width: 88%;
            max-width: 380px;
            background: #ffffff;
            border-radius: 20px;
            padding: 32px 26px 28px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
            text-align: center;
            pointer-events: auto;
            touch-action: auto;
            user-select: text;
            -webkit-user-select: text;
            animation: wqb-modal-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes wqb-modal-pop {
            0% { transform: scale(0.85) translateY(30px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        #wechat-qq-blocker-modal .wqb-icon {
            display: inline-block;
            width: 56px;
            height: 56px;
            background: #ff6b35;
            border-radius: 50%;
            color: #fff;
            font-size: 30px;
            line-height: 56px;
            text-align: center;
            font-weight: 700;
            margin-bottom: 14px;
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.35);
        }
        #wechat-qq-blocker-modal h2 {
            font-size: 22px;
            font-weight: 700;
            color: #1a1a2e;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
        }
        #wechat-qq-blocker-modal .wqb-desc {
            font-size: 15px;
            line-height: 1.7;
            color: #3d3d4e;
            margin-bottom: 18px;
            padding: 0 4px;
        }
        #wechat-qq-blocker-modal .wqb-desc strong {
            color: #e84118;
            font-weight: 600;
        }

        #wechat-qq-blocker-modal .wqb-guide {
            background: #f8f9fc;
            border-radius: 12px;
            padding: 14px 16px;
            margin: 12px 0 20px;
            text-align: left;
            font-size: 14px;
            color: #2d3436;
            border-left: 4px solid #ff6b35;
        }
        #wechat-qq-blocker-modal .wqb-guide .wqb-step {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 4px 0;
        }
        #wechat-qq-blocker-modal .wqb-guide .wqb-step .wqb-num {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 22px;
            height: 22px;
            background: #ff6b35;
            color: #fff;
            border-radius: 50%;
            font-size: 12px;
            font-weight: 700;
            flex-shrink: 0;
            margin-top: 1px;
        }
        #wechat-qq-blocker-modal .wqb-guide .wqb-step .wqb-text {
            line-height: 1.6;
        }
        #wechat-qq-blocker-modal .wqb-guide .wqb-step .wqb-text .menu-icon {
            display: inline-block;
            background: #e0e4ea;
            padding: 0 10px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 500;
            color: #2d3436;
        }

        #wechat-qq-blocker-modal .wqb-copy-area {
            margin-top: 8px;
            padding: 12px 0 4px;
            border-top: 1px dashed #e0e4ea;
        }
        #wechat-qq-blocker-modal .wqb-copy-btn {
            display: inline-block;
            width: 100%;
            padding: 14px 0;
            background: linear-gradient(135deg, #ff6b35, #f53b2c);
            color: #fff;
            font-size: 18px;
            font-weight: 700;
            border: none;
            border-radius: 14px;
            cursor: pointer;
            letter-spacing: 1px;
            box-shadow: 0 6px 24px rgba(255, 107, 53, 0.38);
            transition: all 0.2s ease;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
        }
        #wechat-qq-blocker-modal .wqb-copy-btn:active {
            transform: scale(0.96);
            box-shadow: 0 3px 12px rgba(255, 107, 53, 0.25);
        }
        #wechat-qq-blocker-modal .wqb-copy-btn .wqb-sub {
            display: block;
            font-size: 13px;
            font-weight: 400;
            opacity: 0.85;
            margin-top: 2px;
            letter-spacing: 0.3px;
        }
        #wechat-qq-blocker-modal .wqb-footer-tip {
            margin-top: 14px;
            font-size: 12px;
            color: #999;
            letter-spacing: 0.3px;
        }

        /* Toast */
        #wechat-qq-blocker-toast {
            position: fixed;
            bottom: 15%;
            left: 50%;
            transform: translateX(-50%) scale(0.9);
            background: rgba(0, 0, 0, 0.78);
            color: #fff;
            padding: 14px 32px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 500;
            z-index: 1000000;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            pointer-events: none;
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            white-space: nowrap;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
        }
        #wechat-qq-blocker-toast.wqb-show {
            opacity: 1;
            transform: translateX(-50%) scale(1);
        }

        /* 响应式 */
        @media (max-width: 420px) {
            #wechat-qq-blocker-modal {
                padding: 24px 18px 22px;
                width: 92%;
            }
            #wechat-qq-blocker-modal h2 {
                font-size: 20px;
            }
            #wechat-qq-blocker-modal .wqb-desc {
                font-size: 14px;
            }
            #wechat-qq-blocker-modal .wqb-copy-btn {
                font-size: 17px;
                padding: 13px 0;
            }
            #wechat-qq-blocker-modal .wqb-guide {
                font-size: 13px;
                padding: 12px 14px;
            }
            #wechat-qq-blocker-modal .wqb-icon {
                width: 48px;
                height: 48px;
                font-size: 26px;
                line-height: 48px;
            }
        }
        @media (max-width: 350px) {
            #wechat-qq-blocker-modal {
                padding: 18px 14px 18px;
            }
            #wechat-qq-blocker-modal h2 {
                font-size: 17px;
            }
            #wechat-qq-blocker-modal .wqb-desc {
                font-size: 13px;
            }
            #wechat-qq-blocker-modal .wqb-copy-btn {
                font-size: 15px;
                padding: 11px 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ---------- 创建 HTML 结构 ----------
    var overlay = document.createElement('div');
    overlay.id = 'wechat-qq-blocker-overlay';

    // 构建引导步骤
    var stepsHtml = CONFIG.guideSteps.map(function(step, index) {
        return '<div class="wqb-step"><span class="wqb-num">' + (index + 1) + '</span><span class="wqb-text">' + step + '</span></div>';
    }).join('');

    overlay.innerHTML = `
        <div id="wechat-qq-blocker-modal">
            <div class="wqb-icon">⚠</div>
            <h2>${CONFIG.title}</h2>
            <p class="wqb-desc">${CONFIG.description}</p>
            <div class="wqb-guide">${stepsHtml}</div>
            <div class="wqb-copy-area" id="wqb-copy-trigger">
                <button class="wqb-copy-btn" id="wqb-copy-btn">
                    ${CONFIG.copyButtonText}
                    <span class="wqb-sub">${CONFIG.copyButtonSub}</span>
                </button>
            </div>
            <p class="wqb-footer-tip">— 点击按钮或屏幕任意位置均可复制 —</p>
        </div>
    `;

    document.body.appendChild(overlay);

    // ---------- Toast 元素 ----------
    var toast = document.createElement('div');
    toast.id = 'wechat-qq-blocker-toast';
    document.body.appendChild(toast);

    // ---------- 锁定页面 ----------
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.webkitOverflowScrolling = 'none';

    // ---------- 阻止遮罩下的滚动和事件 ----------
    overlay.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    overlay.addEventListener('wheel', function(e) {
        e.preventDefault();
    }, { passive: false });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    }, true);

    // ---------- 复制功能 ----------
    var currentUrl = window.location.href;
    var toastTimer = null;

    function showToast(msg, isError) {
        toast.textContent = msg;
        toast.style.background = isError ? 'rgba(200,50,50,0.88)' : 'rgba(0,0,0,0.78)';
        toast.classList.add('wqb-show');
        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function() {
            toast.classList.remove('wqb-show');
        }, 2200);
    }

    function copyLink() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(currentUrl).then(function() {
                showToast(CONFIG.toastSuccess);
                if (typeof CONFIG.onCopy === 'function') CONFIG.onCopy(true);
            }).catch(function() {
                fallbackCopy(currentUrl);
            });
        } else {
            fallbackCopy(currentUrl);
        }
    }

    function fallbackCopy(text) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            var success = document.execCommand('copy');
            if (success) {
                showToast(CONFIG.toastSuccess);
                if (typeof CONFIG.onCopy === 'function') CONFIG.onCopy(true);
            } else {
                showToast(CONFIG.toastError, true);
                if (typeof CONFIG.onCopy === 'function') CONFIG.onCopy(false);
            }
        } catch (e) {
            showToast(CONFIG.toastError, true);
            if (typeof CONFIG.onCopy === 'function') CONFIG.onCopy(false);
        }
        document.body.removeChild(textarea);
    }

    // ---------- 绑定事件 ----------
    var modal = document.getElementById('wechat-qq-blocker-modal');
    var copyBtn = document.getElementById('wqb-copy-btn');
    var copyTrigger = document.getElementById('wqb-copy-trigger');

    // 点击复制按钮
    copyBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        copyLink();
    });

    // 点击复制区域
    copyTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        copyLink();
    });

    // 点击弹窗卡片（除按钮/区域外）
    modal.addEventListener('click', function(e) {
        if (e.target.closest('#wqb-copy-btn') || e.target.closest('#wqb-copy-trigger')) {
            return;
        }
        copyLink();
    });

    // 点击遮罩背景
    overlay.addEventListener('click', function(e) {
        if (e.target.closest('#wechat-qq-blocker-modal')) {
            return;
        }
        copyLink();
    });

    // 阻止事件冒泡到下层
    overlay.addEventListener('click', function(e) {
        if (e.target.closest('#wechat-qq-blocker-modal')) {
            return;
        }
        e.stopPropagation();
    }, true);

    overlay.addEventListener('touchstart', function(e) {
        if (e.target.closest('#wechat-qq-blocker-modal')) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    // 允许用户配置扩展（暴露全局对象）
    window.WechatQQBlocker = {
        config: CONFIG,
        // 可手动调用复制
        copyLink: copyLink,
        // 可更新配置（需重新生成？但简单起见，只暴露）
        updateConfig: function(newConfig) {
            Object.assign(CONFIG, newConfig);
        }
    };

    console.log('[WechatQQBlocker] 已拦截微信/QQ内置浏览器，弹窗已启动。');

})();
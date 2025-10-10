// API 的 URL 前缀
const live2d_api_prefix = 'https://gddhy.github.io/live2d';
// const live2d_api_prefix = 'http://127.0.0.1:4000/live2d/'; // 本地 demo 测试使用

// 同时需要引入的 css
const live2d_waifu_css = ['/live2d/waifu.css'];
// const live2d_waifu_css = ['/src/waifu.css'];

// 需要引入的 js 文件，无需手动添加 Jquery 因为后面会自动检测并添加
const live2d_waifu_js = ['/live2d/live2d.min.js', '/live2d/waifu-tips.js']
// const live2d_waifu_js = ['/src/live2d.min.js', '/src/waifu-tips.js'] // 本地 demo 测试使用

// live2d 区域的 DOM 代码
const live2d_dom_html = `<div class="l2d_xb" data-api="${live2d_api_prefix}">
<div class="waifu">
    <div class="waifu-tips"></div>
    <canvas id="live2d" width="220" height="250" class="live2d"></canvas>
    <div class="waifu-tool">
        <span class="wt-home"><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg></span>
        <span class="wt-comments"><svg width="19" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M416 192c0-88.4-93.1-160-208-160S0 103.6 0 192c0 34.3 14.1 65.9 38 92-13.4 30.2-35.5 54.2-35.8 54.5-2.2 2.3-2.8 5.7-1.5 8.7S4.8 352 8 352c36.6 0 66.9-12.3 88.7-25 32.2 15.7 70.3 25 111.3 25 114.9 0 208-71.6 208-160zm122 220c23.9-26 38-57.7 38-92 0-66.9-53.5-124.2-129.3-148.1.9 6.6 1.3 13.3 1.3 20.1 0 105.9-107.7 192-240 192-10.8 0-21.3-.8-31.7-1.9C207.8 439.6 281.8 480 368 480c41 0 79.1-9.2 111.3-25 21.8 12.7 52.1 25 88.7 25 3.2 0 6.1-1.9 7.3-4.8 1.3-2.9.7-6.3-1.5-8.7-.3-.3-22.4-24.2-35.8-54.5z"></path></svg></span>
        <span class="wt-drivers-license-o"><svg width="18" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M528 32H48C21.5 32 0 53.5 0 80v16h576V80c0-26.5-21.5-48-48-48zM0 432c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V128H0v304zm352-232c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zm0 64c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zm0 64c0-4.4 3.6-8 8-8h144c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H360c-4.4 0-8-3.6-8-8v-16zM176 192c35.3 0 64 28.7 64 64s-28.7 64-64 64-64-28.7-64-64 28.7-64 64-64zM67.1 396.2C75.5 370.5 99.6 352 128 352h8.2c12.3 5.1 25.7 8 39.8 8s27.6-2.9 39.8-8h8.2c28.4 0 52.5 18.5 60.9 44.2 3.2 9.9-5.2 19.8-15.6 19.8H82.7c-10.4 0-18.8-10-15.6-19.8z"></path></svg></span>
        <span class="wt-street-view"><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M367.9 329.76c-4.62 5.3-9.78 10.1-15.9 13.65v22.94c66.52 9.34 112 28.05 112 49.65 0 30.93-93.12 56-208 56S48 446.93 48 416c0-21.6 45.48-40.3 112-49.65v-22.94c-6.12-3.55-11.28-8.35-15.9-13.65C58.87 345.34 0 378.05 0 416c0 53.02 114.62 96 256 96s256-42.98 256-96c0-37.95-58.87-70.66-144.1-86.24zM256 128c35.35 0 64-28.65 64-64S291.35 0 256 0s-64 28.65-64 64 28.65 64 64 64zm-64 192v96c0 17.67 14.33 32 32 32h64c17.67 0 32-14.33 32-32v-96c17.67 0 32-14.33 32-32v-96c0-26.51-21.49-48-48-48h-11.8c-11.07 5.03-23.26 8-36.2 8s-25.13-2.97-36.2-8H208c-26.51 0-48 21.49-48 48v96c0 17.67 14.33 32 32 32z"></path></svg></span>
        <span class="wt-camera"><svg width="19" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M512 144v288c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V144c0-26.5 21.5-48 48-48h88l12.3-32.9c7-18.7 24.9-31.1 44.9-31.1h125.5c20 0 37.9 12.4 44.9 31.1L376 96h88c26.5 0 48 21.5 48 48zM376 288c0-66.2-53.8-120-120-120s-120 53.8-120 120 53.8 120 120 120 120-53.8 120-120zm-32 0c0 48.5-39.5 88-88 88s-88-39.5-88-88 39.5-88 88-88 88 39.5 88 88z"></path></svg></span>
        <span class="wt-info-circle"><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg></span>
        <span class="wt-close"><svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path></svg></span>
    </div>
</div>
</div>
<div id="waifu-btn" class="waifu-btn" title="出来！"></div>`;
// 自定义提示信息配置
const wordDict = {
    appear: '兔然出现~', // 隐藏后显示时的提示
    afterCamera: '咱可爱吗？', // 拍照按钮按下时
    goodbye: '再见了呐~', // 隐藏时
    oncopy: '转载要加上出处哦~', // 复制时
    role: { // 不同看板娘的定制行为
        '22': { // 22 娘时
            appear: '是我喔！',
            naked: '有变态！@',
            dressing: '怎么样？'
        },
        '33': { // 33 娘时，对应的行为同上
            appear: '啊，又见面了', // 出现时（22、33 切换时）
            naked: '不要这样。。。', // 裸体模型出现时
            dressing: '嗯？' // 换装时（非裸体）
        }
    },
    time: { // 打开主页后，根据时间显示的信息，时间为 24 小时制，区间为左闭右开，仅支持整点
        '0,5': '哈？怎么这么晚还不睡啊',
        '5,8': '早上适合继续赖床',
        '8,11': '总感觉没睡够的说',
        '11,13': '干饭！',
        '13,17': '午后昏昏欲睡呢',
        '17,19': '傍晚应该补个觉',
        '19,22': '又到了睡觉的时间',
        '22,24': '时间不早了，早点睡吧'
    },
    welcome: { // 打开页面后的欢迎语，打开主页时，可以拓展针对指定 domain 的欢迎语，本配置不会生效（因为要使用 time 的配置）
        'baidu': '欢迎来自 <span style="color:#0099cc;">百度搜索</span> 的朋友', // 百度搜索的欢迎语
        'google': '欢迎来自 <span style="color:#0099cc;">谷歌搜索</span> 的朋友', // 谷歌搜索的欢迎语
        'so': '朋友，建议换一个广告少一些的搜索引擎', // 360搜索的欢迎语
        '_OTHERS': '欢迎来自 <span style="color:#0099cc;">%DOMAIN%</span> 的朋友', // 其他 DOMAIN 的欢迎信息，%HOSTNAME% 会被替换为具体的 hostname
        '_LOCAL': '欢迎来到<span style="color:#0099cc;">『%TITLE%』</span>', // 在本网站内的跳转、或者没有 hostname 的欢迎信息。%TITLE% 会被替换当前页面标题
    },
    // 鼠标悬浮在看板娘上的提示信息
    hover: ["你要干嘛呀？", "要姐姐陪你玩吗？", "喵喵喵？", "怕怕", "搞啥哦(⊙﹏⊙)"],
    // 鼠标悬浮在页面元素上的提示信息，因为各主题的页面元素可能不同，提供 JQuery 属性选择器的方式
    // 包含 .waifu-tool 的选择器通常不需要修改，允许自定义添加
    hint: {
        '.cd-top.cd-is-visible.cd-fade-out': '点击它可以回到顶部哦',
        '.waifu-tool .wt-home': '回到首页？',
        '.waifu-tool .wt-comments': '你想听到什么？',
        '.waifu-tool .wt-drivers-license-o': '要换人了吗？',
        '.waifu-tool .wt-street-view': '要换装吗？',
        '.waifu-tool .wt-camera': '要拍照了吗？！',
        '.waifu-tool .wt-info-circle': '想要更了解我吗？',
        '.waifu-tool .wt-close': '已经厌倦了吗？',
        // %TEXT% 将被 $(this).text() 替换，用于文本类标签有较好的效果
        '.post-title': '要看看<span style="color:#0099cc;">%TEXT%</span>么？',
        '.post-nepre.previous': '要看上一篇文章吗？',
        '.post-nepre.next': '要看下一篇文章吗？',
        '.comment-textarea': '留下您的伟论吧！',
        '.post-share': '要分享吗？感谢支持！',
    },
    clickThreshold: 6, // 点击数到达此上限后，再点击将显示 clickAngry 内的信息
    // 点击看板娘显示信息，%TIMES% 将被替换为当前的点击次数
    clickMsg: ["不小心的对吧，一定是这样", "我跑呀跑呀跑！~~", "再摸的话我可要报警了！⌇●﹏●⌇", "别摸我，有什么好摸的！", "不要摸我了，我超凶的！", "干嘛动我呀！小心我咬你！"],
    clickAngry: ["别过来！", "差不多得了。。。", "你已经摸我%TIMES%次了", "救命！", "妈耶", "110吗，这里有个变态一直在摸我(ó﹏ò｡)"],
}
// 其他的可配置项
window.poster2233 = {
    // 是否出现落体模型
    showR18Model: true,
    // 是否可以在屏幕里乱跑
    randomRun: true,
    // 使用的一言集合，配置成 null 使用接口获取一言内容
    hitokoto: null,
    // 一言的间隔时长，单位 ms
    restTimie: 60_000,
}

// 检测 JQuery
if (!window.$) {
    live2d_waifu_js[live2d_waifu_js.length] = 'https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js';
}

// 动态添加 css 文件
let loadStyle = function () {
    live2d_waifu_css.forEach(url => {
        let link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(link);
    });
}
// 添加 stript 文件
let loadScript = function (url) {
    live2d_waifu_js.forEach(url => {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.body.appendChild(script);
    });
}
// 加载依赖的静态文件
loadStyle();
loadScript();

// 注入 live2d 区域
const live2dWrapperDiv = document.createElement('div');
live2dWrapperDiv.innerHTML = live2d_dom_html;
document.body.appendChild(live2dWrapperDiv);

// 控制台签名
console.log('%chttps://mori.plus%cLive2d ~ 2233%c',
    'border-radius:3px;padding:3px;background:#000;color:#fff;',
    'border-radius:3px;padding:3px;background:#0af;color:#fff;',
    'background:transparent;');
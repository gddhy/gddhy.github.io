const CACHE_NAME = 'swf-player-v6';

// 可信任的 CDN 主机（用于运行时缓存，但预缓存已包含关键资源）
const CDN_HOSTS = new Set([
    'unpkg.com',
    'cdn.jsdelivr.net',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
]);

// 精确计算 SW 所在目录（绝对 URL）
const SW_BASE = self.location.href.replace(/\/[^/]*$/, '/');

// 预缓存资源列表（包括关键的 CDN 资源）
const PRECACHE_URLS = [
    // 本地资源
    SW_BASE,
    SW_BASE + 'index.html',
    SW_BASE + 'manifest.json',
    SW_BASE + 'ic_play.svg',
    SW_BASE + 'icon-192x192.png',
    SW_BASE + 'icon-512x512.png',
    SW_BASE + 'apple-touch-icon.png',
    SW_BASE + 'favicon-32x32.png',
    // Ruffle 本地兜底主脚本（CDN 全挂时由页面加载器切到它）
    SW_BASE + 'ruffle-0.4.1/ruffle.js',
    // 关键 CDN 资源（必须预缓存，确保离线样式/字体可用）
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
    // Ruffle 主脚本的两个 CDN 源，任一失败都不影响其他资源
    'https://unpkg.com/@ruffle-rs/ruffle',
    'https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle',
];

// === Ruffle 本地完整兜底套件（应对"完全离线且从未播放过"的情况）===
// 说明：ruffle.js 只是入口，真正的运行时是 core 分片 + wasm，由 Ruffle 运行时按需拉取。
// 浏览器会根据 SIMD/extensions 支持情况二选一，因此两套都要缓存才能覆盖所有环境：
//   core.ruffle.0875e… ←→ 63468f5….wasm （extensions 版，Chrome 走这套）
//   core.ruffle.831c4f… ←→ 1ef41ff….wasm （普通版）
// 体积约 29MB，在 install 阶段单独一批下载，不阻塞 SW 接管。
// ⚠️ 若日后升级本地 ruffle 版本，务必同步更新此清单与 RUFFLE_LOCAL_DIR。
const RUFFLE_LOCAL_DIR = 'ruffle-0.4.1/';
const RUFFLE_LOCAL_FILES = [
    'core.ruffle.0875e44536e955474b0c.js',
    'core.ruffle.831c4f4a93befb9e84af.js',
    '63468f5322aed2e768a8.wasm',
    '1ef41ff58c9763bed027.wasm',
];

// 安装：预缓存所有资源，单个失败不影响其他
self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);

        // 第一批：app shell 与关键 CDN 资源，体积小，并行拉取
        await Promise.all(
            PRECACHE_URLS.map(url =>
                cache.add(new Request(url, { cache: 'reload' }))
                    .catch(err => {
                        console.warn('[SW] 预缓存失败（可忽略）:', url, err);
                    })
            )
        );

        // 立即接管，不让下面的大文件拖住页面
        await self.skipWaiting();

        // 第二批：Ruffle 本地兜底套件（约 29MB）。串行下载避免抢占带宽；
        // 不用 cache:'reload'，允许命中浏览器 HTTP 缓存，SW 版本升级时不必重下。
        for (const name of RUFFLE_LOCAL_FILES) {
            const url = SW_BASE + RUFFLE_LOCAL_DIR + name;
            try {
                await cache.add(url);
            } catch (err) {
                console.warn('[SW] Ruffle 兜底资源缓存失败（可忽略）:', url, err);
            }
        }
    })());
});

// 激活：清理旧缓存并立即接管
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

// 判断是否拦截该请求
function shouldIntercept(request) {
    if (request.method !== 'GET') return false;
    const url = new URL(request.url);
    // 先检查是否属于排除目录（优先级最高）
    if (url.origin === self.location.origin) {
        const path = url.pathname;
        // 排除 /swf/_local_import/ 下的所有文件（包括子目录）
        if (path.startsWith('/swf/_local_import/')) {
            return false; // 不拦截，直接走网络
        }
    }
    // 同源：必须在作用域内（包括无斜杠情况）
    if (url.origin === self.location.origin) {
        const scope = self.registration.scope;
        const scopePath = new URL(scope).pathname;
        const path = url.pathname;
        // 允许 path 等于作用域路径（带/不带斜杠）
        if (path === scopePath || path === scopePath.slice(0, -1)) return true;
        if (path.startsWith(scopePath) && path.length > scopePath.length) return true;
        return false;
    }
    // 跨域：只信任列表中的 CDN 主机
    return CDN_HOSTS.has(url.hostname);
}

// === CDN 版本漂移标记 ===
// CDN 主脚本地址不带版本号，跟随 npm latest。哪天 Ruffle 发布新版，分片文件名的 hash 就会变，
// 本地 0.4.1 的同名映射随之失效——此时"CDN 主脚本能加载、分片却拿不到"是条死路，
// 因为页面加载器认为 CDN 是好的，根本不会降级。
// 所以一旦探测到这种组合，就写下标记；页面加载器读到它会把本地源提到最前。
// 标记与资源同放在 CACHE_NAME 里，升级缓存版本（比如同步了新的本地 ruffle 目录）时随旧缓存一并清除。
const DRIFT_FLAG_URL = SW_BASE + '__ruffle_drift__';

// 长得像 Ruffle 运行时资源（webpack content-hash 命名的 core 分片，或任意 wasm）
function looksLikeRuffleRuntime(url) {
    return url.origin !== self.location.origin
        && CDN_HOSTS.has(url.hostname)
        && (/\/core\.ruffle\.[0-9a-f]+\.js$/.test(url.pathname) || url.pathname.endsWith('.wasm'));
}

async function markVersionDrift(request, cache) {
    const url = new URL(request.url);
    if (!looksLikeRuffleRuntime(url)) return;
    // 文件名对得上说明版本一致，只是这次没取到，不算漂移
    if (RUFFLE_LOCAL_FILES.includes(url.pathname.split('/').pop())) return;
    try {
        await cache.put(DRIFT_FLAG_URL, new Response(RUFFLE_LOCAL_DIR, {
            headers: { 'Content-Type': 'text/plain' },
        }));
        console.warn('[SW] CDN Ruffle 版本已与本地兜底不匹配，下次加载将优先本地源:', url.pathname);
    } catch (e) {}
}

// CDN 的 Ruffle 运行时资源取不到时，用本地同名文件顶替。
// 只对 core 分片 / wasm 生效（主脚本不在此列——见下方 404 处的说明）。
// 之所以能直接顶替：本地 ruffle-0.4.1 与 CDN 解析到的是同一版本，文件名 hash 完全一致，
// 且这些是终端资源，不会再基于自身 URL 推导出新的请求路径。
async function ruffleLocalFallback(request, cache) {
    const url = new URL(request.url);
    if (url.origin === self.location.origin) return null;
    const name = url.pathname.split('/').pop();
    if (!RUFFLE_LOCAL_FILES.includes(name)) return null;

    const localUrl = SW_BASE + RUFFLE_LOCAL_DIR + name;
    let res = await cache.match(localUrl);
    if (!res) {
        // 预缓存没成功时再试一次网络（同源，外网不通但自家服务器可达的场景）
        try { res = await fetch(localUrl); } catch (e) { return null; }
        if (!res || !res.ok) return null;
        cache.put(localUrl, res.clone()).catch(() => {});
    }

    // 重建响应：显式补正 MIME（服务器可能不认 .wasm，会让 instantiateStreaming 失败），
    // 并带上 CORS 头，使其能满足原请求的跨域 cors 模式。body 流式透传，不占内存。
    return new Response(res.body, {
        status: 200,
        statusText: 'OK (local fallback)',
        headers: {
            'Content-Type': name.endsWith('.wasm')
                ? 'application/wasm'
                : 'text/javascript; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
        },
    });
}

// 处理请求：stale-while-revalidate，并为 CDN/非导航请求提供优雅 fallback
async function handleRequest(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    // 形状匹配，而非文件名精确匹配：CDN 版本漂移后分片 hash 会变，精确名单认不出，
    // 但"core.ruffle.<hash>.js / .wasm 且来自受信 CDN"的形状不变。只有按形状判断，
    // 才能把"漂移导致的 chunk 404"识别出来，进而走本地同名兜底（命中）或打漂移标记（不中）。
    const ruffleShaped = looksLikeRuffleRuntime(new URL(request.url));

    // 网络请求。普通资源沿用原请求（可能是 no-cors，允许缓存 opaque）；
    // Ruffle 运行时资源强制 cors，以便拿到真实状态码。
    const fetchPromise = (ruffleShaped
        ? fetch(request.url, { mode: 'cors', credentials: 'omit' })
        : fetch(request))
        .then(response => {
            // 只缓存有效响应（状态 200）。
            // 说明：Ruffle 主脚本已在页面侧以 crossorigin=anonymous 请求（CORS 可校验状态码），
            // 不会把 CDN 错误页当成功缓存；Ruffle 运行时资源走 cors，404 同样不会被缓存；
            // 其余跨域资源（字体等）仍按 opaque 缓存以支持离线。
            if (response && (response.ok || (response.type === 'opaque' && !ruffleShaped))) {
                cache.put(request, response.clone()).catch(() => {});
            }
            return response;
        })
        .catch(() => null);

    // 缓存命中：立即返回，后台更新。
    // 例外：Ruffle 运行时资源若缓存的是 opaque 副本，可能是旧版 SW 固化的 CDN 错误页，
    // 内容真假不可知，跳过它重新走网络（网络也不行时会落到下面的本地兜底）。
    if (cached && !(ruffleShaped && cached.type === 'opaque')) {
        fetchPromise.catch(() => {});
        return cached;
    }

    // 无缓存：等待网络。
    // Ruffle 运行时资源拿到 4xx/5xx 时不能交给页面——那是 CDN 的错误页或漂移后的新 chunk，
    // 会让 Ruffle 报 "Failed to load Ruffle WASM"，必须继续往下走本地兜底 / 漂移标记。
    const networkResponse = await fetchPromise;
    if (networkResponse && !(ruffleShaped && !networkResponse.ok)) return networkResponse;

    // === 网络失败且无缓存 ===
    // 如果是导航请求，返回离线页面
    if (request.mode === 'navigate') {
        // 尝试多种可能的 shell 地址
        const shellUrls = [
            SW_BASE + 'index.html',
            SW_BASE,
            self.location.origin + '/index.html',
        ];
        for (const url of shellUrls) {
            const shell = await cache.match(url);
            if (shell) return shell;
        }
        // 实在找不到，返回一个简单离线提示
        return new Response(
            '<html><body><h1>Offline</h1><p>Please reconnect to access the app.</p></body></html>',
            { status: 503, headers: { 'Content-Type': 'text/html' } }
        );
    }

    // Ruffle 的 core 分片 / wasm：用本地预缓存的同名文件顶替。
    // 两种情况会走到这里，共同前提都是"CDN 主脚本已被预缓存、页面加载器因此不会降级"：
    //   1) 完全离线且从未播放过 SWF —— 分片和 wasm 不在缓存，网络层失败；
    //   2) CDN 返回 4xx/5xx（路径失效、CDN 故障）—— 上面已拦下错误响应。
    const localRuffle = await ruffleLocalFallback(request, cache);
    if (localRuffle) return localRuffle;

    // 本地兜底也没能顶上：若这请求看着就是 Ruffle 运行时资源、文件名却不在本地清单，
    // 说明 CDN 已升到新版本，与本地 0.4.1 对不上——记下标记，让页面下次改走本地源。
    await markVersionDrift(request, cache);

    // 对于非导航请求（CSS/JS/字体/图片等），返回 404 空响应，避免解析错误
    // 注意：Ruffle 的 CDN 主脚本失败时不能在此处返回本地文件顶替，
    // 否则 Ruffle 会按 CDN 地址去取 wasm/core 分片；必须让 404 冒泡，
    // 由页面的加载器切换到下一个源（jsdelivr → 本地 ruffle-0.4.1/ruffle.js）。
    return new Response(null, {
        status: 404,
        statusText: 'Not Found (offline)'
    });
}

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (!shouldIntercept(event.request)) return;
    event.respondWith(handleRequest(event.request));
});
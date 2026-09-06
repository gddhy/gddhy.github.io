/*
 * FC/NES 模拟器 Service Worker
 * 预缓存全部静态资源与 ROM，离线可用。
 * 部署于站点 /nes/ 子目录，全部使用相对路径。
 */
var CACHE_NAME = 'fcgame-cache-v3';

/*
 * 线上服务器可能对 './'、'./index.html' 等地址做 301/302 重定向（本地静态服务器没有），
 * 带 redirected 标记的响应不能直接 respondWith 给导航请求（redirect mode 为 manual），
 * 否则 Chrome/Edge 会报 "a redirected response was used ..." -> 页面 ERR_FAILED。
 * 这里统一剥离 redirected 标记，重建一个干净的 Response 再缓存/返回。
 */
function cleanResponse(response) {
    if (!response || !response.redirected) {
        return Promise.resolve(response);
    }
    return response.blob().then(function (body) {
        return new Response(body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers
        });
    });
}

/* 逐个 fetch + 清洗后写入缓存（替代 cache.addAll，避免缓存 redirected 响应） */
function cacheClean(cache, urls, required) {
    return Promise.all(urls.map(function (url) {
        return fetch(url, { redirect: 'follow' }).then(function (response) {
            if (!response || response.status !== 200) {
                throw new Error('bad status ' + (response && response.status) + ' for ' + url);
            }
            return cleanResponse(response).then(function (cleaned) {
                return cache.put(url, cleaned);
            });
        }).catch(function (err) {
            if (required) {
                throw err;
            }
            console.warn('[SW] 预缓存失败(不影响安装):', url, err);
        });
    }));
}

var CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './favicon.ico',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './css/jsnes.css',
    './nes.js',
    './utils.js',
    './cpu.js',
    './keyboard.js',
    './mappers.js',
    './papu.js',
    './ppu.js',
    './rom.js',
    './ui.js',
    './lib/jquery-1.4.2.min.js',
    './lib/dynamicaudio-min.js',
    './lib/debug.mini.js',
    './lib/nipplejs.min.js',
    './lib/joystick.js'
];

// 非常规 MIME 类型，部分静态服务器可能不允许访问，缓存失败不阻断安装
var OPTIONAL_ASSETS = [
    './jsnes-ie-hacks.vbscript',
    './lib/dynamicaudio.swf'
];

var ROM_ASSETS = [
    'roms/1981/5.nes',
    'roms/bfirsh/Bubble Bobble (U).nes',
    'roms/bfirsh/Dr. Mario (JU).nes',
    'roms/bfirsh/Golf (JU).nes',
    'roms/bfirsh/Super Mario Bros. 3 (U) (PRG1) [!].nes',
    'roms/Contra/Contra1(U)30.nes',
    'roms/Contra/Contra1(U)30F.nes',
    'roms/Contra/Contra1(U)30L.nes',
    'roms/Contra/Contra1(U)30M.nes',
    'roms/Contra/Contra1(U)30S.nes',
    'roms/Contra/Contra1(U)F.nes',
    'roms/Contra/Contra1(U)L.nes',
    'roms/Contra/Contra1(U)M.nes',
    'roms/Contra/Contra1(U)S.nes',
    'roms/croom/croom.nes',
    'roms/Double Dragon/Double Dragon1.nes',
    'roms/Double Dragon/Double Dragon2.nes',
    'roms/Double Dragon/Double Dragon3.nes',
    'roms/Double Dragon/Double Dragon4.nes',
    'roms/lj65/lj65.nes',
    'roms/Ninja_Gaiden/Ninja_Gaiden1.nes',
    'roms/Ninja_Gaiden/Ninja_Gaiden2.nes',
    'roms/Ninja_Gaiden/Ninja_Gaiden3.nes',
    'roms/other/Jackal.nes',
    'roms/other/Kage.nes',
    'roms/other/Tennis (JU) [!].nes',
    'roms/other/Tetris (U) [!].nes',
    'roms/other/Tetris 2 (U) [!].nes',
    'roms/other/Zelda II - The Adventure of Link (U).nes',
    'roms/other/Zhong Guo Xiang Qi.nes',
    'roms/rom1/(Ch) Missile Tank.nes',
    'roms/rom1/(Ch) Tank 1990.nes',
    'roms/rom1/(Hacker) AV Mahjongg.nes',
    'roms/rom1/(J) (V1.2) Yie Ar Kung-Fu [!].nes',
    'roms/rom1/(J) Antarctic Adventure [!].nes',
    'roms/rom1/(J) Arkanoid [!].nes',
    'roms/rom1/(J) Battle City.nes',
    'roms/rom1/(J) Bomberman [!].nes',
    'roms/rom1/(J) Circus Charlie [!].nes',
    'roms/rom1/(J) Dig Dug [!].nes',
    'roms/rom1/(J) F-1 Race [!].nes',
    'roms/rom1/(J) Galaxian [!].nes',
    'roms/rom1/(J) Goonies, The [!].nes',
    'roms/rom1/(J) Ice Climber.nes',
    'roms/rom1/(J) Kage no Densetsu [!].nes',
    'roms/rom1/(J) Mappy [!].nes',
    'roms/rom1/(J) Pooyan.nes',
    'roms/rom1/(J) Road Fighter [!].nes',
    'roms/rom1/(J) Spartan X [!].nes',
    'roms/rom1/(J) Spelunker [!].nes',
    'roms/rom1/(J) Takahashi Meijin no Bouken Shima [!].nes',
    'roms/rom1/(J) TwinBee [!].nes',
    'roms/rom1/(JU) (PRG0) Mach Rider [!].nes',
    'roms/rom1/(JU) Excitebike [!].nes',
    'roms/rom1/(Tengen) Tetris [!].nes',
    'roms/rom1/(W) Super Mario Bros. [!].nes',
    'roms/rom1/(W) Wrecking Crew [!].nes',
    'roms/rom1/Championship Lode Runner (J).nes',
    'roms/rom1/TaoJinZhe.nes',
    'roms/rom2/1943.nes',
    'roms/rom2/Cross Fire (J).nes',
    'roms/rom2/Life Force [!].nes',
    'roms/rom2/Mighty Final Fight.nes',
    'roms/rom2/Pac-Man.nes',
    'roms/rom2/Rainbow Islands.nes',
    'roms/rom2/RockinCats.nes',
    'roms/rom2/Shufflepuck Cafe.nes',
    'roms/rom2/Side Pocket.nes'
];

// ROM 路径含空格/括号等字符，统一 encodeURI，与页面加载时的编码方式保持一致
var ROM_URLS = OPTIONAL_ASSETS.concat(ROM_ASSETS.map(function (p) {
    return encodeURI('./' + p);
}));

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            // 核心资源必须全部缓存成功，否则安装失败
            return cacheClean(cache, CORE_ASSETS, true).then(function () {
                // ROM 逐个尽力缓存，个别失败不阻断 SW 安装
                return cacheClean(cache, ROM_URLS, false);
            });
        }).then(function () {
            return self.skipWaiting();
        })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (key) {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            }));
        }).then(function () {
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') {
        return;
    }
    var url = new URL(event.request.url);
    if (url.origin !== self.location.origin) {
        return;
    }
    var isNavigate = event.request.mode === 'navigate';
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(function (cached) {
            if (cached) {
                // 缓存里的历史条目也可能带 redirected 标记，导航请求必须清洗后返回
                return cleanResponse(cached);
            }
            // 导航请求跟随重定向拉取，其余照常
            var req = isNavigate ? new Request(event.request.url, { redirect: 'follow' }) : event.request;
            return fetch(req).then(function (response) {
                // 运行时缓存：新的同源资源也存入缓存（清洗掉 redirected 标记）
                if (response && response.status === 200 && (response.type === 'basic' || response.type === 'default')) {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cleanResponse(clone).then(function (cleaned) {
                            cache.put(event.request, cleaned);
                        });
                    });
                    // 导航请求本身也要返回清洗后的响应
                    return cleanResponse(response);
                }
                return response;
            });
        }).catch(function () {
            // 离线/异常兜底：导航请求回退到缓存的 index.html，其余返回明确的错误响应
            if (isNavigate) {
                return caches.match('./index.html').then(function (fallback) {
                    return fallback ? cleanResponse(fallback) : Response.error();
                });
            }
            return Response.error();
        })
    );
});

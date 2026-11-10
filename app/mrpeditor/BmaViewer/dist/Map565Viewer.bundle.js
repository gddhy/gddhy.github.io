/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 44:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var base64_1 = __webpack_require__(161);
var Map565Loader = /** @class */ (function () {
    function Map565Loader() {
    }
    Map565Loader.getMAP565Data = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var header, possibleWidths, len, i, width_1, view, width, height, transparentColor;
            return __generator(this, function (_a) {
                header = Array.from(data.slice(0, 4)).map(function (code) { return String.fromCharCode(code); }).join('');
                if (header !== 'MAP5' && header !== 'MAP8') {
                    possibleWidths = [];
                    len = data.length / 2;
                    for (i = 8; i <= 240; i++) {
                        if (len % i === 0) {
                            possibleWidths.push(i);
                        }
                    }
                    width_1 = possibleWidths[Math.floor(possibleWidths.length / 2)];
                    return [2 /*return*/, this.getMAP565DataWidth(data, width_1)];
                }
                view = new DataView(data.buffer);
                width = view.getUint16(4, true);
                height = view.getUint16(8, true);
                transparentColor = view.getUint16(12, true);
                return [2 /*return*/, {
                        header: header,
                        width: width,
                        height: height,
                        trcolor: this.convert565ToColor(transparentColor),
                        data: data.slice(14)
                    }];
            });
        });
    };
    Map565Loader.getMAP565DataWidth = function (data, width) {
        var height = Math.floor(data.length / 2 / width);
        return {
            header: "",
            width: width,
            height: height,
            trcolor: this.convert565ToColor(0),
            data: data
        };
    };
    Map565Loader.convert565ToRGB = function (color565) {
        var r = ((color565 >> 11) & 0x1F) << 3;
        var g = ((color565 >> 5) & 0x3F) << 2;
        var b = (color565 & 0x1F) << 3;
        return (r << 16) | (g << 8) | b;
    };
    Map565Loader.convert565ToColor = function (color565) {
        var rgb = this.convert565ToRGB(color565);
        return "#".concat((0x1000000 + rgb).toString(16).slice(1));
    };
    Map565Loader.convertColorTo565 = function (color) {
        var hex = color.replace('#', '');
        var r = parseInt(hex.substr(0, 2), 16) >> 3;
        var g = parseInt(hex.substr(2, 2), 16) >> 2;
        var b = parseInt(hex.substr(4, 2), 16) >> 3;
        return ((r << 11) | (g << 5) | b);
    };
    Map565Loader.loadMap565Data = function (mapData_1) {
        return __awaiter(this, arguments, void 0, function (mapData, isAlpha) {
            var width, height, data, canvas, ctx, imageData, view, transparentColor, y, x, idx, pixelData;
            if (isAlpha === void 0) { isAlpha = false; }
            return __generator(this, function (_a) {
                width = mapData.width, height = mapData.height, data = mapData.data;
                canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                ctx = canvas.getContext('2d');
                imageData = ctx.createImageData(width, height);
                view = new DataView(data.buffer);
                transparentColor = this.convertColorTo565(mapData.trcolor);
                for (y = 0; y < height; y++) {
                    for (x = 0; x < width; x++) {
                        idx = (y * width + x) * 4;
                        pixelData = view.getUint16(((y * width + x) * 2), true);
                        if (pixelData === transparentColor && isAlpha) {
                            imageData.data[idx] = 0;
                            imageData.data[idx + 1] = 0;
                            imageData.data[idx + 2] = 0;
                            imageData.data[idx + 3] = 0;
                        }
                        else {
                            imageData.data[idx] = ((pixelData >> 11) & 0x1F) << 3;
                            imageData.data[idx + 1] = ((pixelData >> 5) & 0x3F) << 2;
                            imageData.data[idx + 2] = (pixelData & 0x1F) << 3;
                            imageData.data[idx + 3] = 255;
                        }
                    }
                }
                return [2 /*return*/, imageData];
            });
        });
    };
    return Map565Loader;
}());
var Map565Viewer = /** @class */ (function () {
    function Map565Viewer(container) {
        this.mapData = null;
        this.scale = 1;
        this.isAlpha = true;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.container = container;
        // 检查是否已存在 canvas，如果存在则移除
        var existingCanvas = this.container.querySelector('canvas');
        if (existingCanvas) {
            this.container.removeChild(existingCanvas);
        }
        // 创建新的 canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.setupUI();
        this.setupInteractions();
    }
    Map565Viewer.prototype.setupUI = function () {
        var _this = this;
        var controls = document.createElement('div');
        controls.style.position = 'absolute';
        controls.style.bottom = '10px';
        controls.style.left = '10px';
        controls.style.backgroundColor = 'rgba(0,0,0,0.7)';
        controls.style.padding = '10px';
        controls.style.borderRadius = '5px';
        controls.style.color = 'white';
        var info = document.createElement('div');
        info.id = 'map565-info';
        controls.appendChild(info);
        var alphaToggle = document.createElement('button');
        alphaToggle.textContent = '切换透明度';
        alphaToggle.addEventListener('click', function () {
            _this.isAlpha = !_this.isAlpha;
            _this.render();
        });
        controls.appendChild(alphaToggle);
        var widthDown = document.createElement('button');
        widthDown.textContent = '宽度减';
        widthDown.addEventListener('click', function () { return _this.adjustWidth(-1); });
        controls.appendChild(widthDown);
        var widthUp = document.createElement('button');
        widthUp.textContent = '宽度加';
        widthUp.addEventListener('click', function () { return _this.adjustWidth(1); });
        controls.appendChild(widthUp);
        var savePng = document.createElement('button');
        savePng.textContent = '保存为PNG';
        savePng.addEventListener('click', function () { return _this.saveAsPng(); });
        controls.appendChild(savePng);
        var saveTransPng = document.createElement('button');
        saveTransPng.textContent = '保存为透明PNG';
        saveTransPng.addEventListener('click', function () { return _this.saveAsPng(true); });
        controls.appendChild(saveTransPng);
        this.container.appendChild(controls);
    };
    Map565Viewer.prototype.setupInteractions = function () {
        var _this = this;
        // 鼠标滚轮缩放
        this.container.addEventListener('wheel', function (e) {
            e.preventDefault();
            var delta = -e.deltaY;
            var zoomFactor = delta > 0 ? 1.1 : 0.9;
            _this.zoom(zoomFactor, e.clientX, e.clientY);
        });
        // 判断是否为手机模式
        if ('ontouchstart' in window) {
            console.log("当前为手机模式");
            // 手机触摸缩放
            var startDistance_1 = 0;
            var initialScale_1 = this.scale;
            this.container.addEventListener('touchstart', function (e) {
                console.log("touchstart");
                if (e.touches.length === 2) {
                    startDistance_1 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                    initialScale_1 = _this.scale;
                }
                else if (e.touches.length == 1) {
                    _this.isDragging = true;
                    _this.dragStartX = e.touches[0].clientX - _this.offsetX;
                    _this.dragStartY = e.touches[0].clientY - _this.offsetY;
                    _this.canvas.style.cursor = 'grabbing';
                }
            });
            this.container.addEventListener('touchmove', function (e) {
                if (e.touches.length === 2) {
                    var currentDistance = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                    var scaleFactor = currentDistance / startDistance_1;
                    _this.zoom(initialScale_1 * scaleFactor, undefined, undefined);
                }
                else if (e.touches.length == 1 && _this.isDragging) {
                    _this.offsetX = e.touches[0].clientX - _this.dragStartX;
                    _this.offsetY = e.touches[0].clientY - _this.dragStartY;
                    _this.updateCanvasPosition();
                }
            });
            this.container.addEventListener('touchend', function () {
                _this.isDragging = false;
                _this.canvas.style.cursor = 'grab';
            });
        }
        else {
            console.log("当前为电脑模式");
            // 鼠标拖动
            this.canvas.addEventListener('mousedown', function (e) {
                _this.isDragging = true;
                _this.dragStartX = e.clientX - _this.offsetX;
                _this.dragStartY = e.clientY - _this.offsetY;
                _this.canvas.style.cursor = 'grabbing';
            });
            document.addEventListener('mousemove', function (e) {
                if (!_this.isDragging)
                    return;
                _this.offsetX = e.clientX - _this.dragStartX;
                _this.offsetY = e.clientY - _this.dragStartY;
                _this.updateCanvasPosition();
            });
            document.addEventListener('mouseup', function () {
                _this.isDragging = false;
                _this.canvas.style.cursor = 'grab';
            });
        }
    };
    Map565Viewer.prototype.zoom = function (factor, mouseX, mouseY) {
        var oldScale = this.scale;
        this.scale *= factor;
        this.scale = Math.max(0.1, Math.min(this.scale, 10)); // 限制缩放范围
        // 以左上角为原点进行缩放
        if (mouseX !== undefined && mouseY !== undefined) {
            // 计算鼠标在容器中的相对位置
            var rect = this.container.getBoundingClientRect();
            var containerX = mouseX - rect.left;
            var containerY = mouseY - rect.top;
            // 计算鼠标在内容上的位置（相对于左上角）
            var contentX = containerX - this.offsetX;
            var contentY = containerY - this.offsetY;
            // 调整偏移量保持左上角固定
            this.offsetX = containerX - (contentX / oldScale) * this.scale;
            this.offsetY = containerY - (contentY / oldScale) * this.scale;
        }
        this.updateCanvasPosition();
    };
    Map565Viewer.prototype.updateCanvasPosition = function () {
        this.canvas.style.transform = "translate(".concat(this.offsetX, "px, ").concat(this.offsetY, "px) scale(").concat(this.scale, ")");
    };
    Map565Viewer.prototype.zoomIn = function () {
        // 以左上角为原点放大
        this.zoom(1.2, this.container.getBoundingClientRect().left, this.container.getBoundingClientRect().top);
    };
    Map565Viewer.prototype.zoomOut = function () {
        // 以左上角为原点缩小
        this.zoom(0.8, this.container.getBoundingClientRect().left, this.container.getBoundingClientRect().top);
    };
    Map565Viewer.prototype.resetZoom = function () {
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.updateCanvasPosition();
    };
    Map565Viewer.prototype.adjustWidth = function (direction) {
        return __awaiter(this, void 0, void 0, function () {
            var len, width, newWidth, i, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.mapData)
                            return [2 /*return*/];
                        len = this.mapData.data.length / 2;
                        width = this.mapData.width;
                        newWidth = width;
                        if (direction > 0) {
                            for (i = width + 1; i <= 320; i++) {
                                if (len % i === 0) {
                                    newWidth = i;
                                    break;
                                }
                            }
                        }
                        else {
                            for (i = width - 1; i > 2; i--) {
                                if (len % i === 0) {
                                    newWidth = i;
                                    break;
                                }
                            }
                        }
                        if (!(newWidth !== width)) return [3 /*break*/, 2];
                        this.mapData.width = newWidth;
                        this.mapData.height = Math.floor(len / newWidth);
                        return [4 /*yield*/, this.render()];
                    case 1:
                        _a.sent();
                        this.updateInfo();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Map565Viewer.prototype.updateInfo = function () {
        if (!this.mapData)
            return;
        var info = document.getElementById('map565-info');
        info.innerHTML = "\n            Width: ".concat(this.mapData.width, " \n            Height: ").concat(this.mapData.height, "\n            <div style=\"display:inline-block; width:20px; height:20px; background-color:").concat(this.mapData.trcolor, ";\"></div>\n        ");
    };
    Map565Viewer.prototype.loadFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = Uint8Array.bind;
                        return [4 /*yield*/, file.arrayBuffer()];
                    case 1:
                        data = new (_a.apply(Uint8Array, [void 0, _c.sent()]))();
                        _b = this;
                        return [4 /*yield*/, Map565Loader.getMAP565Data(data)];
                    case 2:
                        _b.mapData = _c.sent();
                        return [4 /*yield*/, this.render()];
                    case 3:
                        _c.sent();
                        this.updateInfo();
                        return [2 /*return*/];
                }
            });
        });
    };
    Map565Viewer.prototype.render = function () {
        return __awaiter(this, void 0, void 0, function () {
            var imageData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.mapData)
                            return [2 /*return*/];
                        return [4 /*yield*/, Map565Loader.loadMap565Data(this.mapData, this.isAlpha)];
                    case 1:
                        imageData = _a.sent();
                        this.canvas.width = this.mapData.width;
                        this.canvas.height = this.mapData.height;
                        this.ctx.putImageData(imageData, 0, 0);
                        return [2 /*return*/];
                }
            });
        });
    };
    Map565Viewer.prototype.saveAsPng = function (transparent) {
        if (transparent === void 0) { transparent = false; }
        if (!this.mapData)
            return;
        var link = document.createElement('a');
        link.download = "map565_".concat(this.mapData.width, "x").concat(this.mapData.height, ".png");
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    };
    return Map565Viewer;
}());
var Map565ViewerApp = /** @class */ (function () {
    function Map565ViewerApp() {
        var _this = this;
        // 初始化所有属性
        this.viewerContainer = document.getElementById('viewer-container');
        this.fileInput = document.getElementById('file-input');
        this.openBtn = document.getElementById('open-btn');
        this.zoomInBtn = document.getElementById('zoom-in-btn');
        this.zoomOutBtn = document.getElementById('zoom-out-btn');
        this.resetZoomBtn = document.getElementById('reset-zoom-btn');
        // 添加到工具栏
        var toolbar = document.getElementById('toolbar');
        // toolbar.appendChild(this.zoomInBtn);
        // toolbar.appendChild(this.zoomOutBtn);
        // toolbar.appendChild(this.resetZoomBtn);
        this.viewer = new Map565Viewer(this.viewerContainer);
        // 确保元素存在
        if (!this.viewerContainer || !this.fileInput || !this.openBtn) {
            throw new Error('Required HTML elements not found');
        }
        // 初始化元素
        this.menuToggle = document.getElementById('menu-toggle');
        this.toolbarButtons = document.getElementById('toolbar-buttons');
        // 设置移动端菜单切换
        this.menuToggle.addEventListener('click', function () {
            _this.toolbarButtons.classList.toggle('show');
        });
        // 点击按钮后关闭移动菜单
        this.toolbarButtons.querySelectorAll('button').forEach(function (button) {
            button.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    _this.toolbarButtons.classList.remove('show');
                }
            });
        });
        // 点击外部关闭菜单
        document.addEventListener('click', function (e) {
            if (window.innerWidth > 768)
                return;
            var target = e.target;
            if (!toolbar.contains(target) && target !== _this.menuToggle) {
                _this.toolbarButtons.classList.remove('show');
            }
        });
        // 窗口大小变化时调整
        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                _this.toolbarButtons.classList.remove('show');
            }
        });
        this.setupEventListeners();
        // 从storage加载文件
        var bmpfilename = localStorage.getItem("bmpfilename");
        var bmpfiledata = localStorage.getItem("bmpfiledata");
        if (bmpfilename && bmpfiledata) {
            // 对filedata进行base64解码
            var decodedData = (0, base64_1.decodeBase64)(bmpfiledata);
            // 封装成file
            var file = new File([decodedData], bmpfilename, { type: 'image/bmp' });
            // 调用loadFile方法加载
            this.viewer.loadFile(file).then(function () {
                console.log("\u52A0\u8F7D\u6587\u4EF6: ".concat(bmpfilename));
            });
        }
    }
    Map565ViewerApp.prototype.createButton = function (text, id) {
        var btn = document.createElement('button');
        btn.textContent = text;
        btn.id = id;
        btn.style.marginRight = '10px';
        btn.style.padding = '8px 16px';
        btn.style.borderRadius = '4px';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.backgroundColor = '#0d5bbc';
        btn.style.color = 'white';
        return btn;
    };
    Map565ViewerApp.prototype.setupEventListeners = function () {
        var _this = this;
        // Open file dialog when button is clicked
        this.openBtn.addEventListener('click', function () { return _this.fileInput.click(); });
        // Handle file selection
        this.fileInput.addEventListener('change', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var target, file;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        target = e.target;
                        file = (_a = target.files) === null || _a === void 0 ? void 0 : _a[0];
                        if (!file) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.viewer.loadFile(file)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        // Enable drag and drop
        this.viewerContainer.addEventListener('dragover', function (e) {
            e.preventDefault();
            _this.viewerContainer.style.backgroundColor = '#444';
        });
        this.viewerContainer.addEventListener('dragleave', function () {
            _this.viewerContainer.style.backgroundColor = '#333';
        });
        this.viewerContainer.addEventListener('drop', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var file;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        e.preventDefault();
                        this.viewerContainer.style.backgroundColor = '#333';
                        file = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files[0];
                        if (!file) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.viewer.loadFile(file)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
        // 缩放按钮监听器
        this.zoomInBtn.addEventListener('click', function () { return _this.viewer.zoomIn(); });
        this.zoomOutBtn.addEventListener('click', function () { return _this.viewer.zoomOut(); });
        this.resetZoomBtn.addEventListener('click', function () { return _this.viewer.resetZoom(); });
        // 拖放监听器
        this.setupDragAndDrop();
    };
    Map565ViewerApp.prototype.setupDragAndDrop = function () {
        var _this = this;
        this.viewerContainer.addEventListener('dragover', function (e) {
            e.preventDefault();
            _this.viewerContainer.style.backgroundColor = '#444';
        });
        this.viewerContainer.addEventListener('dragleave', function () {
            _this.viewerContainer.style.backgroundColor = '#333';
        });
        this.viewerContainer.addEventListener('drop', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var file;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        e.preventDefault();
                        this.viewerContainer.style.backgroundColor = '#333';
                        file = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.files[0];
                        if (!file) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.viewer.loadFile(file)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); });
    };
    return Map565ViewerApp;
}());
// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    window.bmaViewerApp = new Map565ViewerApp();
});


/***/ }),

/***/ 161:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.encodeBase64 = encodeBase64;
exports.decodeBase64 = decodeBase64;
/**
 * 将二进制数据编码为Base64字符串
 * @param data 二进制数据（Uint8Array）
 * @returns Base64编码的字符串
 */
function encodeBase64(data) {
    if (!data)
        throw new Error("Input data cannot be null");
    // 在浏览器环境中使用btoa，在Node.js中使用Buffer
    //   if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    // 浏览器环境
    var binary = '';
    var len = data.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(data[i]);
    }
    return window.btoa(binary);
    //   } else {
    //     // Node.js环境
    //     return Buffer.from(data).toString('base64');
    //   }
}
/**
 * 将Base64字符串解码为二进制数据
 * @param base64Str Base64编码的字符串
 * @returns 解码后的二进制数据（Uint8Array）
 */
function decodeBase64(base64Str) {
    if (!base64Str)
        throw new Error("Input string cannot be null");
    // 在浏览器环境中使用atob，在Node.js中使用Buffer
    //   if (typeof window !== 'undefined' && typeof window.atob === 'function') {
    // 浏览器环境
    var binaryStr = window.atob(base64Str);
    var len = binaryStr.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes;
    //   } else {
    //     // Node.js环境
    //     return new Uint8Array(Buffer.from(base64Str, 'base64'));
    //   }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(44);
/******/ 	
/******/ })()
;
# 小番茄图片混淆

基于 Gilbert 空间填充曲线的图片混淆/解混淆工具（Web 单页版）。

像素沿空间填充曲线平移，保持空间相关性，混淆后仍能被 JPEG 有效压缩。

## 使用

### 在线体验

[https://iris10086.github.io/pic-scramble/](https://iris10086.github.io/pic-scramble/)

### 本地使用

直接打开 `index.html` 即可，无需构建、无需服务器。

### 操作

| 方式 | 说明 |
|------|------|
| **点击上传框** | 从文件选择器选取图片 |
| **拖拽图片** | 将图片文件拖入页面任意位置 |
| **Ctrl+V 粘贴** | 粘贴截图或复制到剪贴板的图片 |
| **混淆** | 对当前图片执行混淆（加密） |
| **解混淆** | 对当前图片执行解混淆（解密） |
| **还原** | 恢复原始上传的图片 |
| **下载** | 保存当前显示的图片（JPEG 质量 1） |

## 算法说明

1. **Gilbert 空间填充曲线** — 广义 Hilbert 曲线，可处理任意尺寸的矩形网格，遍历每个像素恰好一次
2. **像素平移** — 沿曲线将每个像素向前移动固定偏移量：`offset = round((√5 - 1) / 2 × 总像素数)`（黄金比例）
3. **对称性** — 混淆与解混淆是同一操作的反向映射，多次操作需逆序还原

## 参考

- 算法基于 [jiarandiana0307/PicEncrypt](https://github.com/jiarandiana0307/PicEncrypt) 的开源项目
- 参考自 [singularpoint.cn/hideImg1.html](https://singularpoint.cn/hideImg1.html)
- Gilbert 曲线算法：*"A generalized Hilbert curve for arbitrary-sized 2D grids"*

## 许可证

[MIT](LICENSE)

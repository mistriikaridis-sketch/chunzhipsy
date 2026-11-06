# 素材来源

## 用户提供的素材

- dist/assets/logo.png：春枝心理 Logo，原始透明 PNG，4096 × 4096。
- dist/assets/wang-chunzhi.jpg：从《咨询师简介（王春枝）》的 word/media/image1.jpeg 原样提取，594 × 792。
- dist/assets/wechat-qr.png：用户提供的真实微信二维码，695 × 681；保持原始码点、中心图标、白边与字节内容。
- SHA256 及核对结果见 QA.md。

人物、Logo 和二维码未经过 AI 重绘。

## 首屏静物

最终文件：dist/assets/hero.webp，1024 × 1536，177,186 bytes。

使用内置 ImageGen 生成，非 CLI/API fallback。原始 PNG 保留在生成图片目录，交付版本只进行 WebP 编码优化，未裁切构图。

生成提示词：

> Use case: photorealistic-natural. Create a premium editorial still-life photograph for a Japanese minimalist psychological counselor website hero. This is an image ASSET, absolutely no website UI, no letters, no typography, no logos, no borders. Portrait aspect ratio 2:3. A single slender natural budding branch with sparse tiny soft-green leaves, standing in a small transparent lightly smoke-gray glass bottle with a little clear water, on a pale warm-gray plaster ledge. The bottle is low in the composition, at approximately the lower quarter, branch rising toward upper right. Entire image filled by an exquisite softly textured off-white plaster wall, tranquil large negative space upper left. A sharply composed broad diagonal patch of late-morning window light on the wall, subtle shadow of branch and simple window frame, with soft transitions and realistic bounced light. Calm neutral chalk, warm gray, just a hint of living green. Photo should feel tactile, expensive, quietly human, like a Japanese architectural or independent ceramics journal. Fine translucent glass, physically convincing refraction and gentle natural shadow. Understated, no yellow-orange cast, no beige Instagram filter, no artificial haze, no heavy grain, no 3D render, no flowers, no bonsai, no rocks, no pebbles, no incense, no meditation decor, no people. Composition elegantly asymmetric, allowing a gentle animated light overlay later. Ultra refined natural photographic realism, full bleed.

## 中文标题字体

Noto Serif SC，来自 Google 官方字体服务，自托管于 dist/assets/serif-*.woff2。家族名 Chunzhi Serif，300/400 字重，font-display: swap，按 Unicode 范围加载。

- 字体声明：dist/assets/fonts.css
- 官方样式来源存档：dist/assets/google-fonts-public.css
- SIL Open Font License：dist/assets/OFL-NotoSerifSC.txt

正文使用访客设备的系统黑体回退。网站运行时不请求 Google Fonts 或其他外部字体服务。

## 背景和交互

和纸纹理由 CSS 静态低透明噪声构成。窗光、视差、滚动显现与折叠动效由 CSS 和原生浏览器 API 实现，不依赖第三方脚本。

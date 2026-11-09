# 春枝心理网站

王春枝个人展示与咨询联系网站，采用日式和纸留白设计。中文首页为 `/`，英文版为 `/en/`，页头可通过 EN / 中文切换。中文文章为独立静态路径 `/blog/how-to-choose-youth-counselor/`。页面使用真实 Logo、老师照片与微信二维码，不展示价格，不收集来访者信息。

## 查看与运行

已生成可直接部署的静态网站，文件位于 `dist/`。没有运行时依赖，不需要安装依赖包。

安装有 Node.js 18 或以上时，在项目目录运行：

```powershell
npm run dev
```

或双击项目中的“启动预览.cmd”。默认中文地址为 http://127.0.0.1:4173/ ，英文地址为 http://127.0.0.1:4173/en/ 。终端保持运行，按 Ctrl+C 可停止。

端口被占用时，可在 PowerShell 中运行：

```powershell
$env:PORT = "4174"
npm run dev
```

这个变量仅影响当前终端，不改变系统配置。

## 修改内容

- `site.config.mjs`：中文介绍、咨询方向、专业训练、公益经历、网站域名及素材路径。
- `site.en.mjs`：与中文配置结构一致的英文内容；修改履历时需同步核对两个语言版本。
- `site.ui.mjs`：导航、按钮、说明、图片描述及无障碍标签等中英文界面词条。
- `src/index.template.html`：两个语言版本共用的页面模板。
- `src/article.template.html` 与 `src/articles.mjs`：中文文章页的模板与正文。
- `scripts/build.mjs`：根据内容配置与界面词条生成两个语言版本和中文文章页。
- `dist/styles.css`：排版、响应式布局、纸纹、光影与减少动态效果设置。
- `dist/app.js`：二维码弹窗、折叠、滚动显现、图片视差和当前导航高亮。
- `dist/assets/fonts.css`：自托管字体声明。
- `dist/assets/logo.png`：用户提供的原始 Logo。
- `dist/assets/wang-chunzhi.jpg`：从用户简介文档提取的原始照片。
- `dist/assets/wechat-qr.png`：用户提供的原始微信二维码，未裁切或重新绘制。
- `dist/assets/hero.webp`：内置 ImageGen 生成的首屏静物素材，经 WebP 编码优化。

修改配置、界面词条或页面模板后，运行：

```powershell
npm run build
```

该命令更新 `dist/index.html`、`dist/en/index.html`、`dist/blog/how-to-choose-youth-counselor/index.html`、`robots.txt` 和 `sitemap.xml`，不会覆盖 CSS、交互脚本或素材。修改样式和交互脚本后，刷新浏览器即可。

## 页面与交互

页头使用独立 Logo，保留必要导航及语言切换；首屏不再重复显示品牌文字。关于我与咨询方向采用精简内容，桌面端的介绍正文及联系说明保持简洁单行排版。

“了解咨询”通过原生锚点滚动至咨询议题；四处微信入口打开同一张真实二维码。弹窗支持关闭按钮、遮罩、Esc、键盘焦点循环与返回原入口，并可保存原图。无 JavaScript 时，联系区仍显示二维码，链接可直接查看原图。

“查看完整背景”和“进一步了解”使用原生 details 折叠内容。滚动时，IntersectionObserver 与 Web Animations API 实现模块及议题行的柔和显现；首屏图片在 14px 范围内轻微视差，导航显示当前模块。系统开启减少动态效果后，关闭动态效果与视差。页面没有自动播放音频、表单、账户或支付功能，运行时不请求第三方服务。

## 部署与域名

`dist/` 是完整部署目录，可上传到支持 HTTPS 的静态托管服务。需保留目录结构，并支持以目录内 `index.html` 作为默认页面，才能正常访问 `/en/`；无需 Node.js 服务端。

网站 canonical、分享信息和站点地图配置为 https://chunzhipsy.com/ 及其英文路径。代码已上传至 https://github.com/mistriikaridis-sketch/chunzhipsy ，Cloudflare Pages 项目 chunzhipsy 已关联 main 分支。首次生产构建与部署已成功，项目地址为 https://chunzhipsy.pages.dev/ 。

自定义域名 chunzhipsy.com 已发起关联，目前等待 CNAME 配置及注册商名称服务器切换，域名 HTTPS 和公网浏览器验收尚未完成。当前自动 HTTP 检查被 pages.dev 返回的 403 / 1010 阻止，不能将部署成功等同于访问验收成功。

`server.mjs` 仅用于本机预览，监听 127.0.0.1，不提供访客数据存储。目录地址不带结尾斜杠时，也会打开该目录下的 `index.html`；不存在的路径仍返回 404。

## 素材与字体

人物照片、Logo 和微信二维码来自用户提供的资料，与原始文件或 Word 内图片字节一致。首屏静物由内置 ImageGen 生成，没有修改人物照片；`hero.webp` 为 177,186 字节。

标题使用自托管 Noto Serif SC 300 / 400 字重，许可证见 `dist/assets/OFL-NotoSerifSC.txt`。系统字体由访客设备提供。

素材来源和首屏生成提示词见 [ASSETS.md](ASSETS.md)。

## 验证记录

验证结果与边界记录在 `QA.md`。发布前如更换二维码、介绍或排版，请重新检查联系入口、布局和弹窗交互。
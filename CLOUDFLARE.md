# Cloudflare Pages 部署指南

本项目是中英文静态网站，中文路径为 `/`，英文路径为 `/en/`。部署目标域名为 `chunzhipsy.com`，代码仓库为 [mistriikaridis-sketch/chunzhipsy](https://github.com/mistriikaridis-sketch/chunzhipsy)。

## GitHub 持续部署

将项目文件放在仓库根目录，保留 `package.json`、三份 `site.*.mjs` 配置、`src/`、`scripts/` 和完整 `dist/`。不要把源码 ZIP 作为网站代码上传；构建脚本不会重新生成 `dist/assets/`、`dist/styles.css` 或 `dist/app.js`，这些文件需要一同保留。

在 Cloudflare 中进入 **Workers & Pages → Create application → Pages**，连接 GitHub 并选择仓库，然后配置：

| 设置 | 值 |
| --- | --- |
| Repository | `mistriikaridis-sketch/chunzhipsy` |
| Production branch | `main`，或仓库实际使用的发布分支 |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | 留空；项目文件位于仓库根目录 |
| 可选环境变量 | `SKIP_DEPENDENCY_INSTALL=1` |

仓库需要至少一个已提交的分支，才能选择生产分支。本项目使用 Node.js 构建，没有第三方依赖包；不需要在 Pages 中运行本地预览服务器。

构建会生成中文、英文页面及站点地图。部署成功后，先通过 Cloudflare 返回的 `*.pages.dev` 地址检查网站；后续向发布分支推送更新时，Pages 会自动重新构建与部署。

参考：[Git 集成](https://developers.cloudflare.com/pages/get-started/git-integration/)、[构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[跳过依赖安装](https://developers.cloudflare.com/pages/configuration/build-image/#skip-dependency-install)。

## 直接上传静态文件

不使用 Git 集成时，可在本地执行 `npm run build`，然后创建 Pages 的 Direct Upload 项目并上传 `dist/` 内容。若使用 ZIP，压缩包根目录应直接包含 `index.html`、`en/` 和 `assets/`，不要再套一层项目目录。

Git 集成与 Direct Upload 是不同的项目创建方式，创建前应确定后续更新方式。已有 Direct Upload 项目不能直接改为 Git 集成；Git 集成项目也不能直接切换为 Direct Upload 项目，但可以按官方指南停用自动部署后使用 Wrangler 上传。

参考：[Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)、[Git 集成方式说明](https://developers.cloudflare.com/pages/configuration/git-integration/)。

## 绑定 chunzhipsy.com

域名 DNS 接入与 Pages 网站托管是两个步骤。将域名加入 Cloudflare 或选择域名免费方案，不会自动部署网站文件。

1. 在 Cloudflare 添加域名，核对并保留已有 DNS 记录。
2. 在域名注册商处，将名称服务器设置为 Cloudflare 为该域名实际分配的值。
3. 在部署好的 Pages 项目中进入 **Custom domains → Set up a domain**，添加 `chunzhipsy.com`。
4. 按 Cloudflare 提示完成 DNS 与 HTTPS 验证，待自定义域名状态生效后访问网站。

使用根域名时，域名需要作为 Zone 位于 Pages 项目所在的 Cloudflare 账户，并使用 Cloudflare 名称服务器。自定义域名须先在 Pages 项目中关联，不能仅凭手动添加 DNS 记录代替该步骤。

参考：[自定义域名](https://developers.cloudflare.com/pages/configuration/custom-domains/)。

## 上线后检查

- 中文首页与 `/en/` 英文页可正常打开，语言切换往返正确。
- Logo、照片、首屏图片和自托管字体正常加载。
- 微信二维码保持原图，联系入口、弹窗关闭和图片下载可用。
- 手机布局无横向溢出，系统减少动态效果设置生效。
- 自定义域名 HTTPS 正常，页面无资源 404 或 JavaScript 错误。

内容维护与本地运行方法见 [README.md](README.md)，已有验证范围见 [QA.md](QA.md)，素材来源与字体许可说明见 [ASSETS.md](ASSETS.md)。
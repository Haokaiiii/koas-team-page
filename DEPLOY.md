# 🚀 Cloudflare Pages 部署指南

## 快速部署步骤

### 1. 上传代码到GitHub

```bash
# 如果还没有创建GitHub仓库，请创建一个新的repository
# 然后推送代码：

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. 连接Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 **Pages** 标签
3. 点击 **Create a project**
4. 选择 **Connect to Git**
5. 选择你的GitHub账户和仓库
6. 配置构建设置：
   - **Project name**: `koas-agency` (或你喜欢的名称)
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (留空)

### 3. 设置自定义域名 (可选)

如果你想使用子域名访问：

1. 在Cloudflare Pages中，点击你的项目
2. 转到 **Custom domains** 标签
3. 点击 **Add custom domain**
4. 输入你的子域名，例如：`koas.yourdomain.com`
5. Cloudflare会提供DNS记录，按照指示添加到你的DNS设置中

### 4. 部署完成！

一旦设置完成：
- 每次推送到main分支时会自动部署
- 你会得到一个 `*.pages.dev` 的URL
- 如果设置了自定义域名，也可以使用你的域名

## 🔧 故障排除

### 构建失败
- 检查 `package.json` 中的依赖是否正确
- 确保 `wrangler.toml` 配置正确

### 页面不显示
- 检查浏览器控制台是否有错误
- 确认Cloudflare Pages状态为"Success"

### 自定义域名不工作
- 等待DNS传播 (可能需要几分钟到几小时)
- 检查DNS记录是否正确添加

## 📝 后续定制

部署成功后，你可以：

1. **修改团队信息**: 编辑 `src/index.js` 中的HTML内容
2. **更换图片**: 替换placeholder图片为真实团队照片
3. **调整样式**: 修改 `css/main.css` 中的颜色和布局
4. **添加功能**: 使用Cloudflare Workers添加动态功能

## 🌐 访问地址

部署完成后，你可以通过以下地址访问：

- **Cloudflare Pages URL**: `https://[your-project].pages.dev`
- **自定义域名**: `https://koas.yourdomain.com` (如果设置了)

## 📞 获取帮助

如果遇到问题：
1. 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
2. 检查 GitHub Actions 日志
3. 查看浏览器开发者工具控制台

祝部署顺利！ 🎉
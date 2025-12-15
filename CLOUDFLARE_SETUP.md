# 🔑 Cloudflare Pages 设置指南

## 创建API Token

### 1. 访问Cloudflare Dashboard
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击右上角的头像 → **"My Profile"**

### 1.5. 修改构建设置 (重要!)

如果遇到Wrangler部署错误，请修改构建设置：

1. 在Cloudflare Pages项目中，点击 **"Settings"** 标签
2. 找到 **"Builds & deployments"** 部分
3. 修改构建设置：
   - **Build command**: `npm run build` (保持不变)
   - **Deploy command**: (留空 - 删除 `npx wrangler deploy`)
   - **Build output directory**: `./` (根目录)
   - **Root directory**: `/` (留空)

   **重要**: 如果仍然显示"Hello World"，请尝试：
   - 将 **Build output directory** 设置为留空 (而不是 `./`)
   - 或设置为 `/` (单斜杠)

### 2. 创建API Token
1. 在左侧菜单中点击 **"API Tokens"**
2. 点击 **"Create Token"**
3. 选择 **"Edit Cloudflare Workers"** 模板
4. 或者手动创建：
   - Token name: `KOAS Pages Deploy`
   - Permissions:
     - **Account** - Cloudflare Pages - Edit
     - **Account** - Cloudflare Workers - Edit
     - **Account** - Account Settings - Read
     - **Zone** - Page Rules - Edit
     - **Zone** - Zone Settings - Read

### 3. 复制API Token
创建后，**立即复制API Token**（以后无法查看）

## 添加到GitHub Secrets

### 1. 访问GitHub仓库设置
1. 访问你的仓库: https://github.com/Haokaiiii/koas-team-page
2. 点击 **"Settings"** 标签
3. 在左侧菜单中点击 **"Secrets and variables"** → **"Actions"**

### 2. 添加Secret
1. 点击 **"New repository secret"**
2. Name: `CLOUDFLARE_API_TOKEN`
3. Value: 粘贴你刚才复制的API Token
4. 点击 **"Add secret"**

## 连接Cloudflare Pages

### 1. 创建Pages项目
1. 返回 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 **"Pages"** 标签
3. 点击 **"Create a project"**
4. 选择 **"Connect to Git"**
5. 选择 **"GitHub"**
6. 授权Cloudflare访问你的GitHub账户
7. 选择仓库 **"Haokaiiii/koas-team-page"**

### 2. 配置构建设置
- **Project name**: `koas-team-page` (或你喜欢的名称)
- **Production branch**: `main`
- **Framework preset**: `None`
- **Build command**: `npm run build` (如果需要)
- **Build output directory**: `./` (根目录)
- **Root directory**: `/` (留空)

### 3. 部署
1. 点击 **"Save and Deploy"**
2. Cloudflare会自动构建和部署你的网站
3. 获得一个免费域名: `https://koas-team-page.pages.dev`

## 设置自定义域名 (可选)

### 1. 在Cloudflare Pages中添加域名
1. 在Pages项目中点击 **"Custom domains"**
2. 点击 **"Add custom domain"**
3. 输入: `koas.haokaiii.com`
4. Cloudflare会显示需要添加的DNS记录

### 2. 在Cloudflare DNS中添加记录
1. 访问 **"DNS"** 标签
2. 点击 **"Add record"**
3. 类型: **CNAME**
4. 名称: `koas`
5. 目标: `koas-team-page.pages.dev`
6. 代理状态: **Proxied**

### 3. 等待DNS生效
- DNS传播可能需要几分钟到几小时
- 然后你就可以通过 `https://koas.haokaiii.com` 访问网站

## 🎉 完成！

设置完成后：
- 每次推送到GitHub main分支时会自动部署
- 网站完全免费托管在Cloudflare的CDN上
- 支持全球快速访问

如果遇到问题，请检查GitHub Actions的日志！
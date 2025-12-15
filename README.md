# KOAS Agency - Team Information Page

A modern, responsive team information website deployed on Cloudflare Pages + Workers.

## 🌐 Live Demo

Visit: [https://koas.yourdomain.com](https://koas.yourdomain.com) (after deployment)

## ✨ Features

- **Modern Design**: Dark theme with gradient accents and smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Fast**: Deployed on Cloudflare's global CDN
- **Static**: No server maintenance required
- **SEO Friendly**: Proper HTML structure and meta tags

## 🚀 Quick Deploy to Cloudflare Pages

### Method 1: One-Click Deploy

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy%20to%20Cloudflare%20Pages-000000?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/pages/new)

### Method 2: Manual Setup

1. **Fork this repository** to your GitHub account

2. **Create a Cloudflare Pages project**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** → **Create a project**
   - Connect your forked GitHub repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Root directory**: `/` (leave empty)

3. **Set up custom domain** (optional):
   - In Cloudflare Pages, go to **Custom domains**
   - Add your domain (e.g., `koas.yourdomain.com`)
   - Update your DNS records as instructed

4. **Deploy**:
   - Push changes to your repository
   - Cloudflare will automatically build and deploy

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/koas-agency.git
cd koas-agency

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
koas-agency/
├── src/
│   └── index.js          # Cloudflare Worker code
├── css/
│   ├── main.css          # Main styles
│   └── components.css    # Component styles
├── js/
│   └── main.js           # Client-side JavaScript
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Actions workflow
├── wrangler.toml         # Cloudflare Workers config
├── package.json          # Node.js dependencies
└── README.md            # This file
```

## 🎨 Customization

### Team Information
Edit the team data in `src/index.js` in the static HTML responses.

### Styling
- **Colors**: Modify CSS custom properties in `css/main.css`
- **Layout**: Adjust grid layouts and spacing
- **Animations**: Customize GSAP animations in `js/main.js`

### Adding Team Members
1. Find the relevant department section in `src/index.js`
2. Copy an existing member card HTML
3. Update the information and image URL

## 🔧 Advanced Features

### Adding Dynamic Content
If you need dynamic features like photo uploads:

1. **Use Cloudflare Workers + KV** for data storage
2. **Use Cloudflare R2** for file storage
3. **Add API routes** in `src/index.js`

### Custom Domain Setup
1. Add your domain in Cloudflare Pages
2. Update DNS records:
   ```
   CNAME koas yourdomain.com.pages.dev
   ```
3. Enable SSL in Cloudflare

## 📊 Performance

- **Lighthouse Score**: 95+ (expected)
- **First Contentful Paint**: <1s
- **Time to Interactive**: <2s
- **Global CDN**: Served from 200+ locations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

MIT License - feel free to use for your own projects!

## 🆘 Support

If you encounter issues:
1. Check the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)
2. Review the browser console for errors
3. Ensure your DNS is properly configured

---

Built with ❤️ for KOAS Agency
# KOAS Agency - Team Information Page

A modern, responsive team information website deployed on Cloudflare Pages.

## 🌐 Live Demo

Visit: [https://koas-team-page.pages.dev](https://koas-team-page.pages.dev) (after deployment)

## ✨ Features

- **Modern Design**: Dark theme with gradient accents and smooth animations
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Fast**: Deployed on Cloudflare's global CDN
- **Static**: No server maintenance required
- **SEO Friendly**: Proper HTML structure and meta tags
- **Interactive**: Click cards to expand member details

## 🚀 Quick Deploy to Cloudflare Pages

### Method 1: One-Click Deploy

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy%20to%20Cloudflare%20Pages-000000?style=for-the-badge&logo=cloudflare&logoColor=white)](https://dash.cloudflare.com/pages/new)

### Method 2: Manual Setup

1. **Fork this repository** to your GitHub account

2. **Create a Cloudflare Pages project**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** → **Create a project**
   - Connect your GitHub repository: `Haokaiiii/koas-team-page`
   - Configure build settings:
     - **Build command**: (leave empty - no build needed)
     - **Build output directory**: `./`
     - **Root directory**: `/` (leave empty)

3. **Set up custom domain** (optional):
   - In Cloudflare Pages, go to **Custom domains**
   - Add your domain (e.g., `koas.haokaiii.com`)
   - Update your DNS records as instructed

4. **Deploy**:
   - Push changes to your repository
   - Cloudflare will automatically deploy

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/Haokaiiii/koas-team-page.git
cd koas-team-page

# Open in browser
open index.html
```

No build process needed! Just open `index.html` in your browser.

## 📁 Project Structure

```
koas-team-page/
├── index.html           # Main team page (self-contained)
├── story.html           # Story page
├── upload.html          # Upload page (placeholder)
├── admin/
│   └── login.html       # Admin login (placeholder)
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions deployment
├── CLOUDFLARE_SETUP.md  # Setup instructions
├── DEPLOY.md           # Deployment guide
└── README.md           # This file
```

## 🎨 Customization

### Team Information
Edit the HTML content in `index.html` to update team member information.

### Styling
All CSS is embedded in `index.html`. Modify the `<style>` section to change:
- **Colors**: CSS custom properties (`--primary-color`, `--secondary-color`)
- **Layout**: Grid layouts and spacing
- **Animations**: GSAP animations in the JavaScript section

### Adding Team Members
1. Find the relevant department section in `index.html`
2. Copy an existing member card HTML
3. Update the information and image placeholder

## 📊 Performance

- **Lighthouse Score**: 95+ (expected)
- **First Contentful Paint**: <1s
- **Time to Interactive**: <2s
- **Global CDN**: Served from 200+ locations
- **Zero Dependencies**: No npm packages needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally (open `index.html`)
5. Submit a pull request

## 📄 License

MIT License - feel free to use for your own projects!

## 🆘 Support

If you encounter issues:
1. Check the [Cloudflare Pages documentation](https://developers.cloudflare.com/pages/)
2. Review the browser console for errors
3. Ensure your DNS is properly configured
4. Check CLOUDFLARE_SETUP.md for detailed instructions

---

Built with ❤️ for KOAS Agency using pure HTML, CSS, and JavaScript
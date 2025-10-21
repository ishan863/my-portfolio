# 🚀 Goura Hari Patel - Developer Portfolio

A complete, professional, and responsive developer portfolio website showcasing AI, Python, Flutter, and web development projects.

![Portfolio Preview](./assets/images/portfolio-preview.jpg)

## ✨ Features

### 🎨 Design & UI
- **Modern & Clean Design** - Professional layout with smooth animations
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Dark/Light Theme** - Auto-detects system preference with manual toggle
- **Animated Particle Background** - Interactive canvas-based particle system
- **Smooth Animations** - AOS (Animate On Scroll) library integration
- **Typography** - Beautiful Poppins font with optimal readability

### 🔧 Functionality
- **Interactive Navigation** - Smooth scrolling with active section highlighting
- **Typing Animation** - Dynamic role rotation in hero section
- **Project Filtering** - Filter projects by category (Flutter, AI, Desktop, etc.)
- **Skill Progress Bars** - Animated skill level indicators
- **Contact Form** - Functional form with validation and Formspree integration
- **GitHub Integration** - Dynamic GitHub stats and contribution display
- **PWA Support** - Installable as a mobile/desktop app

### 🚀 Performance & SEO
- **Fast Loading** - Optimized assets and lazy loading
- **SEO Optimized** - Complete meta tags and structured data
- **Offline Support** - Service worker for offline functionality
- **Accessibility** - ARIA labels and keyboard navigation
- **Cross-browser Compatible** - Works on all modern browsers

## 📁 Project Structure

```
my_portfolio/
├── index.html              # Main portfolio page
├── dev-server.html         # Development launcher
├── manifest.json           # PWA configuration
├── sw.js                   # Service worker
├── css/
│   └── style.css          # Complete styling
├── js/
│   ├── main.js            # Main functionality
│   └── particles.js       # Particle system
└── assets/
    ├── resume.html        # Professional resume
    └── images/            # Image directory
        └── README.md      # Image requirements
```

## 🛠️ Setup & Installation

### 1. Clone or Download
```bash
git clone <repository-url>
cd my_portfolio
```

### 2. Add Images
Add the following images to `assets/images/` directory:
- `avatar.jpg` (120x120px) - Profile photo
- `about-photo.jpg` (400x400px) - About section photo
- Project screenshots (600x300px each)
- PWA icons (various sizes)

See `assets/images/README.md` for complete requirements.

### 3. Customize Content
Edit `index.html` to update:
- Personal information and bio
- Project details and links
- Social media links
- Contact information

### 4. Configure Contact Form
1. Sign up at [Formspree](https://formspree.io)
2. Update the form action URL in `index.html`
3. Replace `your-form-id` with your actual Formspree form ID

### 5. Update GitHub Stats
Replace `gouraharipatel` with your GitHub username in the GitHub section.

## 🌐 Development Server

### Option 1: Use the Development Launcher
Open `dev-server.html` in your browser for easy access to all features.

### Option 2: Local Server
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## 🎨 Customization

### Colors & Theme
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #1e40af;
    --secondary-color: #f59e0b;
    --accent-color: #3b82f6;
    /* ... other variables */
}
```

### Content Sections
- **Hero Section**: Update name, roles, and description
- **About Section**: Modify bio and highlights
- **Projects Section**: Add/edit project cards
- **Skills Section**: Update skill levels and categories
- **Contact Section**: Update contact information

### Adding Projects
```html
<div class="project-card" data-category="your-category">
    <div class="project-image">
        <img src="./assets/images/your-project.jpg" alt="Project Name">
        <!-- ... overlay and actions ... -->
    </div>
    <div class="project-content">
        <h3 class="project-title">Your Project Name</h3>
        <p class="project-description">Project description...</p>
        <!-- ... features and tech stack ... -->
    </div>
</div>
```

## 🚀 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Go to Settings > Pages
3. Select source branch
4. Your site will be available at `username.github.io/repository-name`

### Netlify
1. Connect GitHub repository
2. Build settings: Leave empty (static site)
3. Deploy automatically on push

### Vercel
1. Import GitHub repository
2. Deploy with default settings
3. Get instant global CDN

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📱 PWA Features

The portfolio is a Progressive Web App with:
- **App Installation** - Install on mobile/desktop
- **Offline Support** - Works without internet
- **Background Sync** - Updates when online
- **Push Notifications** - Can be enabled
- **App Shortcuts** - Quick access to sections

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript ES6+** - Modern JavaScript features
- **AOS Library** - Scroll animations
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance Optimizations
- Lazy loading images
- Minified assets
- Service worker caching
- Debounced scroll handlers
- Optimized animations

## 🎯 SEO Features

### Meta Tags
- Complete Open Graph tags
- Twitter Card support
- Mobile-friendly viewport
- Canonical URLs

### Structured Data
- JSON-LD for person/developer schema
- Rich snippets support
- Proper heading hierarchy

### Performance
- Fast loading times
- Optimized images
- Efficient CSS/JS
- CDN-ready assets

## 🔍 Analytics Integration

### Google Analytics 4
Add to `<head>` section:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Event Tracking
The portfolio includes built-in event tracking for:
- Button clicks
- Project views
- Social link clicks
- Form submissions

## 🛡️ Security

### Best Practices
- No inline scripts
- Content Security Policy ready
- XSS protection
- HTTPS recommended

### Privacy
- No tracking without consent
- GDPR compliance ready
- Cookie-free by default

## 📞 Support & Customization

Need help customizing or have questions?
- 📧 Email: gouraharipatel@gmail.com
- 💼 LinkedIn: [linkedin.com/in/gouraharipatel](https://linkedin.com/in/gouraharipatel)
- 🐙 GitHub: [github.com/gouraharipatel](https://github.com/gouraharipatel)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **AOS Library** - Animate On Scroll
- **Font Awesome** - Icon library
- **Google Fonts** - Typography
- **Unsplash** - Stock photos (if used)

---

**Made with ❤️ by Goura Hari Patel**

*Last updated: October 2025*
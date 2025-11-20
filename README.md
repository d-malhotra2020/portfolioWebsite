# Drew Malhotra's Portfolio - React Version

A modern, responsive portfolio website built with React, showcasing my software engineering journey and projects.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, Vite, and Framer Motion
- **Multi-Theme Support**: 5 code editor themes (Dracula, Monokai, GitHub, VS Code, Sublime)
- **Interactive Animations**: Smooth scrolling, typing effects, and particle systems
- **Responsive Design**: Optimized for all devices and screen sizes
- **Performance Optimized**: Lazy loading, intersection observers, and efficient rendering
- **GitHub Integration**: Live GitHub stats and contribution charts
- **Contact Form**: Integrated with Formspree for contact functionality

## 🛠️ Tech Stack

- **Frontend**: React 18, JavaScript ES6+
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: CSS3 with CSS Variables for theming
- **Deployment**: GitHub Pages
- **Forms**: Formspree integration

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/d-malhotra2020/portfolioWebsite.git
cd portfolioWebsite
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000/portfolioWebsite/](http://localhost:3000/portfolioWebsite/) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## 🎨 Customization

### Themes
The website includes 5 built-in themes. You can switch between them using the theme selector in the navigation or by modifying the CSS variables in `src/styles/App.css`.

### Content
Update your personal information in the React components:
- **Hero Section**: `src/components/Hero.jsx`
- **About**: `src/components/About.jsx`
- **Experience**: `src/components/Experience.jsx`
- **Projects**: `src/components/Projects.jsx`
- **Skills**: `src/components/Skills.jsx`
- **Contact**: `src/components/Contact.jsx`

### Assets
- Profile image: `public/ImageFiles/profilePhoto.jpeg`
- Background videos: `public/VideoFiles/`
- Resume: `public/Documents/Dhruv_malhotra_resume.pdf`

## 🚀 Deployment

The site is automatically deployed to GitHub Pages using GitHub Actions when you push to the main branch.

Manual deployment:
```bash
npm run build
npm run deploy
```

## 🔧 Project Structure

```
src/
├── components/           # React components
│   ├── Hero.jsx         # Hero section
│   ├── About.jsx        # About section
│   ├── Experience.jsx   # Work experience timeline
│   ├── Projects.jsx     # Featured projects
│   ├── Skills.jsx       # Skills and technologies
│   ├── Contact.jsx      # Contact form and info
│   ├── Navbar.jsx       # Navigation component
│   ├── LoadingScreen.jsx # Loading animation
│   ├── VideoBackground.jsx # Video background
│   ├── ParticleSystem.jsx # Particle animations
│   └── FloatingCode.jsx # Floating code snippets
├── hooks/               # Custom React hooks
│   ├── useTheme.js      # Theme management
│   └── useVisitorTracking.js # Visitor statistics
├── styles/              # CSS files
│   └── App.css         # Main stylesheet
├── App.jsx             # Main app component
└── main.jsx            # App entry point
```

## 🎯 Features in Detail

### Theme System
- **5 Themes**: Dracula, Monokai, GitHub (light), VS Code, Sublime
- **Persistent Storage**: Theme preference saved in localStorage
- **Dynamic Colors**: CSS variables update based on selected theme
- **Smooth Transitions**: Animated theme switching

### Performance Optimizations
- **Intersection Observer**: Lazy loading for animations
- **Framer Motion**: Hardware-accelerated animations
- **Code Splitting**: Efficient bundle loading
- **Image Optimization**: Proper image loading and fallbacks

### Interactive Elements
- **Typing Animation**: Dynamic text effects in hero section
- **Particle System**: Canvas-based particle animations
- **Floating Code**: Animated code snippets background
- **Parallax Effects**: Smooth scrolling video background

## 🐛 Troubleshooting

### Common Issues

1. **Development server won't start**
   - Ensure Node.js version 16+ is installed
   - Delete `node_modules` and `package-lock.json`, then run `npm install`

2. **Build fails**
   - Check for TypeScript/JavaScript errors in the console
   - Ensure all imports are correct and files exist

3. **GitHub Pages deployment issues**
   - Verify the `base` path in `vite.config.js` matches your repository name
   - Check GitHub Pages settings in repository settings

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

While this is a personal portfolio, I welcome feedback and suggestions! Feel free to open an issue or submit a pull request.

## 📞 Contact

- **Email**: dhruvmalhotra2025@gmail.com
- **LinkedIn**: [linkedin.com/in/drewmalhotra](https://www.linkedin.com/in/drewmalhotra/)
- **GitHub**: [github.com/d-malhotra2020](https://github.com/d-malhotra2020)

---

Built with ❤️ using React and modern web technologies.
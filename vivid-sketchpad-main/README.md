# 🎨 Mini Paint - Professional Digital Drawing Application

A feature-rich, responsive drawing application built with React, TypeScript, and Fabric.js. Create, edit, and export digital artwork with professional-grade tools and an intuitive interface.

![Mini Paint Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Fabric.js](https://img.shields.io/badge/Fabric.js-6.7.1-orange)

## ✨ Features

### 🎯 Core Drawing Tools
- **Pencil & Eraser** - Smooth drawing with adjustable brush sizes
- **Spray Brush** - Artistic spray painting effect
- **Fill Tool** - Click to fill shapes with colors
- **Text Tool** - Add and edit text with custom fonts
- **Line Tool** - Draw straight lines with precision

### 🔷 Shape Library (19+ Shapes)
- Basic: Rectangle, Circle, Oval, Triangle
- Advanced: Diamond, Pentagon, Hexagon, Octagon
- Special: Star, Heart, Arrow, Smiley, Eye

### 🎨 Professional Features
- **Layer System** - Multiple drawing layers with visibility controls
- **Undo/Redo** - Complete history management with keyboard shortcuts
- **Zoom & Pan** - Canvas navigation with zoom controls (30%-300%)
- **Color Picker** - Preset colors + custom RGB color selection
- **Dark/Light Mode** - Theme toggle with localStorage persistence

### 📱 Cross-Platform Support
- **Responsive Design** - Optimized for desktop and mobile
- **Touch Support** - Native drawing on mobile devices
- **Retina Display** - Sharp rendering on high-DPI screens

### 💾 Project Management
- **Save/Load Projects** - Complete project persistence
- **Auto-Save** - Automatic saving every 30 seconds
- **Export Options** - PNG and SVG format support
- **Recent Files** - Quick access to previous projects

### 🤖 AI Integration
- **Drawing Evaluation** - AI-powered artwork rating system
- **Animated Feedback** - Interactive GIF responses based on ratings
- **Improvement Tips** - Personalized suggestions for skill development

## 🚀 Live Demo
https://vivid-sketchpad.vercel.app/

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1, TypeScript 5.8.3
- **Canvas Library**: Fabric.js 6.7.1
- **Styling**: Tailwind CSS, Shadcn/ui
- **Build Tool**: Vite 5.4.19
- **State Management**: React Hooks, useReducer
- **Storage**: localStorage for persistence

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mini-paint.git

# Navigate to project directory
cd mini-paint

# Install dependencies
npm install

# Start development server
npm run dev
```



### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🎮 Usage Guide

### Basic Drawing
1. Select **Pencil tool** from toolbar
2. Choose your **color** from color picker
3. Adjust **brush size** with slider
4. Start drawing on canvas

### Working with Shapes
1. Select any **shape tool** (rectangle, circle, etc.)
2. Click on canvas to add shape
3. Use **Fill tool** to add colors to shapes
4. **Select tool** to move and resize objects

### Layer Management
1. Use **Layer Panel** (right sidebar) to manage layers
2. **Add new layers** with + button
3. **Toggle visibility** with eye icon
4. **Adjust opacity** with slider
5. **Rename layers** by double-clicking

### Keyboard Shortcuts
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo  
- `Ctrl+S` - Save project
- `Delete` - Remove selected object

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Canvas.tsx      # Main canvas component
│   ├── Toolbar.tsx     # Tool selection interface
│   ├── LayerPanel.tsx  # Layer management
│   ├── ColorPicker.tsx # Color selection
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
│   ├── useLayerManager.ts
│   └── useProjectManager.ts
├── types/              # TypeScript interfaces
│   ├── layerTypes.ts
│   └── projectTypes.ts
└── pages/              # Application pages
    ├── Index.tsx       # Landing page
    └── Whiteboard.tsx  # Main drawing interface
```

## 🔧 Key Technical Implementations

### Canvas Management
- **Fabric.js Integration** - Advanced canvas manipulation
- **Event Handling** - Mouse and touch event optimization
- **Performance** - Efficient rendering with requestAnimationFrame

### State Management
- **useReducer** - Complex layer state management
- **Custom Hooks** - Reusable logic abstraction
- **Refs** - Direct DOM manipulation for performance

### Responsive Design
- **Mobile-First** - Touch-optimized interface
- **Breakpoint System** - Tailwind CSS responsive utilities
- **Cross-Browser** - Tested on major browsers

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Fabric.js](http://fabricjs.com/) - Powerful canvas library
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide Icons](https://lucide.dev/) - Clean, customizable icons
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

⭐ **Star this repository if you found it helpful!**

*Built with ❤️ for the developer community*

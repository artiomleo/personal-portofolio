# Modern Personal Portfolio

A sleek and modern personal portfolio website built with React, TypeScript, and Vite. Features a responsive design, smooth animations, and a comprehensive UI component system.

## 🚀 Features

- ⚡️ **Lightning Fast** - Built on Vite for rapid development and optimal performance
- 🎨 **Modern UI** - Elegant design with shadcn/ui components
- 🌗 **Dark/Light Mode** - Seamless theme switching
- ✨ **Animations** - Smooth reveal animations and particle effects
- 📱 **Responsive** - Fully responsive design across all devices
- ♿️ **Accessible** - ARIA-compliant with keyboard navigation support
- 📊 **Scroll Progress** - Visual scroll progress indicator

## 🛠️ Tech Stack

- [React](https://reactjs.org/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [Vite](https://vitejs.dev/) - Build Tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [React Router](https://reactrouter.com/) - Routing
- [React Query](https://tanstack.com/query/latest) - Data Fetching
- [Lucide Icons](https://lucide.dev/) - Icons
- [Recharts](https://recharts.org/) - Charts

## 🚦 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v18 or higher)
- pnpm (preferred) or npm

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd personal-portfolio
```

2. Install dependencies
```bash
pnpm install
```

3. Start the development server
```bash
pnpm dev
```

4. Build for production
```bash
pnpm build
```

## 🗂️ Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── ui/        # shadcn/ui components
│   └── ...        # Custom components
├── hooks/         # Custom React hooks
├── lib/          # Utility functions
├── pages/        # Route pages
└── ...
```

## 📄 Pages

- **Home** - Landing page with hero section and featured projects
- **About** - Personal information and skills
- **Projects** - Portfolio of work
- **Experience** - Professional experience timeline
- **Contact** - Contact form and information
- **404** - Custom not found page

## 🎨 Customization

### Themes

The project uses Tailwind CSS for styling with a custom theme configuration. You can modify the theme in:
- `tailwind.config.ts` - Tailwind configuration
- `components/ThemeProvider.tsx` - Theme context and switching logic

### Components

All UI components are built on top of shadcn/ui, which provides a solid foundation of accessible, customizable components. You can find and modify these in the `components/ui` directory.

## 📱 Responsive Design

The portfolio is fully responsive with carefully crafted layouts for:
- Mobile devices (< 640px)
- Tablets (640px - 1024px)
- Desktop (> 1024px)

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Lint code

### Code Quality

The project uses:
- ESLint for code linting
- TypeScript for type checking

## 📫 Contact

Artiom Leontiev - [@artiomleo](https://www.linkedin.com/in/artiomleo/)

Project Link: [https://github.com/artiomleo/personal-portofolio](https://github.com/artiomleo/personal-portofolio)
# SmartStay Frontend - AI Agent Instructions

## Project Overview
SmartStay is a React + Vite frontend application with Tailwind CSS styling. This is a greenfield project with established tooling but minimal application code.

**Tech Stack:**
- React 19 (latest)
- Vite 7 (build tool)
- Tailwind CSS 4 with Vite plugin
- ESLint with React-specific rules
- ES modules throughout

## Directory Structure & Patterns

### `/src/` Organization
- **components/** - Reusable UI components (currently empty, establish here)
- **pages/** - Page-level components for routing (currently empty, reserved for future routing)
- **context/** - React Context providers for state management (currently empty)
- **services/** - API calls and external integrations (currently empty)
- **utils/** - Utility functions and helpers (currently empty)
- **assets/** - Static images/SVGs
- **App.jsx** - Root component
- **main.jsx** - React DOM bootstrap with StrictMode
- **index.css** - Global styles (currently imports Tailwind)
- **App.css** - App-level styles

## Build & Development Commands

Run all commands from `/smartstay-frontend/` directory:

```bash
npm run dev      # Start Vite dev server with HMR
npm run build    # Optimize production build to /dist
npm run preview  # Preview built output locally
npm run lint     # Run ESLint (uses flat config)
```

## Critical Conventions

### React Component Patterns
- **Functional components only** - Use hooks (useState, useEffect, useContext)
- **Fast Refresh optimized** - Avoid default exports for complex components; named exports + default export on single-component files
- **CSS organization** - Component-specific CSS in `Component.css`, global styles in `index.css`
- **No TypeScript yet** - File structure ready for migration (see README recommendation), but currently JSX only

### Styling Approach
- **Tailwind-first** - Use Tailwind classes for all new styling; only add custom CSS for animations or edge cases
- **Global Tailwind import** - `index.css` imports `@import "tailwindcss"` (Vite plugin integration)
- **Custom CSS sparingly** - `App.css` contains example animations; follow this pattern for component-specific keyframes

### Code Quality
- **ESLint flat config** - New config format in `eslint.config.js`; run `npm run lint` before commits
- **Unused vars rule** - Allow PascalCase (components, constants) with pattern `^[A-Z_]`
- **React Hook Rules** - ESLint enforces via `eslint-plugin-react-hooks`; dependency arrays are required

## Architecture Decisions

### Why Tailwind Vite Plugin?
The project uses `@tailwindcss/vite` (not PostCSS). This provides faster HMR and simpler config. No `tailwind.config.js` or `postcss.config.js` needed.

### Why Flat ESLint Config?
ESLint v9+ uses flat config (`eslint.config.js`). Old `.eslintrc` format is deprecated. All new rules must go in the flat config array.

### State Management
- **Currently:** React hooks (useState, useContext) only
- **Structure ready:** Empty `context/` folder for future Context API providers
- **When expanding:** Create context hooks in `context/`, export hooks for convenient usage patterns

## Development Workflow

1. **Starting:** `npm run dev` launches http://localhost:5173 with HMR
2. **Adding components:** Create `.jsx` files in `components/`, import in parent
3. **Styling:** Use Tailwind classes; add custom CSS only in corresponding `.css` file if needed
4. **Linting:** Run `npm run lint` frequently; fix issues before pushing
5. **Building:** `npm run build` outputs to `dist/` for deployment

## Known Limitations & Next Steps

- **No TypeScript:** Project can migrate to TypeScript following [Vite TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts)
- **No routing:** React Router ready to integrate when multi-page structure needed
- **No API integration:** `services/` folder ready for API client setup (suggest axios or fetch wrapper)
- **No tests:** Consider adding Vitest + React Testing Library when test coverage needed

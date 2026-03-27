# Low-Code Visual Builder with Automatic Deployment

A visual low-code builder that lets you create apps and deploy them automatically to Vercel with one click.

## Quick Start

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up Vercel token** (for automatic deployment)

   - Go to https://vercel.com/account/tokens
   - Create a new token (name it "Low-Code Builder" or similar)
   - Copy the token
   - Create a `.env` file in the root directory:
     ```bash
     VERCEL_TOKEN=your_token_here
     ```

3. **Start the builder and backend**

   ```bash
   # Terminal 1: Start the builder UI
   ./dev.sh
   # or
   npm run dev

   # Terminal 2: Start the backend API
   npm run server
   ```

4. **Build your app**
   - Open http://localhost:5173
   - Drag and drop components to build your app
   - Click "🚀 Deploy to Vercel" to deploy instantly

## Features

- **Visual Builder**: Drag-and-drop interface with responsive canvas
- **One-Click Deployment**: Deploy directly to Vercel without manual CLI commands
- **Component Library**: Text, Button, Input, Card, Grid, Auth Screen
- **Export Options**: Download as JSON or generate full React+Vite project
- **Multiple Screen Sizes**: Mobile, Tablet, Web preview modes
- **Canvas Modes**: Flow (vertical layout) or Absolute (free positioning)

## Original Vite + React + TypeScript Template

This project was bootstrapped with Vite. Two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

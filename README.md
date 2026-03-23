# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Google Login Setup (Firebase)

1. Create a Firebase project.
2. In Firebase Console, go to Authentication > Sign-in method and enable Google.
3. In Firebase project settings, create a Web App and copy the config values.
4. Create a local `.env` file from `.env.example` and fill these values:

```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

5. Restart the dev server after adding `.env`.

The Google button in the login page now uses Firebase Authentication with `signInWithPopup`.

### Common Google Login Errors

- `auth/operation-not-allowed`: Enable Google in Firebase Authentication.
- `auth/unauthorized-domain`: Add `localhost` to Firebase Authorized domains.
- `auth/invalid-api-key`: Verify the values in `.env`.
- `auth/popup-blocked`: Allow popups in the browser.
- `auth/popup-closed-by-user`: The popup was closed before sign-in completed.

## Mercado Pago (real card payments)

This project now includes:
- Frontend Mercado Pago Card Payment Brick (`@mercadopago/sdk-react`)
- Backend endpoint at `/api/mercadopago/payments` to create payments with tokenized card data

### 1) Environment variables

Use `.env.example` as base and define:

```bash
VITE_MP_PUBLIC_KEY=YOUR_PUBLIC_KEY
MP_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
```

Notes:
- `VITE_MP_PUBLIC_KEY` is used in frontend to initialize the SDK.
- `MP_ACCESS_TOKEN` is used only by backend (`server/index.js`).

### 2) Run frontend and backend in development

In one terminal:

```bash
npm run dev:api
```

In another terminal:

```bash
npm run dev
```

Vite proxies `/api/*` to `http://localhost:8787` during dev.

### 3) Checkout real flow

On checkout payment step:
- Select card type (`credito` or `debito`) inside Mercado Pago section.
- Enter buyer email.
- Complete card form in Card Payment Brick and submit using Brick button.
- Frontend sends tokenized data to backend endpoint.
- Confirmation screen shows real Mercado Pago payment status, id and method.

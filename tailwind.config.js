import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // You can keep custom color extensions here if needed
      },
      // You need to define your custom animation for `animate-pulse-slow`
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        evalime: { // Your theme name must match data-theme in index.html
          "primary": "#22c55e",
          "secondary": "#166534",
          "accent": "#bbf7d0",
          "neutral": "#3d4451",
          // The page background must be set in base-100 for DaisyUI
          "base-100": "#020617", // This corresponds to slate-950
          "info": "#2dd4bf",
          "success": "#16a34a",
          "warning": "#eab308",
          "error": "#dc2626",
        },
      },
      'dark',
    ],
  },
};
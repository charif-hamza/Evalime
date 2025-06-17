const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#22c55e',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        evalime: {
          primary: '#22c55e',
          secondary: '#166534',
          accent: '#bbf7d0',
          neutral: '#3d4451',
          'base-100': '#ffffff',
          info: '#2dd4bf',
          success: '#16a34a',
          warning: '#eab308',
          error: '#dc2626',
        },
      },
      'dark',
    ],
  },
}; 
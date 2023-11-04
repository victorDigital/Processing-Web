/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        space: ['"Space Mono"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        ...defaultTheme.colors,
        primary: 'rgb(var(--color-primary))',
        secondary: 'rgb(var(--color-secondary))',
        content: 'rgb(var(--color-content))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui"),
    // ...
  ],
  daisyui: {
    themes: ["light"],
  },
}
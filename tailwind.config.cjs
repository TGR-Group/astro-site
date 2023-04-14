/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
      extend: {},
    },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      'winter',
      {
        custom: {
          'primary': '#3c83f5',
          'primary-focus': '#0b60e9',
          'primary-content': '#d6e5fe',
          'secondary': '#91c3fc',
          'secondary-focus': '#459afc',
          'secondary-content': '#002651',
          'accent': '#fda5af',
          'accent-focus': '#fa5064',
          'accent-content': '#510009',
          'neutral': '#191d24',
          'neutral-focus': '#14171e',
          'neutral-content': '#c4cddd',
          'base-100': '#e5e7eb',
          'base-200': '#cbcfd7',
          'base-300': '#b1b7c3',
          'base-content': '#272b34',
          'info': '#3abef7',
          'info-content': '#002a3d',
          'success': '#36d299',
          'success-content': '#003320',
          'warning': '#fabd23',
          'warning-content': '#382800',
          'error': '#f87171',
          'error-content': '#470000',
        },
      },
    ],
  },
}

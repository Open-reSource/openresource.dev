/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
		screens: {
			'xs': '480px',
			...defaultTheme.screens
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('daisyui'),
	],
	daisyui: {
		themes: [
      'acid',
      'aqua',
      'autumn',
      'black',
      'bumblebee',
      'business',
      'cmyk',
      'coffee',
      'corporate',
      'cupcake',
      'cyberpunk',
      'dark',
      'dim',
      'dracula',
      'emerald',
      'fantasy',
      'forest',
      'garden',
      'halloween',
      'lemonade',
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          'primary-content': '#fff',
          'secondary': '#e82a82',
          'secondary-content': '#fff',
        },
      },
      'lofi',
      'luxury',
      'night',
      'nord',
      'pastel',
      'retro',
      'sunset',
      'synthwave',
      'valentine',
      'winter',
      'wireframe',
    ],
	}
}

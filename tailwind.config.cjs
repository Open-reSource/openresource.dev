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
		require("daisyui"),
	],
	daisyui: {
		themes: [
      {
				light: {
          ...require("daisyui/src/theming/themes")["[data-theme=light]"],
          "primary-content": "white",
					"secondary-content": "white",
					"neutral-content": "white",
        }
			},
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
    ],
	}
}

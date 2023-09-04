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
		themes: true,
	}
}

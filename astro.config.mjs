import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Open {re}Source',
			logo: {
				light: './src/assets/logo.svg',
				dark: './src/assets/logo-dark.svg',
				replacesTitle: true,
			},
			social: {
				github: 'https://github.com/Open-reSource/openresource.dev',
			},
			customCss: [
				'./src/styles/custom.css'
			],
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'English',
					lang: 'en'
				},
				fr: {
					label: 'Français',
					lang: 'fr'
				},
			},
			sidebar: [
				{
					label: 'Guide',
					items: [
						{
							label: 'Introduction',
							link: '/guide/',
						},
						{
							label: 'What Is Open Source?',
							translations: {
								fr: 'Qu\'est-ce que l\'open source ?',
							},
							items: [
								{
									label: 'Introduction',
									link: '/guide/what-is-open-source',
								},
								{
									label: 'Definition of Open Source',
									link: '/guide/what-is-open-source/definition-of-open-source',
								},
								{
									label: 'Brief History of Open Source',
									link: '/guide/what-is-open-source/brief-history-of-open-source',
								},
								{
									label: 'The Significance of Open Source',
									link: '/guide/what-is-open-source/the-significance-of-open-source',
								},
								{
									label: 'Examples of Successful Open-Source Projects',
									link: '/guide/what-is-open-source/examples-of-successful-open-source-projects',
								},
								{
									label: 'Types of Open-Source Projects',
									link: '/guide/what-is-open-source/types-of-open-source-projects',
								},
								{
									label: 'Types of Open-Source Software Projects',
									link: '/guide/what-is-open-source/types-of-open-source-software-projects',
								},
								{
									label: 'Benefits of Open Source',
									link: '/guide/what-is-open-source/benefits-of-open-source',
								}
							]
						}
					]
				},
				{
					label: 'Resources',
					autogenerate: { directory: 'resources' },
				},
			],
		}),
	],
});

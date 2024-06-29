import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Open {re}Source',
			social: {
				github: 'https://github.com/Open-reSource/openresource.dev',
			},
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
							items: [
								{
									label: 'Introduction',
									link: '/guide/what-is-open-source',
								},
								{
									label: 'Definition of Open Source',
									link: '/guide/what-is-open-source/definition-of-open-source',
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

import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

export const prerender = true;

const entries = await getCollection('docs');

const pages = Object.fromEntries(entries.map(({ data, id }) => [id, { data }]));

export const { getStaticPaths, GET } = OGImageRoute({
	pages,
	param: 'slug',
	getImageOptions: (_path, page: (typeof pages)[number]) => {
		return {
			title: page.data.title,
			description: page.data.description,
			logo: {
				path: './src/og-logo.png',
				size: [200],
			},
			bgImage: {
				path: './src/og-background.png',
			},
			font: {
				title: {
					color: [255, 255, 255],
					weight: 'Bold',
					families: ['Inter Variable'],
				},
				description: {
					color: [255, 255, 255],
					families: ['Inter Variable'],
				},
			},
			fonts: [
				'https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-wght-normal.woff2'
			]
		};
	},
});

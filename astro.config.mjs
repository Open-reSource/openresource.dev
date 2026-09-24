import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import deramond from '@deramond.dev/astro/integration';

const guide = (label, dir, pages) => ({
	label,
	items: [`guide/${dir}`, ...pages.map((page) => `guide/${dir}/${page}`)],
});

// https://astro.build/config
export default defineConfig({
	output: 'server',
	legacy: {
		collectionsBackwardsCompat: true,
	},
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
	site: 'https://openresource.dev',
	trailingSlash: 'ignore',
	vite: {
		define: {
			'import.meta.env.PUBLIC_VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
		},
	},
	redirects: {
		'/books': '/resources/books',
		'/events': '/resources/events',
		'/open-sourcerers': '/resources/open-sourcerers',
		'/podcasts': '/resources/podcasts',
		'/resources': '/resources/books',
		'/rss.xml': '/articles/rss.xml',
		'/articles/authors/julien-déramond': '/articles',
	},
	integrations: [
		mdx(),
		sitemap(),
		deramond({
			site: {
				name: 'Open {re}Source',
				description: 'Open source, {re}explained. How it works, how to contribute, how to run your own project.',
			},
			brand: {
				mark: './src/brand/mark.svg',
				favicons: './src/brand/favicons/',
				accounts: [
					{ label: 'GitHub', href: 'https://github.com/Open-reSource/openresource.dev' },
					{ label: 'Discord', href: 'https://discord.gg/fpUDwEMGwE' },
					{ label: 'Bluesky', href: 'https://bsky.app/profile/openresource.dev' },
					{ label: 'Mastodon', href: 'https://fosstodon.org/@openresource' },
					{ label: 'LinkedIn', href: 'https://www.linkedin.com/company/open-re-source/' },
					{ label: 'X', href: 'https://x.com/open_resource' },
					{ label: 'Threads', href: 'https://www.threads.net/@openresource' },
				],
				twitter: '@JulienDeramond',
			},
			nav: [
				{ label: 'Guide', href: '/guide/' },
				{ label: 'Resources', href: '/resources/books/' },
				{ label: 'Articles', href: '/articles/' },
				{ label: 'Showcase', href: '/showcase/' },
			],
			footer: {
				columns: [
					{
						title: 'Learn',
						links: [
							{ label: 'Guide', href: '/guide/' },
							{ label: 'Resources', href: '/resources/books/' },
							{ label: 'Articles', href: '/articles/' },
							{ label: 'RSS', href: '/articles/rss.xml' },
						],
					},
					{
						title: 'Community',
						links: [
							{ label: 'Showcase', href: '/showcase/' },
							{ label: 'Become a sponsor', href: 'https://github.com/sponsors/Open-reSource' },
							{ label: 'About the author', href: '/about-author/' },
							{ label: 'Cookie policy', href: '/cookie-policy/' },
						],
					},
				],
				copyright: '2023-present © Open {re}Source',
				meta: 'Content under CC BY-NC-SA 4.0',
			},
			docs: {
				route: '',
				tabs: [
					{ label: 'Guide', href: '/guide/' },
					{ label: 'Resources', href: '/resources/books/' },
					{ label: 'Articles', href: '/articles/' },
					{ label: 'Showcase', href: '/showcase/' },
				],
				status: false,
				edit: { repo: 'Open-reSource/openresource.dev' },
				sidebar: [
					{ label: 'Guide', items: ['guide'] },
					guide('What Is Open Source?', 'what-is-open-source', [
						'definition-of-open-source',
						'brief-history-of-open-source',
						'the-significance-of-open-source',
						'examples-of-successful-open-source-projects',
						'types-of-open-source-projects',
						'types-of-open-source-software-projects',
						'benefits-of-open-source',
					]),
					guide('Getting Started', 'getting-started-with-open-source', [
						'source-code-hosting-platforms',
						'finding-open-source-projects',
					]),
					guide('Contributing', 'contributing-to-open-source-projects', [
						'finding-open-source-projects',
						'contributing-to-open-source',
						'getting-involved-in-the-open-source-community',
						'building-a-portfolio-with-open-source-contributions',
						'overcoming-challenges-in-open-source-contributions',
					]),
					guide('Creating', 'creating-your-own-open-source-project', [
						'choosing-a-project-idea',
						'planning-your-project',
						'creating-your-project',
						'legal-considerations',
						'developing-your-project',
						'building-and-engaging-your-community',
					]),
					guide('Maintaining', 'maintaining-open-source-projects', [
						'introduction-to-open-source-project-maintenance',
						'managing-contributions-and-community-engagement',
						'managing-project-dependencies',
						'fostering-a-strong-and-inclusive-community',
						'ensuring-project-sustainability',
					]),
					guide('Promoting', 'promoting-open-source-projects', [
						'introduction-to-project-promotion',
						'building-a-strong-project-identity',
						'crafting-an-engaging-project-website',
					]),
					guide('Financing', 'financing-open-source-projects', [
						'importance-and-challenges-of-financing-open-source-projects',
						'understanding-funding-models',
						'effective-fundraising-strategies',
						'resource-allocation-and-budgeting',
						'fostering-a-sustainable-ecosystem',
						'transparency-accountability-and-community-involvement',
					]),
					{
						label: 'Resources',
						items: [
							'resources/books',
							'resources/events',
							'resources/open-sourcerers',
							'resources/podcasts',
							'resources/tools',
						],
					},
				],
			},
			blog: {
				collection: 'articles',
				route: 'articles',
				title: 'Articles',
				description: 'Articles about open source: tools, contribution, maintenance, community and funding.',
				license: 'CC BY-NC-SA 4.0',
				authors: {
					julien: {
						name: 'Julien Déramond',
						title: 'Open {re}Source • Bootstrap • Thales',
						picture: 'https://avatars.githubusercontent.com/u/17381666?s=100',
						url: 'https://github.com/julien-deramond/',
					},
				},
			},
			og: {
				art: './src/brand/og-art.png',
				name: 'Open {re}Source',
				title: 'Open source,',
				accent: '{re}explained.',
				subtitle: 'How it works, how to contribute, how to run your own project.',
			},
			css: ['./src/styles/site.css'],
			head: [
				{ tag: 'meta', attrs: { name: 'twitter:site', content: '@open_resource' } },
				{ tag: 'meta', attrs: { name: 'fediverse:creator', content: '@openresource@fosstodon.org' } },
			],
		}),
	],
});

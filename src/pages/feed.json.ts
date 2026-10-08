export const prerender = true;

import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { getContainerRenderer as mdxRenderer } from '@astrojs/mdx/container-renderer';
import { sortPosts } from '@deramond.dev/astro/blog';

import { SITE, articleItems, feedHtml, jsonFeed } from '../feeds.ts';

// JSON Feed 1.1 with the full HTML of every article in `content_html` (the RSS feeds stay description-only).
export async function GET() {
	const posts = sortPosts(await getCollection('articles'), { production: import.meta.env.PROD });
	const container = await AstroContainer.create({ renderers: await loadRenderers([mdxRenderer()]) });
	const html = new Map<string, string>();
	for (const post of posts) {
		const { Content } = await render(post);
		html.set(post.id, feedHtml(await container.renderToString(Content)));
	}
	const meta = {
		title: 'Open {re}Source',
		description:
			'Open source, {re}explained. Articles about open source: tools, contribution, maintenance, community and funding.',
		home: `${SITE}/`,
		feed: `${SITE}/feed.json`,
	};
	return new Response(JSON.stringify(jsonFeed(meta, articleItems(posts, html)), null, 2), {
		headers: { 'Content-Type': 'application/feed+json; charset=utf-8' },
	});
}

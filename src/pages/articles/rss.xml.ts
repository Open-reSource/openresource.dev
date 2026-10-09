export const prerender = true;

import { getCollection } from 'astro:content';
import { sortPosts } from '@deramond.dev/astro/blog';

import { SITE, articleItems, rss } from '../../feeds.ts';

// Replaces the theme's feed to add a "Read the full article" link to every item. The main feed stays
// description-only; the full HTML lives in /feed.json.
export async function GET() {
	const posts = sortPosts(await getCollection('articles'), { production: import.meta.env.PROD });
	const meta = {
		title: 'Articles · Open {re}Source',
		description: 'Articles about open source: tools, contribution, maintenance, community and funding.',
		home: `${SITE}/articles/`,
		feed: `${SITE}/articles/rss.xml`,
	};
	return new Response(rss(meta, articleItems(posts), { readMore: 'Read the full article' }), {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
	});
}

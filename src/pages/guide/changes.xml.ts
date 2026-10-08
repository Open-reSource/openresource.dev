export const prerender = true;

import { getCollection } from 'astro:content';

import { SITE, guideItems, rss } from '../../feeds.ts';

// The guide chapters by last update, so readers can follow the rewrite.
export async function GET() {
	const entries = await getCollection('docs', ({ id }) => id.startsWith('guide/'));
	const meta = {
		title: 'Guide changes · Open {re}Source',
		description: 'The guide chapters, most recently updated first.',
		home: `${SITE}/guide/`,
		feed: `${SITE}/guide/changes.xml`,
	};
	return new Response(rss(meta, guideItems(entries), { readMore: 'Read the chapter' }), {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
	});
}

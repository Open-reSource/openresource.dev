export const prerender = true;

import { getCollection } from 'astro:content';
import { sortPosts, tagsOf } from '@deramond.dev/astro/blog';

import { SITE, articleItems, rss } from '../../../../feeds.ts';

// One feed per tag, at the slug of the tag page (/articles/tags/<tag>/).
export async function getStaticPaths() {
	const posts = sortPosts(await getCollection('articles'), { production: import.meta.env.PROD });
	return tagsOf(posts).map((tag) => ({ params: { tag: tag.slug }, props: { label: tag.label, posts: tag.posts } }));
}

export function GET({ params, props }: { params: { tag: string }; props: { label: string; posts: any[] } }) {
	const meta = {
		title: `${props.label} · Articles · Open {re}Source`,
		description: `Open {re}Source articles tagged ${props.label}.`,
		home: `${SITE}/articles/tags/${params.tag}/`,
		feed: `${SITE}/articles/tags/${params.tag}/rss.xml`,
	};
	return new Response(rss(meta, articleItems(props.posts), { readMore: 'Read the full article' }), {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
	});
}

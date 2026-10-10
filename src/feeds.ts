// The site's feeds: the articles RSS (and one per tag), the JSON Feed and the guide-changes RSS. Pure functions, so
// tests/feeds.test.ts can run them outside Astro; the pages under src/pages/ only fetch the collections and call them.

export const SITE = 'https://openresource.dev';

export type FeedItem = {
	title: string;
	/** Path, such as `/articles/some-post/`. */
	href: string;
	description: string;
	published: Date;
	modified?: Date;
	tags?: string[];
	/** Full article HTML, JSON Feed only. */
	html?: string;
};

export type FeedMeta = { title: string; description: string; home: string; feed: string };

const escapeXml = (s: string) =>
	s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const absolute = (href: string) => new URL(href, SITE).href;

/** Newest first, ties by title so the order never depends on the loader. */
export const newestFirst = (a: FeedItem, b: FeedItem) =>
	b.published.getTime() - a.published.getTime() || a.title.localeCompare(b.title);

/**
 * RSS 2.0. The `description` of an item is the page description plus a "read more" link, as HTML, so images and
 * custom components never end up in the feed.
 */
export function rss(meta: FeedMeta, items: FeedItem[], { readMore }: { readMore: string }): string {
	const body = items
		.map((item) => {
			const url = absolute(item.href);
			const html = `<p>${escapeXml(item.description)}</p><p><a href="${escapeXml(url)}">${escapeXml(readMore)}</a></p>`;
			return (
				`<item><title>${escapeXml(item.title)}</title><link>${escapeXml(url)}</link>` +
				`<guid isPermaLink="true">${escapeXml(url)}</guid>` +
				`<description>${escapeXml(html)}</description><pubDate>${item.published.toUTCString()}</pubDate>` +
				(item.tags ?? []).map((t) => `<category>${escapeXml(t)}</category>`).join('') +
				'</item>'
			);
		})
		.join('\n');
	return (
		`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>` +
		`<title>${escapeXml(meta.title)}</title><link>${escapeXml(meta.home)}</link>` +
		`<description>${escapeXml(meta.description)}</description><language>en</language>` +
		`<atom:link href="${escapeXml(meta.feed)}" rel="self" type="application/rss+xml"/>\n${body}\n</channel></rss>\n`
	);
}

/** JSON Feed 1.1 (https://www.jsonfeed.org/version/1.1/). */
export function jsonFeed(meta: FeedMeta, items: FeedItem[]) {
	return {
		version: 'https://jsonfeed.org/version/1.1',
		title: meta.title,
		description: meta.description,
		home_page_url: meta.home,
		feed_url: meta.feed,
		language: 'en',
		items: items.map((item) => {
			const url = absolute(item.href);
			return {
				id: url,
				url,
				title: item.title,
				summary: item.description,
				...(item.html ? { content_html: item.html } : {}),
				date_published: item.published.toISOString(),
				...(item.modified ? { date_modified: item.modified.toISOString() } : {}),
				...(item.tags?.length ? { tags: item.tags } : {}),
			};
		}),
	};
}

type Entry = { id: string; data: Record<string, any> };

/** Articles as feed items (`posts` already sorted and filtered). `html` maps an article id to its rendered HTML. */
export function articleItems(posts: Entry[], html: Map<string, string> = new Map()): FeedItem[] {
	return posts.map((p) => ({
		title: p.data.title,
		href: `/articles/${p.id}/`,
		description: p.data.description,
		published: p.data.date,
		modified: p.data.lastUpdated,
		tags: p.data.tags,
		html: html.get(p.id),
	}));
}

/**
 * Guide chapters by `lastUpdated`, newest first. Index pages (the guide and each module), chapters without a date and
 * stubs are left out: a stub has nothing to read yet. `pubDate` is the update date, so readers see what moved.
 */
export function guideItems(entries: Entry[]): FeedItem[] {
	return entries
		.filter((e) => e.id.startsWith('guide/') && !/(^|\/)index$/.test(e.id))
		.filter((e) => e.data.lastUpdated && e.data.status !== 'stub' && !e.data.draft)
		.map((e) => ({
			title: e.data.title,
			href: `/${e.id}/`,
			description: e.data.description ?? '',
			published: e.data.lastUpdated as Date,
		}))
		.sort(newestFirst);
}

/** `html` without its `<script>` elements, in any case, repeated until none is left. */
function withoutScripts(html: string): string {
	let out = html;
	let before: string;
	do {
		before = out;
		out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script[^>]*>/gi, '');
	} while (out !== before);
	return out;
}

/** HTML for a feed reader: no scripts, and site-relative links and images made absolute. */
export function feedHtml(html: string): string {
	return withoutScripts(html)
		.replace(/\b(href|src)="(\/(?!\/)[^"]*)"/g, (_, attr, path) => `${attr}="${absolute(path)}"`)
		.replace(
			/\bsrcset="([^"]*)"/g,
			(_, set) =>
				`srcset="${set.replace(/(^|,\s*)(\/(?!\/)\S*)/g, (_m: string, sep: string, path: string) => `${sep}${absolute(path)}`)}"`
		)
		.trim();
}

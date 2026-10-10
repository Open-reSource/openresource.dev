import { describe, expect, test } from 'vitest';

import { articleItems, feedHtml, guideItems, jsonFeed, rss } from '../src/feeds.ts';

const d = (s: string) => new Date(s);
const meta = {
	title: 'T & Co',
	description: 'D',
	home: 'https://openresource.dev/',
	feed: 'https://openresource.dev/f.xml',
};

describe('feeds', () => {
	test('rss keeps the description and adds a read-more link, escaped', () => {
		const items = articleItems([
			{ id: 'a', data: { title: 'A <b>', description: 'Desc', date: d('2026-10-01'), tags: ['x'] } },
		]);
		const xml = rss(meta, items, { readMore: 'Read the full article' });
		expect(xml).toContain('<title>T &amp; Co</title>');
		expect(xml).toContain(
			'&lt;a href=&quot;https://openresource.dev/articles/a/&quot;&gt;Read the full article&lt;/a&gt;'
		);
		expect(xml).toContain('<category>x</category>');
		expect(xml).not.toContain('content:encoded');
	});

	test('json feed 1.1 carries the full html only when given', () => {
		const items = articleItems(
			[{ id: 'a', data: { title: 'A', description: 'S', date: d('2026-10-01'), lastUpdated: d('2026-10-02') } }],
			new Map([['a', '<p>Full</p>']])
		);
		const feed = jsonFeed(meta, items);
		expect(feed.version).toBe('https://jsonfeed.org/version/1.1');
		expect(feed.items[0]).toMatchObject({
			id: 'https://openresource.dev/articles/a/',
			summary: 'S',
			content_html: '<p>Full</p>',
			date_modified: '2026-10-02T00:00:00.000Z',
		});
	});

	test('guide items: newest update first, no index pages, stubs or undated chapters', () => {
		const page = (id: string, data: object) => ({ id, data: { title: id, ...data } });
		const items = guideItems([
			page('guide/index', { lastUpdated: d('2026-10-05') }),
			page('guide/ai/index', { lastUpdated: d('2026-10-05') }),
			page('guide/ai/old', { lastUpdated: d('2026-09-01') }),
			page('guide/ai/new', { lastUpdated: d('2026-10-03') }),
			page('guide/ai/undated', {}),
			page('guide/ai/stub', { lastUpdated: d('2026-10-04'), status: 'stub' }),
			page('resources/books', { lastUpdated: d('2026-10-04') }),
		]);
		expect(items.map((i) => i.href)).toEqual(['/guide/ai/new/', '/guide/ai/old/']);
	});

	test('feedHtml removes scripts and makes site links absolute', () => {
		const out = feedHtml(
			'<script>x()</script><a href="/guide/">g</a><img src="/i.png" srcset="/a.png 1x, /b.png 2x"><a href="//x.y">z</a>'
		);
		expect(out).toBe(
			'<a href="https://openresource.dev/guide/">g</a><img src="https://openresource.dev/i.png" srcset="https://openresource.dev/a.png 1x, https://openresource.dev/b.png 2x"><a href="//x.y">z</a>'
		);
	});

	test('feedHtml removes scripts in any case, with attributes, and nested ones', () => {
		expect(feedHtml('<p>a</p><SCRIPT type="module">x()</SCRIPT ><p>b</p>')).toBe('<p>a</p><p>b</p>');
		expect(feedHtml('<scr<script>x()</script>ipt>y()</script><p>c</p>')).toBe('<p>c</p>');
	});
});

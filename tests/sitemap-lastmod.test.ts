import { describe, expect, test } from 'vitest';

import { lastmodOf, lastmodMap, pathOf, withLastmod } from '../src/sitemap-lastmod.mjs';

describe('sitemap lastmod', () => {
	test('lastUpdated wins over date, and a page with neither has none', () => {
		expect(lastmodOf('---\ntitle: A\ndate: 2026-09-01\nlastUpdated: 2026-10-02\n---\nBody')).toBe('2026-10-02');
		expect(lastmodOf('---\ntitle: A\ndate: 2026-09-01\n---\nBody')).toBe('2026-09-01');
		expect(lastmodOf('---\ntitle: A\n---\nBody')).toBeUndefined();
		expect(lastmodOf('No frontmatter\ndate: 2026-09-01')).toBeUndefined();
	});

	test('content files map to their page path', () => {
		expect(pathOf('guide/index.mdx', 'docs')).toBe('/guide/');
		expect(pathOf('guide/ai/index.mdx', 'docs')).toBe('/guide/ai/');
		expect(pathOf('guide/ai/contribution-policy.mdx', 'docs')).toBe('/guide/ai/contribution-policy/');
		expect(pathOf('resources/books.mdx', 'docs')).toBe('/resources/books/');
		expect(pathOf('hacktoberfest.mdx', 'articles')).toBe('/articles/hacktoberfest/');
	});

	test('serialize sets lastmod from the map and leaves other pages without one', () => {
		const serialize = withLastmod(new Map([['/guide/', '2026-10-05']]));
		expect(serialize({ url: 'https://openresource.dev/guide/' }).lastmod).toBe('2026-10-05T00:00:00.000Z');
		expect(serialize({ url: 'https://openresource.dev/guide' }).lastmod).toBe('2026-10-05T00:00:00.000Z');
		expect(serialize({ url: 'https://openresource.dev/articles/' }).lastmod).toBeUndefined();
	});

	test('every dated content file is in the map', () => {
		const map = lastmodMap();
		expect(map.get('/guide/glossary/')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect([...map.keys()].every((p) => p.startsWith('/') && p.endsWith('/'))).toBe(true);
	});
});

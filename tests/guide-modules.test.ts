import fs from 'node:fs';
import { describe, expect, test } from 'vitest';

import { modules, moved } from '../src/guide-modules.mjs';

const root = new URL('../src/content/docs/', import.meta.url);
const exists = (id: string) =>
	['.mdx', '.md', '/index.mdx', '/index.md'].some((ext) => fs.existsSync(new URL(`${id}${ext}`, root)));

const live = modules.flatMap(({ dir, pages }) => [`/guide/${dir}`, ...pages.map((page) => `/guide/${dir}/${page}`)]);

describe('guide modules', () => {
	test('every module and page in the sidebar is a file', () => {
		expect(live.filter((url) => !exists(url.slice(1)))).toEqual([]);
	});

	test('no two pages share a URL', () => {
		expect(live.filter((url, i) => live.indexOf(url) !== i)).toEqual([]);
	});

	test('no redirect starts from a live page', () => {
		expect(Object.keys(moved).filter((from) => live.includes(from))).toEqual([]);
	});

	test('every redirect lands on a live page, in one hop', () => {
		expect(Object.entries(moved).filter(([, to]) => !live.includes(to))).toEqual([]);
	});

	test('every page of a renamed module keeps its old URL as a redirect', () => {
		const missing = modules
			.filter(({ oldDir }) => oldDir)
			.flatMap(({ oldDir, pages }) => [`/guide/${oldDir}`, ...pages.map((page) => `/guide/${oldDir}/${page}`)])
			.filter((from) => !(from in moved));
		expect(missing).toEqual([]);
	});
});

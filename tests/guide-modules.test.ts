import fs from 'node:fs';
import { describe, expect, test } from 'vitest';

import { guide, isStub, modules, moved } from '../src/guide-modules.mjs';

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
		expect(Object.entries(moved).filter(([, to]) => !live.includes(to.split('#')[0]))).toEqual([]);
	});

	test('a merged page is gone, and all its URLs redirect to the page that absorbed it', () => {
		const merged = modules.flatMap((module) =>
			Object.entries(('merged' in module ? module.merged : {}) as Record<string, string>).map(([page, to]) => ({
				dir: module.dir,
				oldDir: 'oldDir' in module ? module.oldDir : undefined,
				page,
				to,
			}))
		);
		expect(merged.filter(({ dir, page }) => exists(`guide/${dir}/${page}`))).toEqual([]);
		const unredirected = merged.flatMap(({ dir, oldDir, page, to }) =>
			[`/guide/${dir}/${page}`, ...(oldDir ? [`/guide/${oldDir}/${page}`] : [])].filter(
				(from) => moved[from] !== `/guide/${to}`
			)
		);
		expect(unredirected).toEqual([]);
	});

	test('every page of a renamed module keeps its old URL as a redirect', () => {
		const missing = modules
			.filter(({ oldDir }) => oldDir)
			.flatMap(({ oldDir, pages }) => [`/guide/${oldDir}`, ...pages.map((page) => `/guide/${oldDir}/${page}`)])
			.filter((from) => !(from in moved));
		expect(missing).toEqual([]);
	});

	test('a stub stays out of the sidebar, every other page is in it', () => {
		const wrong = modules.flatMap((module) => {
			const items = guide(module).items;
			return module.pages.filter((page) => items.includes(`guide/${module.dir}/${page}`) === isStub(module.dir, page));
		});
		expect(wrong).toEqual([]);
	});
});

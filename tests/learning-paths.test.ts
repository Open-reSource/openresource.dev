import { describe, expect, test } from 'vitest';

import { isStub, modules } from '../src/guide-modules.mjs';
import { paths } from '../src/learning-paths.mjs';
import { pathData } from '../src/learning-paths-integration.mjs';
import { locate } from '../src/learning-paths-client.ts';

const chapters = new Set(modules.flatMap(({ dir, pages }) => pages.map((page) => `${dir}/${page}`)));

describe('learning paths', () => {
	test('every chapter of a path is a page of the guide', () => {
		const missing = paths.flatMap(({ id, chapters: list }) =>
			list.filter((chapter) => !chapters.has(chapter)).map((chapter) => `${id}: ${chapter}`)
		);
		expect(missing).toEqual([]);
	});

	test('no path sends the reader to a stub', () => {
		const stubs = paths.flatMap(({ id, chapters: list }) =>
			list
				.filter((chapter) => chapters.has(chapter) && isStub(...(chapter.split('/') as [string, string])))
				.map((chapter) => `${id}: ${chapter}`)
		);
		expect(stubs).toEqual([]);
	});

	test('no chapter appears twice in a path', () => {
		const twice = paths.flatMap(({ id, chapters: list }) =>
			list.filter((chapter, i) => list.indexOf(chapter) !== i).map((chapter) => `${id}: ${chapter}`)
		);
		expect(twice).toEqual([]);
	});

	test('every path has 6 to 10 chapters', () => {
		const sizes = paths
			.filter(({ chapters: list }) => list.length < 6 || list.length > 10)
			.map(({ id, chapters: list }) => `${id}: ${list.length}`);
		expect(sizes).toEqual([]);
	});

	test('ids are unique and URL-safe', () => {
		const ids = paths.map(({ id }) => id);
		expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
		expect(ids.filter((id) => !/^[a-z]+(-[a-z]+)*$/.test(id))).toEqual([]);
	});
});

describe('learning path on a chapter', () => {
	const data = pathData();
	const [first, second] = data;

	test('every chapter reaches the script with its URL and title', () => {
		const untitled = data.flatMap(({ id, chapters: list }) =>
			list.filter(({ title }) => typeof title !== 'string' || !title).map(({ href }) => `${id}: ${href}`)
		);
		expect(untitled).toEqual([]);
	});

	test('finds the chapter in the path from the link, with or without the trailing slash', () => {
		const href = first.chapters[2].href;
		expect(locate(data, { pathname: href, param: first.id })).toEqual({ path: first, index: 2 });
		expect(locate(data, { pathname: href.slice(0, -1), stored: first.id })).toEqual({ path: first, index: 2 });
	});

	test('the path from the link wins over the stored one', () => {
		const shared = second.chapters.find(({ href }) => first.chapters.some((chapter) => chapter.href === href));
		const pathname = shared?.href ?? second.chapters[0].href;
		expect(locate(data, { pathname, param: second.id, stored: first.id })?.path.id).toBe(second.id);
	});

	test('shows nothing outside the path, without a path, or for an unknown id', () => {
		const outside = second.chapters.find(({ href }) => !first.chapters.some((chapter) => chapter.href === href))!;
		expect(locate(data, { pathname: outside.href, stored: first.id })).toBeUndefined();
		expect(locate(data, { pathname: first.chapters[0].href })).toBeUndefined();
		expect(locate(data, { pathname: first.chapters[0].href, param: 'nope', stored: 'gone' })).toBeUndefined();
	});
});

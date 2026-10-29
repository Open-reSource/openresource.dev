import { describe, expect, test } from 'vitest';

import { isStub, modules } from '../src/guide-modules.mjs';
import { paths } from '../src/learning-paths.mjs';
import { pathData, readableChapters } from '../src/learning-paths-integration.mjs';
import { locate } from '../src/learning-paths-client.ts';
import {
	chapterKey,
	describe as describeProgress,
	parse,
	progressOf,
	stringify,
	toggle,
} from '../src/reading-progress.ts';

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

describe('minutes', () => {
	test('every chapter of a path has a number of minutes', () => {
		const missing = pathData().flatMap(({ id, chapters: list }) =>
			list.filter(({ minutes }) => !Number.isInteger(minutes) || minutes < 1).map(({ href }) => `${id}: ${href}`)
		);
		expect(missing).toEqual([]);
	});

	test('every chapter of a path can be marked as read', () => {
		const readable = new Set(readableChapters());
		const unreadable = pathData().flatMap(({ id, chapters: list }) =>
			list.filter(({ href }) => !readable.has(chapterKey(href) ?? '')).map(({ href }) => `${id}: ${href}`)
		);
		expect(unreadable).toEqual([]);
	});
});

describe('reading progress', () => {
	const chapters = [
		{ href: '/guide/getting-started/finding-open-source-projects/', title: 'A', minutes: 10 },
		{ href: '/guide/contributing/finding-open-source-projects/', title: 'B', minutes: 7 },
		{ href: '/guide/licensing/non-code-licenses/', title: 'C', minutes: 4 },
	];

	test('keys a chapter by module and page, so two chapters with one page name stay apart', () => {
		expect(chapterKey(chapters[0].href)).toBe('getting-started/finding-open-source-projects');
		expect(chapterKey('/guide/contributing/finding-open-source-projects')).toBe(
			'contributing/finding-open-source-projects'
		);
		expect(chapterKey('/guide/start/')).toBeUndefined();
		expect(chapterKey('/guide/licensing/')).toBeUndefined();
	});

	test('starts empty for nothing, corrupt data, another shape or an unknown version', () => {
		const empty = { v: 1, read: [] };
		expect(parse(null)).toEqual(empty);
		expect(parse('{not json')).toEqual(empty);
		expect(parse('{"v":2,"read":["a/b"]}')).toEqual(empty);
		expect(parse('{"v":1,"read":"a/b"}')).toEqual(empty);
		expect(parse('{"v":1,"read":["a/b",3,"a/b"]}')).toEqual({ v: 1, read: ['a/b'] });
	});

	test('keeps the path id the first version stored as a bare string', () => {
		expect(parse('maintainer')).toEqual({ v: 1, path: 'maintainer', read: [] });
	});

	test('round-trips, and toggling marks and unmarks without touching the path', () => {
		const marked = toggle({ v: 1, path: 'founder', read: [] }, 'a/b', true);
		expect(parse(stringify(marked))).toEqual({ v: 1, path: 'founder', read: ['a/b'] });
		expect(toggle(toggle(marked, 'a/b', true), 'a/b', false)).toEqual({ v: 1, path: 'founder', read: [] });
	});

	test('counts what is read in any order and sums the minutes of the rest', () => {
		const state = { v: 1 as const, read: ['licensing/non-code-licenses', 'contributing/finding-open-source-projects'] };
		const result = progressOf(chapters, state);
		expect(result).toEqual({ done: 2, total: 3, minutes: 10 });
		expect(describeProgress(result)).toBe('2 of 3 read, 10 min left');
	});

	test('says the path is complete once every chapter is read', () => {
		const read = chapters.map(({ href }) => chapterKey(href)!);
		expect(describeProgress(progressOf(chapters, { v: 1, read }))).toBe('Path complete');
	});
});

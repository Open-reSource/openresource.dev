import fs from 'node:fs';
import { describe, expect, test } from 'vitest';

const read = (name: string) =>
	JSON.parse(fs.readFileSync(new URL(`../src/content/${name}.json`, import.meta.url), 'utf8'));
const categories: { id: string }[] = read('tool-categories');
const tools: { name: string; url: string; category: string; description: string; article?: string }[] = read('tools');

const articles = new URL('../src/content/articles/', import.meta.url);

describe('tools', () => {
	test('every tool has a known category, a unique name and an https URL', () => {
		const ids = categories.map(({ id }) => id);
		expect(tools.filter(({ category }) => !ids.includes(category)).map(({ name }) => name)).toEqual([]);
		expect(new Set(tools.map(({ name }) => name)).size).toBe(tools.length);
		expect(tools.filter(({ url }) => !url.startsWith('https://')).map(({ name }) => name)).toEqual([]);
	});

	test('every category has at least one tool', () => {
		expect(categories.filter(({ id }) => !tools.some(({ category }) => category === id)).map(({ id }) => id)).toEqual(
			[]
		);
	});

	test('every tool is described in one line, without an exclamation mark', () => {
		expect(
			tools.filter(({ description }) => !description.endsWith('.') || description.includes('!')).map(({ name }) => name)
		).toEqual([]);
	});

	test('every linked article exists', () => {
		const missing = tools.filter(({ article }) => article && !fs.existsSync(new URL(`${article}.mdx`, articles)));
		expect(missing.map(({ name }) => name)).toEqual([]);
	});
});

// Where the guide stands: one row per chapter, in sidebar order, with its status, size and last update. Prints a
// Markdown table, ready to paste in an issue.
//
//   npm run status [-- --only stub|draft|complete]
import fs from 'node:fs';
import { parseArgs } from 'node:util';
import { readingTime } from '@deramond.dev/astro/blog';

import { STATUSES, frontmatterOf, statusOf } from '../src/chapter-status.mjs';
import { modules } from '../src/guide-modules.mjs';

const { values } = parseArgs({ options: { only: { type: 'string' } } });
if (values.only && !STATUSES.includes(values.only)) {
	console.error(`--only takes one of: ${STATUSES.join(', ')}`);
	process.exit(1);
}

const docs = new URL('../src/content/docs/', import.meta.url);

// Words of prose, the way the reading time counts them: no frontmatter, imports, tags or code.
const words = (body: string) =>
	body
		.replace(/^---[\s\S]*?---/, '')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/^import .*$/gm, ' ')
		.replace(/<[^>]+>/g, ' ')
		.split(/\s+/)
		.filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

// Markdown images, <ContentImage> and <img>.
const images = (body: string) => (body.match(/!\[[^\]]*\]\(|<ContentImage\b|<img\b/g) ?? []).length;

const day = (date: unknown) => (date instanceof Date ? date.toISOString().slice(0, 10) : date ? String(date) : '');

const rows = modules.flatMap(({ label, dir, pages }) =>
	pages.map((page) => {
		const file = new URL(`guide/${dir}/${page}.mdx`, docs);
		const body = fs.readFileSync(file, 'utf8');
		const { title, lastUpdated, date } = frontmatterOf(file);
		return {
			module: label,
			title: String(title),
			url: `https://openresource.dev/guide/${dir}/${page}/`,
			status: statusOf(file),
			words: words(body),
			images: images(body),
			updated: day(lastUpdated ?? date),
			minutes: words(body) ? readingTime(body) : 0,
		};
	})
);

const shown = values.only ? rows.filter((r) => r.status === values.only) : rows;

console.log('| Module | Chapter | Status | Words | Images | Updated | Reading |');
console.log('| --- | --- | --- | ---: | ---: | --- | ---: |');
for (const r of shown) {
	console.log(
		`| ${r.module} | [${r.title}](${r.url}) | ${r.status} | ${r.words} | ${r.images} | ${r.updated || '–'} | ${r.minutes ? `${r.minutes} min` : '–'} |`
	);
}

const count = (status: string) => rows.filter((r) => r.status === status).length;
console.log(`\n${rows.length} chapters: ${STATUSES.map((s) => `${count(s)} ${s}`).join(', ')}.`);

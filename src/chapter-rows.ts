// One row per guide chapter, in sidebar order, with its status, size and last update. Shared by `npm run status`
// (scripts/content-status.ts) and the public /guide/status/ page, so the two tables can't drift apart.
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { readingTime } from '@deramond.dev/astro/blog';

import { frontmatterOf, statusOf } from './chapter-status.mjs';
import { modules } from './guide-modules.mjs';

// From the project root, not import.meta.url: the build bundles this module away from src/.
const docs = new URL('src/content/docs/', pathToFileURL(`${process.cwd()}/`));

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

export const rows = modules.flatMap(({ label, dir, pages }) =>
	pages.map((page) => {
		const file = new URL(`guide/${dir}/${page}.mdx`, docs);
		const body = fs.readFileSync(file, 'utf8');
		const { title, lastUpdated, date } = frontmatterOf(file);
		return {
			module: label,
			title: String(title),
			path: `/guide/${dir}/${page}/`,
			status: statusOf(file),
			words: words(body),
			images: images(body),
			updated: day(lastUpdated ?? date),
			minutes: words(body) ? readingTime(body) : 0,
		};
	})
);

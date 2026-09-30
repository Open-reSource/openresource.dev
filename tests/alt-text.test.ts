import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

// Informative images need alt text: an empty alt tells screen readers to skip the image. Resource banners are
// decorative, so `src/content/docs/resources/` may use it.
const root = path.resolve(__dirname, '../src/content');
const decorative = path.join(root, 'docs/resources');

const files = (dir: string): string[] =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const file = path.join(dir, entry.name);
		if (entry.isDirectory()) return file === decorative ? [] : files(file);
		return /\.mdx?$/.test(entry.name) ? [file] : [];
	});

test('no empty alt text on content images', () => {
	const empty = files(root).flatMap((file) =>
		fs
			.readFileSync(file, 'utf8')
			.split('\n')
			.flatMap((line, i) => (/alt=(""|\{""\})|!\[\]\(/.test(line) ? [`${path.relative(root, file)}:${i + 1}`] : []))
	);
	expect(empty).toEqual([]);
});

// Alt text says what's shown, in 125 characters at most, and never starts with "Screenshot of": a screen reader
// already announces an image. "Alt" or "Image" alone is a placeholder, not a description.
const alts = (file: string) => {
	const found: { alt: string; at: string }[] = [];
	let fenced = false;
	fs.readFileSync(file, 'utf8')
		.split('\n')
		.forEach((line, i) => {
			if (/^\s*```/.test(line)) fenced = !fenced;
			if (fenced) return;
			const at = `${path.relative(root, file)}:${i + 1}`;
			for (const m of line.matchAll(/\balt="([^"]+)"|!\[([^\]]+)\]\(/g)) found.push({ alt: m[1] ?? m[2], at });
		});
	return found;
};

test('alt text is 125 characters at most, with no "Screenshot of" and no placeholder', () => {
	const bad = files(root)
		.flatMap(alts)
		.filter(
			({ alt }) => alt.length > 125 || /^(screenshot|image|picture) of\b/i.test(alt) || /^(alt|image)$/i.test(alt)
		)
		.map(({ alt, at }) => `${at} (${alt.length}): ${alt}`);
	expect(bad).toEqual([]);
});

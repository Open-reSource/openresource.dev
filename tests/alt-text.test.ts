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

import fs from 'node:fs';
import { parse } from 'yaml';

// A guide page's `status` frontmatter: `stub` (planned, not written), `draft` (sections missing) or `complete`, the
// default. Read from the file itself, so the sidebar (astro.config.mjs) and the Markdown plugin below agree without
// the content collection, which neither of them can reach.
export const STATUSES = ['stub', 'draft', 'complete'];

/** @param {string | URL} file */
export function frontmatterOf(file) {
	return parse(fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '') ?? {};
}

/** @param {string | URL} file */
export function statusOf(file) {
	const { status = 'complete' } = frontmatterOf(file);
	if (!STATUSES.includes(status)) throw new Error(`${file}: unknown status "${status}" (${STATUSES.join(', ')})`);
	return status;
}

const REPO = 'https://github.com/Open-reSource/openresource.dev';

const text = (value) => ({ type: 'text', value });
const link = (url, value) => ({ type: 'link', url, children: [text(value)] });

// Rendered as a GitHub-style alert, which the theme turns into a brand callout.
const BOXES = {
	stub: [
		'[!WARNING] Not written yet',
		(description) => [
			text(`This chapter is planned. ${description} Want to write it? `),
			link(`${REPO}/issues`, 'Open an issue'),
			text(' to say so, or send a pull request.'),
		],
	],
	draft: [
		'[!NOTE] Draft',
		() => [
			text('Some sections of this chapter are not written yet. '),
			link(`${REPO}/issues`, 'Suggest what is missing'),
			text('.'),
		],
	],
};

/** Sätteri plugin: a stub or draft page opens with a box that says so. */
export function chapterStatus({ fileURL }) {
	// Only docs pages have a status; articles are left alone.
	if (!fileURL?.pathname.includes('/src/content/docs/')) return null;
	const box = BOXES[statusOf(fileURL)];
	if (!box) return null;
	const [title, body] = box;
	const { description = '' } = frontmatterOf(fileURL);
	return {
		name: 'chapter-status',
		before(root, ctx) {
			ctx.prependChild(root, {
				type: 'blockquote',
				children: [{ type: 'paragraph', children: [text(title), { type: 'break' }, ...body(description)] }],
			});
		},
	};
}

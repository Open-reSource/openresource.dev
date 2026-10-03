import fs from 'node:fs';

// `related` in the frontmatter of a chapter or an article lists pages by id: `guide/<module>/<chapter>` for the
// guide and resources, `articles/<slug>` for articles. The <Related> block and scripts/content-graph.ts read it.
const content = new URL('./content/', import.meta.url);

// Not a YAML parse: some article excerpts span lines inside quotes, which the `yaml` package rejects and Astro accepts.
function frontmatterOf(file) {
	const head = fs.readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
	const scalar = (key) => head.match(new RegExp(`^${key}: *(.+)$`, 'm'))?.[1].replace(/^(["'])(.*)\1$/, '$2');
	const list = head.match(/^related:\r?\n((?:  - .+\r?\n?)+)/m)?.[1] ?? '';
	return {
		title: scalar('title'),
		status: scalar('status'),
		related: [...list.matchAll(/^  - (.+)$/gm)].map(([, id]) => id.trim()),
	};
}

/** The file of a page id, or undefined when there is none. */
export function fileOf(id) {
	const base = id.startsWith('articles/') ? `articles/${id.slice('articles/'.length)}` : `docs/${id}`;
	return [`${base}.mdx`, `${base}/index.mdx`].map((path) => new URL(path, content)).find((url) => fs.existsSync(url));
}

/** Every page with its `related` ids: `{ id, kind, title, status, related }`. */
export function pages() {
	const list = (dir, prefix) =>
		fs
			.readdirSync(new URL(dir, content), { recursive: true, encoding: 'utf8' })
			.filter((file) => file.endsWith('.mdx'))
			.map((file) => {
				const { title, status = 'complete', related } = frontmatterOf(new URL(`${dir}${file}`, content));
				const id = `${prefix}${file.replace(/(\/index)?\.mdx$/, '')}`;
				return { id, kind: prefix ? 'article' : 'chapter', title, status, related };
			});
	return [...list('docs/', ''), ...list('articles/', 'articles/')];
}

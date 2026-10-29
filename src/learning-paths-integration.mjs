import fs from 'node:fs';
import { readingTime } from '@deramond.dev/astro/blog';
import { frontmatterOf } from './chapter-status.mjs';
import { modules, isStub } from './guide-modules.mjs';
import { paths } from './learning-paths.mjs';

// The learning paths reach the chapters as a script on every page (`src/learning-paths-client.ts`): the theme's docs
// route has no slot for the site on chapter pages, and the path a reader follows lives in their browser anyway. The
// script gets each path's chapters with their URL, title and reading time, read from the files, as the sidebar does:
// restart the dev server after changing a path or a chapter. The minutes use the formula of the guide's own pages
// (`readingTime`), so "8 min" is the same number everywhere.
const guide = new URL('content/docs/guide/', import.meta.url);

const minutesOf = (chapter) => readingTime(fs.readFileSync(new URL(`${chapter}.mdx`, guide), 'utf8'));

export const pathData = () =>
	paths.map(({ id, persona, chapters }) => ({
		id,
		persona,
		chapters: chapters.map((chapter) => ({
			href: `/guide/${chapter}/`,
			title: frontmatterOf(new URL(`${chapter}.mdx`, guide)).title,
			minutes: minutesOf(chapter),
		})),
	}));

/** Every written chapter of the guide (`<dir>/<page>`): the ones a reader can mark as read. */
export const readableChapters = () =>
	modules.flatMap(({ dir, pages }) => pages.filter((page) => !isStub(dir, page)).map((page) => `${dir}/${page}`));

/** @returns {import('astro').AstroIntegration} */
export const learningPaths = () => ({
	name: 'learning-paths',
	hooks: {
		'astro:config:setup': ({ injectScript }) => {
			injectScript(
				'page',
				`import { follow } from '/src/learning-paths-client.ts'; follow(${JSON.stringify(pathData())}, ${JSON.stringify(readableChapters())});`
			);
		},
	},
});

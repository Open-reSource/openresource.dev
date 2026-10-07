import { frontmatterOf } from './chapter-status.mjs';
import { paths } from './learning-paths.mjs';

// The learning paths reach the chapters as a script on every page (`src/learning-paths-client.ts`): the theme's docs
// route has no slot for the site on chapter pages, and the path a reader follows lives in their browser anyway. The
// script gets each path's chapters with their URL and title, read from the files, as the sidebar does: restart the dev
// server after changing a path or a chapter title.
const guide = new URL('content/docs/guide/', import.meta.url);

export const pathData = () =>
	paths.map(({ id, persona, chapters }) => ({
		id,
		persona,
		chapters: chapters.map((chapter) => ({
			href: `/guide/${chapter}/`,
			title: frontmatterOf(new URL(`${chapter}.mdx`, guide)).title,
		})),
	}));

/** @returns {import('astro').AstroIntegration} */
export const learningPaths = () => ({
	name: 'learning-paths',
	hooks: {
		'astro:config:setup': ({ injectScript }) => {
			injectScript(
				'page',
				`import { follow } from '/src/learning-paths-client.ts'; follow(${JSON.stringify(pathData())});`
			);
		},
	},
});

import { modules } from './guide-modules.mjs';

// Article tags that point at a guide module (`dir` in src/guide-modules.mjs). An article tagged `Community` belongs
// with the `maintaining` chapters, one tagged `Funding` with `financing`. Tags that name a tool or a format
// (`GitHub`, `Tutorial`) are not here. scripts/content-graph.ts warns when a tagged article has no related chapter
// in the module its tag maps to.
export const TAG_MODULES = {
	AI: 'ai',
	Community: 'maintaining',
	Contribution: 'contributing',
	Funding: 'financing',
	Security: 'maintaining',
	Sponsors: 'financing',
};

/** The modules an article's tags map to, without duplicates. */
export function modulesOf(tags) {
	return [...new Set(tags.map((tag) => TAG_MODULES[tag]).filter(Boolean))];
}

/**
 * The groups for the theme's `blog.groups` option: one per guide module that has a tag in TAG_MODULES, in sidebar
 * order, so a new TAG_MODULES entry shows up on the articles index without touching astro.config.mjs.
 */
export function moduleGroups() {
	return modules
		.map(({ label, dir }) => ({
			label,
			slug: dir,
			tags: Object.keys(TAG_MODULES).filter((tag) => TAG_MODULES[tag] === dir),
		}))
		.filter(({ tags }) => tags.length > 0);
}

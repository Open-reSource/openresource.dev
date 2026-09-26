// Guide modules, in sidebar order. `oldDir` is the folder a module had before the short slugs (2026-09): every page
// under it gets a 301 to its new URL.
export const modules = [
	{
		label: 'What Is Open Source?',
		dir: 'what-is-open-source',
		pages: [
			'definition-of-open-source',
			'brief-history-of-open-source',
			'the-significance-of-open-source',
			'examples-of-successful-open-source-projects',
			'types-of-open-source-projects',
			'types-of-open-source-software-projects',
			'benefits-of-open-source',
		],
	},
	{
		label: 'Getting Started',
		dir: 'getting-started',
		oldDir: 'getting-started-with-open-source',
		pages: ['source-code-hosting-platforms', 'finding-open-source-projects'],
	},
	{
		label: 'Contributing',
		dir: 'contributing',
		oldDir: 'contributing-to-open-source-projects',
		pages: [
			'finding-open-source-projects',
			'contributing-to-open-source',
			'getting-involved-in-the-open-source-community',
			'building-a-portfolio-with-open-source-contributions',
			'overcoming-challenges-in-open-source-contributions',
		],
	},
	{
		label: 'Creating',
		dir: 'creating',
		oldDir: 'creating-your-own-open-source-project',
		pages: [
			'choosing-a-project-idea',
			'planning-your-project',
			'creating-your-project',
			'legal-considerations',
			'developing-your-project',
			'building-and-engaging-your-community',
		],
	},
	{
		label: 'Maintaining',
		dir: 'maintaining',
		oldDir: 'maintaining-open-source-projects',
		pages: [
			'introduction-to-open-source-project-maintenance',
			'managing-contributions-and-community-engagement',
			'managing-project-dependencies',
			'fostering-a-strong-and-inclusive-community',
			'ensuring-project-sustainability',
		],
	},
	{
		label: 'Promoting',
		dir: 'promoting',
		oldDir: 'promoting-open-source-projects',
		pages: [
			'introduction-to-project-promotion',
			'building-a-strong-project-identity',
			'crafting-an-engaging-project-website',
		],
	},
	{
		label: 'Financing',
		dir: 'financing',
		oldDir: 'financing-open-source-projects',
		pages: [
			'importance-and-challenges-of-financing-open-source-projects',
			'understanding-funding-models',
			'effective-fundraising-strategies',
			'resource-allocation-and-budgeting',
			'fostering-a-sustainable-ecosystem',
			'transparency-accountability-and-community-involvement',
		],
	},
];

export const guide = ({ label, dir, pages }) => ({
	label,
	items: [`guide/${dir}`, ...pages.map((page) => `guide/${dir}/${page}`)],
});

// One redirect per page, not `[...slug]`: the Vercel adapter writes a dynamic redirect's target literally.
/** @type {Record<string, string>} */
export const moved = Object.fromEntries(
	modules
		.filter(({ oldDir }) => oldDir)
		.flatMap(({ dir, oldDir, pages }) => [
			[`/guide/${oldDir}`, `/guide/${dir}`],
			...pages.map((page) => [`/guide/${oldDir}/${page}`, `/guide/${dir}/${page}`]),
		])
);

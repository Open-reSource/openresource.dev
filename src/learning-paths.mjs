// The learning paths of /guide/start/: one per reader, each an ordered list of guide chapters (`<dir>/<page>`, as in
// `src/guide-modules.mjs`). `id` is short and stable: it ends up in URLs and in readers' browsers, so it never changes
// once published. `tests/learning-paths.test.ts` fails when a chapter isn't in the guide, is a stub, appears twice in a
// path, or a path has fewer than 6 or more than 10 chapters.
//
// Waiting for their chapters, as of October 2026: a "Developer at a company" path (`company`) comes with the chapter on
// contributing on company time. Chapters on triage and on releases go into `maintainer` (after `repository-files` and
// after `reviewing-pull-requests`), one on documentation into `non-code` (after `writing-a-bug-report`), and the ones
// on commercial open source and funding platforms into `founder` (after `understanding-funding-models`).
export const paths = [
	{
		id: 'first-timer',
		persona: 'First-timer',
		who: 'Student, bootcamp, self-taught.',
		promise: 'Open a real pull request this week.',
		chapters: [
			'what-is-open-source/definition-of-open-source',
			'getting-started/git-and-github-basics',
			'getting-started/reading-a-repository',
			'contributing/finding-open-source-projects',
			'contributing/contributing-to-open-source',
			'contributing/writing-a-bug-report',
			'getting-started/open-source-etiquette',
			'contributing/overcoming-challenges-in-open-source-contributions',
		],
	},
	{
		id: 'non-code',
		persona: 'Designer, writer, translator',
		who: 'You make the docs, the icons, the translations or the website.',
		promise: 'Contribute without writing code.',
		chapters: [
			'contributing/non-code-contributions',
			'getting-started/reading-a-repository',
			'getting-started/open-source-etiquette',
			'getting-started/git-and-github-basics',
			'contributing/writing-a-bug-report',
			'licensing/non-code-licenses',
			'promoting/building-a-strong-project-identity',
		],
	},
	{
		id: 'maintainer',
		persona: 'New maintainer',
		who: 'You just got the Maintain role, or you shipped v0.1.',
		promise: 'Survive your first hundred issues.',
		chapters: [
			'creating/repository-files',
			'maintaining/reviewing-pull-requests',
			'maintaining/saying-no',
			'maintaining/community',
			'maintaining/security-for-maintainers',
			'maintaining/managing-project-dependencies',
			'ai/contribution-policy',
			'maintaining/burnout-succession-and-the-end',
		],
	},
	{
		id: 'founder',
		persona: 'Founder or business',
		who: "You're building a company on a project you open-source.",
		promise: 'Build on open source without getting burned.',
		chapters: [
			'licensing/choosing-a-license',
			'licensing/license-compatibility',
			'licensing/cla-vs-dco',
			'licensing/trademarks',
			'licensing/relicensing',
			'financing/understanding-funding-models',
			'maintaining/governance',
		],
	},
];

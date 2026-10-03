// The anchor of a template's card on the page.
export const templateId = (file) => file.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// The templates gallery: one entry per file in src/templates/. `path` is where the file goes in a repository, `chapter`
// the guide page that explains it (a doc id). tests/templates.test.ts fails on a missing file or chapter.
export const templates = [
	{
		file: 'README.md',
		path: 'README.md',
		description: 'What it does, how to install it, a first example, how to contribute. One screen.',
		chapter: 'guide/creating/repository-files',
	},
	{
		file: 'CONTRIBUTING.md',
		path: 'CONTRIBUTING.md',
		description: 'The reply you would otherwise retype: before you start, set up, pull requests, review.',
		chapter: 'guide/creating/repository-files',
	},
	{
		file: 'SECURITY.md',
		path: 'SECURITY.md',
		description: 'Supported versions, a private way to report, and a promise about timing.',
		chapter: 'guide/creating/repository-files',
	},
	{
		file: 'GOVERNANCE.md',
		path: 'GOVERNANCE.md',
		description: 'Roles, how decisions are made, how to become a committer, how to step down.',
		chapter: 'guide/maintaining/governance',
	},
	{
		file: 'bug.yml',
		path: '.github/ISSUE_TEMPLATE/bug.yml',
		description: 'A bug report form that asks for the version, the expectation and the steps to reproduce.',
		chapter: 'guide/creating/repository-files',
	},
	{
		file: 'config.yml',
		path: '.github/ISSUE_TEMPLATE/config.yml',
		description: 'Turns off blank issues and sends questions and vulnerabilities to the right place.',
		chapter: 'guide/creating/repository-files',
	},
	{
		file: 'pull_request_template.md',
		path: '.github/pull_request_template.md',
		description: 'What changes, how to test it, a short checklist.',
		chapter: 'guide/creating/repository-files',
	},
	{
		file: 'CHANGELOG.md',
		path: 'CHANGELOG.md',
		description: 'A Keep a Changelog skeleton with an Unreleased section.',
		chapter: 'guide/creating/repository-files',
	},
	{
		file: 'CODEOWNERS',
		path: '.github/CODEOWNERS',
		description: 'Default owners, plus one owner for the docs and one for CI.',
		chapter: 'guide/creating/repository-files',
	},
	{
		file: 'ARCHIVED.md',
		path: 'top of README.md',
		description: 'The notice to put above the README when the project is archived: status, alternative, migration.',
		chapter: 'guide/maintaining/burnout-succession-and-the-end',
	},
];

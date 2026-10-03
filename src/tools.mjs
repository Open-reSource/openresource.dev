// The tools directory of /resources/tools/: one entry per tool, grouped by category.
// `usedBy` lists the projects of ours that run it (rendered as "We use it"); tests/tools.test.ts checks the shape.
// `by` credits an author when the tool is a person's project. Every URL was checked alive on 2026-10-03.
export const categories = [
	{ id: 'finding-work', title: 'Finding work' },
	{ id: 'health', title: 'Repository health and stats' },
	{ id: 'licensing', title: 'Licensing' },
	{ id: 'security', title: 'Security' },
	{ id: 'releases', title: 'Releases' },
	{ id: 'community', title: 'Community' },
	{ id: 'funding', title: 'Funding' },
	{ id: 'docs', title: 'Docs and sites' },
	{ id: 'automation', title: 'Automation' },
	{ id: 'social', title: 'Social' },
	{ id: 'local-ai', title: 'Local AI' },
];

const OR = 'Open {re}Source';
const BS = 'Bootstrap';

export const tools = [
	// Finding work
	{
		name: 'goodfirstissue.dev',
		url: 'https://goodfirstissue.dev',
		category: 'finding-work',
		description: 'Good first issues from popular repositories, filtered by language and topic.',
	},
	{
		name: 'Up For Grabs',
		url: 'https://up-for-grabs.net',
		category: 'finding-work',
		description: 'Projects that tag issues for newcomers, each with the label to search for.',
	},
	{
		name: 'CodeTriage',
		url: 'https://www.codetriage.com',
		category: 'finding-work',
		description: 'Subscribe to a repository and get open issues by email to triage or fix.',
	},
	{
		name: 'OSS Insight',
		url: 'https://ossinsight.io',
		category: 'finding-work',
		description: 'Trends, rankings and contributor analytics for GitHub repositories, built on GH Archive.',
	},
	{
		name: 'ecosyste.ms',
		url: 'https://ecosyste.ms',
		category: 'finding-work',
		description:
			'Open datasets and tools on packages, repositories and funding, to find critical projects that need help.',
	},

	// Repository health and stats
	{
		name: 'OpenSSF Scorecard',
		url: 'https://scorecard.dev',
		category: 'health',
		description: 'Automated checks on the security practices of a repository, scored from 0 to 10.',
		usedBy: [BS],
	},
	{
		name: 'Repobeats',
		url: 'https://repobeats.axiom.co',
		category: 'health',
		description: 'An image of a repository’s recent activity to embed in its README.',
		article: 'repobeats',
	},
	{
		name: 'contrib.rocks',
		url: 'https://contrib.rocks',
		category: 'health',
		description: 'An image of a repository’s top contributors to embed in its README.',
		article: 'contrib-rocks',
	},
	{
		name: 'Star History',
		url: 'https://www.star-history.com',
		category: 'health',
		description: 'Star growth charts for one or several repositories, as an image or an embed.',
	},
	{
		name: 'deps.dev',
		url: 'https://deps.dev',
		category: 'health',
		description: 'Google’s view of a package: versions, dependency graph, advisories, licenses and Scorecard results.',
	},
	{
		name: 'Libraries.io',
		url: 'https://libraries.io',
		category: 'health',
		description: 'Search packages across ecosystems and see who depends on them.',
	},

	// Licensing
	{
		name: 'Choose a License',
		url: 'https://choosealicense.com',
		category: 'licensing',
		description: 'GitHub’s plain-language guide to picking a license, with a summary of each common one.',
	},
	{
		name: 'SPDX License List',
		url: 'https://spdx.org/licenses/',
		category: 'licensing',
		description: 'The standard identifiers to use in `LICENSE` metadata, with the full text of each license.',
	},
	{
		name: 'REUSE',
		url: 'https://reuse.software',
		category: 'licensing',
		description: 'A specification and a lint tool (`reuse lint`) to declare the license and copyright of every file.',
	},
	{
		name: 'licensee',
		url: 'https://github.com/licensee/licensee',
		category: 'licensing',
		description: 'The Ruby library GitHub uses to detect which license a repository has.',
	},
	{
		name: 'license-checker-rseidelsohn',
		url: 'https://github.com/RSeidelsohn/license-checker-rseidelsohn',
		category: 'licensing',
		description:
			'Lists the licenses of every npm dependency. The maintained fork of `license-checker`, whose last commit dates from January 2024.',
	},
	{
		name: 'FOSSA',
		url: 'https://fossa.com',
		category: 'licensing',
		description: 'Commercial license compliance and dependency scanning.',
	},
	{
		name: 'ScanCode Toolkit',
		url: 'https://github.com/aboutcode-org/scancode-toolkit',
		category: 'licensing',
		description: 'Scans source code for licenses, copyrights and dependencies, offline.',
	},
	{
		name: 'OSS Review Toolkit',
		url: 'https://github.com/oss-review-toolkit/ort',
		category: 'licensing',
		description: 'Analyzes dependencies, scans them and produces a compliance report and an SBOM.',
	},

	// Security
	{
		name: 'Dependabot',
		url: 'https://docs.github.com/en/code-security/dependabot',
		category: 'security',
		description: 'GitHub’s alerts and automatic update PRs for vulnerable or outdated dependencies.',
		usedBy: [OR, BS],
	},
	{
		name: 'Renovate',
		url: 'https://docs.renovatebot.com',
		category: 'security',
		description: 'Dependency update PRs with grouping, schedules and presets, on GitHub, GitLab and others.',
	},
	{
		name: 'CodeQL',
		url: 'https://github.com/github/codeql-action',
		category: 'security',
		description: 'GitHub’s code scanning: finds vulnerabilities by querying your code as data.',
		usedBy: [BS],
	},
	{
		name: 'Socket',
		url: 'https://socket.dev',
		category: 'security',
		description:
			'Flags risky behavior in the packages you add (install scripts, network access, typosquats) before you merge.',
	},
	{
		name: 'OSV-Scanner',
		url: 'https://github.com/google/osv-scanner',
		category: 'security',
		description: 'Matches your lockfiles against the OSV vulnerability database.',
	},
	{
		name: 'Syft',
		url: 'https://github.com/anchore/syft',
		category: 'security',
		description: 'Generates an SBOM from a directory, a container image or an archive.',
	},
	{
		name: 'Grype',
		url: 'https://github.com/anchore/grype',
		category: 'security',
		description: 'Scans an image, a directory or an SBOM for known vulnerabilities. Pairs with Syft.',
	},
	{
		name: 'StepSecurity Harden-Runner',
		url: 'https://github.com/step-security/harden-runner',
		category: 'security',
		description: 'Restricts and audits the network calls of a GitHub Actions runner.',
	},
	{
		name: 'Gitleaks',
		url: 'https://github.com/gitleaks/gitleaks',
		category: 'security',
		description: 'Finds secrets in a repository and its history, as a CLI or a pre-commit hook.',
	},

	// Releases
	{
		name: 'release-please',
		url: 'https://github.com/googleapis/release-please',
		category: 'releases',
		description: 'Opens a release PR from your Conventional Commits, then tags and publishes on merge.',
	},
	{
		name: 'Changesets',
		url: 'https://github.com/changesets/changesets',
		category: 'releases',
		description:
			'Contributors add a small file per change; the release bumps versions and writes the changelog. Built for monorepos.',
	},
	{
		name: 'semantic-release',
		url: 'https://github.com/semantic-release/semantic-release',
		category: 'releases',
		description: 'Fully automated versioning and publishing, driven by commit messages.',
	},
	{
		name: 'Keep a Changelog',
		url: 'https://keepachangelog.com',
		category: 'releases',
		description: 'A format for human-written changelogs: one section per version, grouped by kind of change.',
	},
	{
		name: 'GitHub generated release notes',
		url: 'https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes',
		category: 'releases',
		description: 'Release notes built from merged PRs, grouped by label with a `.github/release.yml` file.',
		usedBy: [BS],
	},

	// Community
	{
		name: 'All Contributors',
		url: 'https://allcontributors.org',
		category: 'community',
		description: 'A bot and a spec to credit every kind of contribution in your README, not only code.',
	},
	{
		name: 'Contributor Covenant',
		url: 'https://www.contributor-covenant.org',
		category: 'community',
		description: 'The most adopted code of conduct, with translations.',
		usedBy: [OR, BS],
	},
	{
		name: 'Discourse',
		url: 'https://www.discourse.org',
		category: 'community',
		description: 'Forum software, open source and self-hostable, for long conversations and support.',
	},
	{
		name: 'Zulip',
		url: 'https://zulip.com',
		category: 'community',
		description: 'Open source chat organized in topics, so threads stay readable.',
	},
	{
		name: 'giscus',
		url: 'https://giscus.app',
		category: 'community',
		description: 'Comments for your site, stored in GitHub Discussions.',
	},
	{
		name: 'Better GitHub Co-Authors',
		url: 'https://github.com/delucis/better-github-coauthors',
		by: { name: 'Chris Swithinbank', url: 'https://github.com/delucis/' },
		category: 'community',
		description:
			'Browser extension that adds an "Add co-authors" button to the PR merge UI, collecting every participant as a "Co-authored-by" trailer. It credits reviewers and commenters, not only code contributors.',
	},

	// Funding
	{
		name: 'GitHub Sponsors',
		url: 'https://github.com/sponsors',
		category: 'funding',
		description: 'Recurring and one-time sponsorships.',
		usedBy: [OR],
	},
	{
		name: 'Open Collective',
		url: 'https://opencollective.com',
		category: 'funding',
		description: 'Transparent funding for a project or a group, with a public ledger and a fiscal host.',
		usedBy: [BS],
	},
	{
		name: 'Polar',
		url: 'https://polar.sh',
		category: 'funding',
		description: 'Sponsorships, funded issues and paid benefits for maintainers.',
	},
	{
		name: 'thanks.dev',
		url: 'https://thanks.dev',
		category: 'funding',
		description: 'Splits a monthly amount across the open source dependencies your projects use.',
	},
	{
		name: 'SponsorKit',
		url: 'https://github.com/antfu-collective/sponsorkit',
		category: 'funding',
		description: 'Generates an image of your sponsors from several platforms, for a README.',
		article: 'display-your-sponsors-in-your-github-readmes',
	},
	{
		name: '`FUNDING.yml`',
		url: 'https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/displaying-a-sponsor-button-in-your-repository',
		category: 'funding',
		description: 'The file that adds a Sponsor button to your repository and points to your funding pages.',
		usedBy: [OR],
	},

	// Docs and sites
	{
		name: 'Starlight',
		url: 'https://starlight.astro.build',
		category: 'docs',
		description: 'Documentation theme for Astro, with navigation, search and i18n built in.',
	},
	{
		name: 'Docusaurus',
		url: 'https://docusaurus.io',
		category: 'docs',
		description: 'Meta’s React-based docs framework, with versioning and a blog.',
	},
	{
		name: 'VitePress',
		url: 'https://vitepress.dev',
		category: 'docs',
		description: 'Vue-powered static site generator for docs, from Markdown.',
	},
	{
		name: 'MkDocs',
		url: 'https://www.mkdocs.org',
		category: 'docs',
		description:
			'Python static site generator for docs. The core project’s last commit dates from October 2025; Material for MkDocs is the usual theme.',
	},
	{
		name: 'Pagefind',
		url: 'https://pagefind.app',
		category: 'docs',
		description: 'Static search that runs on the built site, with no server.',
		usedBy: [OR, BS],
	},
	{
		name: 'DocSearch',
		url: 'https://docsearch.algolia.com',
		category: 'docs',
		description: 'Algolia’s free search for open source documentation sites.',
	},
	{
		name: 'lychee',
		url: 'https://lychee.cli.rs',
		category: 'docs',
		description: 'Fast link checker for Markdown and HTML, with a GitHub Action.',
		usedBy: [OR],
	},
	{
		name: 'cspell',
		url: 'https://cspell.org',
		category: 'docs',
		description: 'Spell checker for code and docs, with a project dictionary for names and terms.',
		usedBy: [OR, BS],
	},

	// Automation
	{
		name: 'actions/stale',
		url: 'https://github.com/actions/stale',
		category: 'automation',
		description: 'Marks inactive issues and PRs as stale, then closes them.',
		usedBy: [BS],
	},
	{
		name: 'actions/labeler',
		url: 'https://github.com/actions/labeler',
		category: 'automation',
		description: 'Labels PRs from the paths they touch.',
	},
	{
		name: 'actions/first-interaction',
		url: 'https://github.com/actions/first-interaction',
		category: 'automation',
		description: 'Posts a welcome message on a contributor’s first issue or PR.',
	},
	{
		name: 'Probot',
		url: 'https://probot.github.io',
		category: 'automation',
		description: 'Framework for building GitHub Apps in Node.js.',
	},
	{
		name: 'GitHub CLI',
		url: 'https://cli.github.com',
		category: 'automation',
		description: 'GitHub from the terminal: PRs, issues, releases and the API (`gh`).',
	},
	{
		name: 'Todoctor',
		url: 'https://github.com/azat-io/todoctor',
		by: { name: 'Azat S.', url: 'https://github.com/azat-io' },
		category: 'automation',
		description:
			'Tracks `TODO` comments in JavaScript and TypeScript repositories and charts them by type, with a table of every occurrence.',
	},

	// Social
	{
		name: 'Slidev',
		url: 'https://sli.dev',
		category: 'social',
		description: 'Slides from Markdown, for developers. Exports to PDF, which is how we make LinkedIn carousels.',
		usedBy: [OR],
		article: 'coding-linkedin-carousels',
	},
	{
		name: 'Bluesky starter packs',
		url: 'https://bsky.social/about/blog/06-26-2024-starter-packs',
		category: 'social',
		description: 'Lists of accounts that a newcomer follows in one click, a way to gather a community.',
		article: 'bluesky-starter-pack',
	},
	{
		name: 'OpenGraph.xyz',
		url: 'https://www.opengraph.xyz',
		category: 'social',
		description: 'Previews how a link looks when shared on social networks, and checks its meta tags.',
	},
	{
		name: 'Shields.io',
		url: 'https://shields.io',
		category: 'social',
		description: 'Badges for READMEs: build status, version, downloads, sponsors.',
		usedBy: [OR, BS],
	},

	// Local AI
	{
		name: 'Ollama',
		url: 'https://ollama.com',
		category: 'local-ai',
		description: 'Runs open models on your machine with one command.',
		article: 'running-a-local-ai-inside-obsidian-with-ollama',
	},
	{
		name: 'Obsidian',
		url: 'https://obsidian.md',
		category: 'local-ai',
		description: 'Local Markdown notes with plugins, one of which talks to Ollama.',
		article: 'running-a-local-ai-inside-obsidian-with-ollama',
	},
];

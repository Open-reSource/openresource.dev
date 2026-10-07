// The glossary: one entry per term the guide uses. The glossary page (src/components/Glossary.astro) reads it, and so will
// the `<Term>` component, so a definition is written once.
//
// - `id`: the anchor on /guide/glossary/ (`#copyleft`), lowercase kebab-case.
// - `term`: how the term is written on the page.
// - `definition`: one to three sentences, with an example when one helps.
// - `href`: the guide page that explains it, `/guide/<module>/<chapter>`, with a `#section` when one fits.
// - `aliases`: other spellings a chapter may use for the same term.
//
// Entries are written in any order and sorted by `term` in `glossary`.
const entries = [
	{
		id: 'agpl',
		term: 'AGPL',
		definition:
			'The GNU Affero General Public License: the GPL plus one rule, that users who talk to the program over a network can ask for its source. It closes the gap that lets a company run modified GPL code as a service and share nothing.',
		href: '/guide/licensing/license-compatibility#the-saas-gap-agpl-then-sspl',
		aliases: ['AGPL-3.0'],
	},
	{
		id: 'bounty',
		term: 'Bounty',
		definition:
			'A payment promised for one defined piece of work. A bug bounty pays for a valid vulnerability report; an issue bounty pays whoever fixes a given issue.',
		href: '/guide/maintaining/security-for-maintainers',
		aliases: ['bug bounty', 'bounties'],
	},
	{
		id: 'breaking-change',
		term: 'Breaking change',
		definition:
			'A change after which code that worked with the previous version stops working: a removed function, a renamed option, a new default. Under semantic versioning it needs a new major version.',
		href: '/guide/maintaining/managing-project-dependencies#dependencies-versioning',
		aliases: ['breaking changes'],
	},
	{
		id: 'burnout',
		term: 'Burnout',
		definition:
			'The exhaustion of someone who maintains a project for too long without enough help or thanks. In maintainers it often shows as dread of opening the issue tracker, not as tiredness.',
		href: '/guide/maintaining/burnout-succession-and-the-end#burnout-looks-like-dread-not-tiredness',
	},
	{
		id: 'bus-factor',
		term: 'Bus factor',
		definition:
			'The number of people who would have to disappear, hit by a bus or just gone quiet, before a project stalls. A project with one person holding the release keys has a bus factor of one.',
		href: '/guide/maintaining/burnout-succession-and-the-end#your-bus-factor-is-a-number-you-can-read',
	},
	{
		id: 'bdfl',
		term: 'BDFL',
		definition:
			'Benevolent Dictator For Life: a governance model where one person has the final say. Python worked that way until Guido van Rossum stepped down in July 2018.',
		href: '/guide/maintaining/governance#every-project-has-a-model-written-or-not',
	},
	{
		id: 'changelog',
		term: 'Changelog',
		definition:
			'A file, usually `CHANGELOG.md`, that lists what changed in each version, written for the people upgrading rather than the people who wrote the code. It is where a breaking change gets announced.',
		href: '/guide/creating/repository-files#a-changelog-is-written-for-the-people-upgrading',
	},
	{
		id: 'ci',
		term: 'CI',
		definition:
			'Continuous integration: a server builds the project and runs its tests on every push and pull request. A red check on your pull request is CI telling you what to fix.',
		href: '/guide/contributing/contributing-to-open-source#a-red-check-is-a-to-do-list-not-a-verdict',
		aliases: ['continuous integration'],
	},
	{
		id: 'cla',
		term: 'CLA',
		definition:
			'Contributor License Agreement: a contract in which a contributor grants the project owner a license to their contributions, often a wider one than the project license. The owner can then relicense the code, which is the point and the risk.',
		href: '/guide/licensing/cla-vs-dco#a-cla-is-a-license-to-the-owner-often-a-wider-one',
		aliases: ['CLAs', 'Contributor License Agreement'],
	},
	{
		id: 'cc0',
		term: 'CC0',
		definition:
			'A Creative Commons tool that waives every right the author can waive, as close to the public domain as the law of the country allows. Use it for data or text that anyone may reuse with no condition, not even credit.',
		href: '/guide/licensing/non-code-licenses#data-odbl-cc-by-or-cc0',
		aliases: ['CC0-1.0'],
	},
	{
		id: 'code-of-conduct',
		term: 'Code of conduct',
		definition:
			'A file that says how people behave in the project, what happens when they don’t, and whom to write to. It protects contributors first, and it only works if someone answers the mail.',
		href: '/guide/creating/repository-files#a-code-of-conduct-names-who-to-write-to',
		aliases: ['CoC', 'CODE_OF_CONDUCT.md'],
	},
	{
		id: 'codeowners',
		term: 'CODEOWNERS',
		definition:
			'A file that maps paths to the people or teams who review them. GitHub then requests their review automatically on any pull request that touches those paths.',
		href: '/guide/creating/repository-files',
	},
	{
		id: 'committer',
		term: 'Committer',
		definition:
			'Someone who can write to the project’s main branch, a role named in Apache and PostgreSQL. A project with 31 committers has 31 people who can merge.',
		href: '/guide/maintaining/governance#a-contributor-ladder-turns-how-do-i-become-a-maintainer-into-a-list',
		aliases: ['committers'],
	},
	{
		id: 'community-health-files',
		term: 'Community health files',
		definition:
			'The files GitHub looks for to treat a project as welcoming to strangers: README, LICENSE, code of conduct, contributing guide, security policy, issue forms. A `.github` repository can hold defaults for every repository of an account.',
		href: '/guide/creating/repository-files#one-github-repository-sets-the-defaults-for-all-the-others',
		aliases: ['health files'],
	},
	{
		id: 'contributor-covenant',
		term: 'Contributor Covenant',
		definition:
			'The most widely copied code of conduct template, written by Coraline Ada Ehmke in 2014. You paste it, add a contact address and enforcement steps, and it is yours.',
		href: '/guide/creating/repository-files#a-code-of-conduct-names-who-to-write-to',
	},
	{
		id: 'contributor-ladder',
		term: 'Contributor ladder',
		definition:
			'A written list of the roles in a project, from contributor to maintainer, with what each role may do and what it takes to reach the next one. It answers “how do I become a maintainer?” before anyone has to ask.',
		href: '/guide/maintaining/governance#a-contributor-ladder-turns-how-do-i-become-a-maintainer-into-a-list',
	},
	{
		id: 'copyleft',
		term: 'Copyleft',
		definition:
			'A license condition: if you distribute a modified version, you must share it under the same terms. Strong copyleft (GPL) reaches the whole combined work, weak copyleft (LGPL, MPL-2.0) only the library or the files you changed.',
		href: '/guide/licensing/choosing-a-license#copyleft-follows-the-code-not-the-project',
		aliases: ['weak copyleft', 'strong copyleft'],
	},
	{
		id: 'cra',
		term: 'CRA',
		definition:
			'The EU Cyber Resilience Act: a regulation that sets security and vulnerability-handling duties for products with digital elements sold in the EU. It entered into force on 10 December 2024, with the duties phasing in until December 2027, and treats open-source stewards more lightly than manufacturers.',
		href: '/guide/maintaining/security-for-maintainers#the-eu-cyber-resilience-act-briefly',
		aliases: ['Cyber Resilience Act'],
	},
	{
		id: 'creative-commons',
		term: 'Creative Commons',
		definition:
			'A family of licenses for content that is not code: text, images, music, data. CC BY lets anyone reuse your work if they credit you; the NC and ND variants restrict use and are not open licenses.',
		href: '/guide/licensing/non-code-licenses#six-creative-commons-licenses-and-two-of-them-are-open',
		aliases: ['CC BY', 'CC-BY-4.0'],
	},
	{
		id: 'cve',
		term: 'CVE',
		definition:
			'Common Vulnerabilities and Exposures: a public identifier for one vulnerability, such as CVE-2024-3094 for the xz backdoor. A CVE gives scanners and users the same name to search for.',
		href: '/guide/maintaining/security-for-maintainers#one-advisory-gets-you-a-cve-and-alerts-every-user',
		aliases: ['CVEs'],
	},
	{
		id: 'dependabot',
		term: 'Dependabot',
		definition:
			'GitHub’s bot that opens pull requests to update your dependencies and to fix the ones with a security advisory. Renovate does the same job with more settings.',
		href: '/guide/maintaining/managing-project-dependencies#updating-dependencies-safely',
	},
	{
		id: 'dco',
		term: 'DCO',
		definition:
			'Developer Certificate of Origin: a contributor states, with a `Signed-off-by` line in each commit, that they have the right to submit the code under the project license. The Linux kernel has used it since 2004, and it costs a contributor one flag.',
		href: '/guide/licensing/cla-vs-dco#a-dco-is-one-line-you-may-contribute-this-code',
		aliases: ['Developer Certificate of Origin'],
	},
	{
		id: 'dependency',
		term: 'Dependency',
		definition:
			'A package your project needs in order to build or run. A direct dependency is the one you list in your manifest; a transitive one is pulled in by your dependencies, and you still ship it.',
		href: '/guide/maintaining/managing-project-dependencies#understanding-project-dependencies',
		aliases: ['dependencies', 'direct dependency', 'transitive dependency', 'transitive dependencies'],
	},
	{
		id: 'deprecation',
		term: 'Deprecation',
		definition:
			'Marking a feature as scheduled for removal while it still works. A good one names the replacement and the version that removes the old feature.',
		href: '/guide/maintaining/burnout-succession-and-the-end',
		aliases: ['deprecated'],
	},
	{
		id: 'dual-licensing',
		term: 'Dual licensing',
		definition:
			'Offering the same code under two licenses: a copyleft one for everyone and a paid commercial one for companies that cannot comply with it. It only works for an owner who holds every contributor’s rights, usually through a CLA.',
		href: '/guide/licensing/cla-vs-dco',
		aliases: ['dual license'],
	},
	{
		id: 'fiscal-host',
		term: 'Fiscal host',
		definition:
			'An organization that holds a project’s money and handles its taxes and contracts, so the project does not have to incorporate. Software Freedom Conservancy and Open Collective’s hosts are examples.',
		href: '/guide/maintaining/governance#join-a-foundation-when-others-depend-on-you',
		aliases: ['fiscal sponsor', 'fiscal and legal hosting'],
	},
	{
		id: 'foundation',
		term: 'Foundation',
		definition:
			'A non-profit that holds a project’s trademark, money or infrastructure so that no single company owns it. The Apache Software Foundation, the Linux Foundation and the CNCF, which hosts Kubernetes, are three.',
		href: '/guide/maintaining/governance#join-a-foundation-when-others-depend-on-you',
		aliases: ['foundations'],
	},
	{
		id: 'fork',
		term: 'Fork',
		definition:
			'A copy of a repository. It is the personal copy you push branches to before a pull request, a long-lived variant that tracks the original and adds patches, or a hard fork that goes its own way under a new name, as OpenTofu did from Terraform in 2023.',
		href: '/guide/getting-started/git-and-github-basics#three-copies-and-you-write-to-two-of-them',
		aliases: ['forks', 'forked', 'hard fork'],
	},
	{
		id: 'free-software',
		term: 'Free software',
		definition:
			'Software that gives its users four freedoms: to run it, study and change it, share it and share the changed version. It is the Free Software Foundation’s term and mostly describes the same licenses as open source, with an ethical argument instead of a practical one.',
		href: '/guide/what-is-open-source/brief-history-of-open-source',
		aliases: ['free software'],
	},
	{
		id: 'fsf',
		term: 'FSF',
		definition:
			'The Free Software Foundation, founded in 1985 by Richard Stallman. It wrote the GNU General Public License and keeps the definition of free software.',
		href: '/guide/what-is-open-source/brief-history-of-open-source',
		aliases: ['Free Software Foundation'],
	},
	{
		id: 'ghsa',
		term: 'Security advisory (GHSA)',
		definition:
			'GitHub’s record of a vulnerability, identified as `GHSA-xxxx-xxxx-xxxx`: affected versions, patched versions, severity, credits. A maintainer drafts it privately in the repository, and GitHub can request a CVE for it.',
		href: '/guide/maintaining/security-for-maintainers#one-advisory-gets-you-a-cve-and-alerts-every-user',
		aliases: ['GHSA', 'security advisory', 'repository security advisory', 'security advisories'],
	},
	{
		id: 'github-actions',
		term: 'GitHub Actions',
		definition:
			'GitHub’s built-in CI/CD service: workflows written in YAML under `.github/workflows/` run on pushes, pull requests or a schedule. It is free on public repositories with the standard runners.',
		href: '/guide/getting-started/source-code-hosting-platforms',
		aliases: ['Actions'],
	},
	{
		id: 'good-first-issue',
		term: 'Good first issue',
		definition:
			'A label that maintainers put on issues a newcomer can take without knowing the whole codebase. GitHub lists them on each repository’s Contribute page and in search.',
		href: '/guide/contributing/finding-open-source-projects',
		aliases: ['good first issues'],
	},
	{
		id: 'governance',
		term: 'Governance',
		definition:
			'Who decides what in a project, and how: who can merge, who can add a maintainer, what happens when two of them disagree. Every project has a model; the useful ones write it down in `GOVERNANCE.md`.',
		href: '/guide/maintaining/governance#every-project-has-a-model-written-or-not',
	},
	{
		id: 'grant',
		term: 'Grant',
		definition:
			'A one-off sum from an institution for defined work, such as a security audit or a rewrite. The Sovereign Tech Agency and NLnet fund open-source work this way.',
		href: '/guide/financing/understanding-funding-models#grants',
		aliases: ['grants'],
	},
	{
		id: 'hacktoberfest',
		term: 'Hacktoberfest',
		definition:
			'A month-long event in October, run by DigitalOcean, that encourages first pull requests to open-source projects. Maintainers opt in by adding a topic to their repository.',
		href: '/guide/contributing/finding-open-source-projects#events-put-a-date-on-it',
	},
	{
		id: 'help-wanted',
		term: 'Help wanted',
		definition:
			'A label meaning the maintainers would welcome an outside contributor on this issue. It does not mean the issue is easy: that is what `good first issue` is for.',
		href: '/guide/contributing/finding-open-source-projects',
	},
	{
		id: 'gsoc',
		term: 'Google Summer of Code',
		definition:
			'A Google-funded program, running since 2005, that pays contributors a stipend to work on an open-source project over the summer with a mentor. Organizations apply, publish project ideas, and choose their contributors.',
		href: '/guide/contributing/finding-open-source-projects#events-put-a-date-on-it',
		aliases: ['GSoC'],
	},
	{
		id: 'inbound-outbound',
		term: 'Inbound = outbound',
		definition:
			'The rule that contributions come in under the same license the project goes out under. Without a CLA or a DCO it is the default: a contributor who opens a pull request to an MIT project licenses the code as MIT.',
		href: '/guide/licensing/license-compatibility#inbound-outbound-and-the-rule-between-them',
		aliases: ['inbound', 'outbound'],
	},
	{
		id: 'issue',
		term: 'Issue',
		definition:
			'A tracked item in a repository: a bug report, a feature request or a question, with a discussion thread under it. Search closed issues before you open one.',
		href: '/guide/contributing/writing-a-bug-report',
		aliases: ['issues'],
	},
	{
		id: 'lazy-consensus',
		term: 'Lazy consensus',
		definition:
			'A way to decide without a meeting: someone proposes a change, and if nobody objects within a stated time, it is approved. Silence counts as yes, so the time to object has to be long enough for people to see it.',
		href: '/guide/maintaining/governance#votes-vetoes-and-lazy-consensus',
	},
	{
		id: 'license-compatibility',
		term: 'License compatibility',
		definition:
			'Whether code under one license can be combined with code under another in one work and still satisfy both. Apache-2.0 code can go into a GPL-3.0 project, but not into one that is GPL-2.0-only.',
		href: '/guide/licensing/license-compatibility',
		aliases: ['compatible', 'compatibility'],
	},
	{
		id: 'lockfile',
		term: 'Lockfile',
		definition:
			'A file that records the exact version of every dependency your last install resolved, such as `package-lock.json` or `Cargo.lock`. Commit it for an application, so every build uses the same versions.',
		href: '/guide/maintaining/managing-project-dependencies#pinning-or-locking-dependencies',
		aliases: ['lockfiles', 'lock file'],
	},
	{
		id: 'maintainer',
		term: 'Maintainer',
		definition:
			'A person who can merge changes and who answers for the project: triaging issues, reviewing pull requests, publishing releases. Being a maintainer is a role, not a skill level.',
		href: '/guide/maintaining/introduction-to-open-source-project-maintenance',
		aliases: ['maintainers'],
	},
	{
		id: 'nit',
		term: 'Nit',
		definition:
			'A review comment about something small the author can fix or ignore, usually style, prefixed with `nit:`. Labelling it tells the author it does not block the merge.',
		href: '/guide/maintaining/reviewing-pull-requests#label-every-comment',
		aliases: ['nits'],
	},
	{
		id: 'open-core',
		term: 'Open core',
		definition:
			'A business model with an open-source core and paid proprietary extras. GitLab’s Community Edition and Enterprise Edition are the standard example.',
		href: '/guide/getting-started/source-code-hosting-platforms',
	},
	{
		id: 'open-weights',
		term: 'Open weights',
		definition:
			'A model released with its trained weights for anyone to download, but not always with its training data, its training code or a license that allows every use. “Open weights” says what you can download, not what you may do with it.',
		href: '/guide/licensing/non-code-licenses#models-openly-licensed-weights-arent-the-whole-model',
		aliases: ['open-weight'],
	},
	{
		id: 'osd',
		term: 'Open Source Definition',
		definition:
			'The ten criteria an OSI-approved license must meet, among them free redistribution, source code access and no discrimination against fields of endeavor. A license that forbids commercial use fails the last one.',
		href: '/guide/licensing/choosing-a-license#no-license-means-no-permission',
		aliases: ['OSD'],
	},
	{
		id: 'osi',
		term: 'OSI',
		definition:
			'The Open Source Initiative, a non-profit founded in February 1998. It maintains the Open Source Definition and decides which licenses it approves.',
		href: '/guide/what-is-open-source/brief-history-of-open-source',
		aliases: ['Open Source Initiative'],
	},
	{
		id: 'outreachy',
		term: 'Outreachy',
		definition:
			'Paid, remote internships on open-source projects for people who are underrepresented in tech, run by the Software Freedom Conservancy. Mentors and projects apply, and interns apply to them.',
		href: '/guide/contributing/finding-open-source-projects#events-put-a-date-on-it',
	},
	{
		id: 'permissive',
		term: 'Permissive license',
		definition:
			'A license that lets anyone do almost anything with the code, closed products included, as long as they keep the notice. MIT, BSD and Apache-2.0 are the common ones.',
		href: '/guide/licensing/choosing-a-license#four-questions-pick-the-license',
		aliases: ['permissive'],
	},
	{
		id: 'pull-request',
		term: 'Pull request',
		definition:
			'A proposal to merge one branch into another, with a diff, a discussion and the checks. GitLab calls it a merge request, and sourcehut replaces it with patches sent by email.',
		href: '/guide/contributing/contributing-to-open-source#push-then-fill-in-every-section-of-the-pull-request-template',
		aliases: ['pull requests', 'PR', 'PRs', 'merge request', 'merge requests'],
	},
	{
		id: 'readme',
		term: 'README',
		definition:
			'The file shown on a repository’s front page, and the one most visitors read before anything else. It should say what the project is, how to install it and where to get help on the first screen.',
		href: '/guide/creating/repository-files#the-readme-sells-the-project-on-one-screen',
		aliases: ['README.md'],
	},
	{
		id: 'rebase',
		term: 'Rebase',
		definition:
			'Replaying your commits on top of a newer base, so your branch looks as if you started from today’s main. After a rebase you push with `--force-with-lease`, because the commits have new hashes.',
		href: '/guide/getting-started/git-and-github-basics#after-a-rebase-push-with---force-with-lease-never-pull',
		aliases: ['rebased', 'rebasing'],
	},
	{
		id: 'review',
		term: 'Review',
		definition:
			'Reading a change before it merges, and approving it, asking for changes or commenting. A good review says what blocks the merge and what does not.',
		href: '/guide/maintaining/reviewing-pull-requests',
		aliases: ['code review'],
	},
	{
		id: 'rfc',
		term: 'RFC',
		definition:
			'Request for Comments: a written proposal for a significant change, discussed in public before anyone writes the code. Rust’s RFCs are a well-known example.',
		href: '/guide/maintaining/governance#decide-big-changes-in-writing',
		aliases: ['RFCs'],
	},
	{
		id: 'sbom',
		term: 'SBOM',
		definition:
			'A software bill of materials: the list of components a product contains, with their versions, licenses and hashes, in a machine-readable format such as SPDX or CycloneDX. `npm sbom` writes one from a lock file.',
		href: '/guide/at-work/license-compliance#an-sbom-is-the-inventory-in-a-format-someone-else-can-read',
		aliases: ['Software bill of materials', 'SBOMs'],
	},
	{
		id: 'scorecard',
		term: 'Scorecard',
		definition:
			'OpenSSF Scorecard: a tool that runs automated checks on a repository’s security practices, such as branch protection, pinned dependencies and a security policy, and gives each a score from 0 to 10.',
		href: '/guide/maintaining/security-for-maintainers#scorecard-run-it-read-the-top-three-findings',
		aliases: ['OpenSSF Scorecard'],
	},
	{
		id: 'sign-off',
		term: 'Sign-off',
		definition:
			'The `Signed-off-by: Name <email>` line at the end of a commit message, added with `git commit -s`. It is how a contributor accepts the DCO.',
		href: '/guide/licensing/cla-vs-dco#a-dco-is-one-line-you-may-contribute-this-code',
		aliases: ['signed off', 'Signed-off-by'],
	},
	{
		id: 'source-available',
		term: 'Source-available',
		definition:
			'Code you can read, with a license that restricts what you may do with it, such as running it as a service or competing with its maker. It is not open source: the Open Source Definition rules out those restrictions.',
		href: '/guide/licensing/relicensing#five-licenses-none-of-them-open-source',
		aliases: ['source available'],
	},
	{
		id: 'spdx',
		term: 'SPDX',
		definition:
			'The Software Package Data Exchange: among other things, a list of short license identifiers, such as `MIT` or `Apache-2.0`, that tools and manifests agree on. A file header `SPDX-License-Identifier: MIT` says the license in one line.',
		href: '/guide/licensing/choosing-a-license#apply-it-in-three-places',
		aliases: ['SPDX identifier'],
	},
	{
		id: 'squash',
		term: 'Squash',
		definition:
			'Combining several commits into one. “Squash and merge” turns a whole pull request into a single commit on main, which keeps the history short and hides the review back-and-forth.',
		href: '/guide/maintaining/reviewing-pull-requests#merge-so-that-the-history-tells-the-story',
		aliases: ['squash and merge', 'squashed'],
	},
	{
		id: 'sponsor',
		term: 'Sponsor',
		definition:
			'A person or company that pays a project on a recurring basis, through GitHub Sponsors, Open Collective or an invoice. Projects publish tiers, so a sponsor knows what a given amount buys.',
		href: '/guide/financing/understanding-funding-models#sponsorships',
		aliases: ['sponsors', 'sponsorship', 'sponsorships'],
	},
	{
		id: 'stale-bot',
		term: 'Stale bot',
		definition:
			'A bot that labels issues and pull requests with no activity after a set time and then closes them. Some projects use it to keep the tracker small; others find it closes real problems.',
		href: '/guide/getting-started/reading-a-repository',
		aliases: ['stale'],
	},
	{
		id: 'star',
		term: 'Star',
		definition:
			'A GitHub button that bookmarks a repository and adds one to its count. Stars measure attention, not maintenance: a project can have 50,000 and no one reading its issues.',
		href: '/guide/getting-started/reading-a-repository#stars-measure-attention-not-maintenance',
		aliases: ['stars'],
	},
	{
		id: 'steering-committee',
		term: 'Steering committee',
		definition:
			'A small group elected or appointed to set a project’s direction and settle disputes, often replacing a single leader. Kubernetes has one, and Python has a five-person steering council.',
		href: '/guide/maintaining/governance#every-project-has-a-model-written-or-not',
		aliases: ['steering council'],
	},
	{
		id: 'sublicense',
		term: 'Sublicense',
		definition:
			'To grant a license to others on rights you were licensed, not owned. A CLA that includes the right to sublicense lets the project owner change the license later.',
		href: '/guide/licensing/cla-vs-dco#the-right-to-sublicense-is-the-right-to-change-the-license',
		aliases: ['sublicensing'],
	},
	{
		id: 'supply-chain',
		term: 'Supply chain',
		definition:
			'Everything your software is built from and delivered through: dependencies, build tools, CI workflows, registries. A supply chain attack hides in one of them, as the xz backdoor did in March 2024.',
		href: '/guide/maintaining/security-for-maintainers#your-ci-is-part-of-your-release',
		aliases: ['supply chain attack', 'supply chain attacks'],
	},
	{
		id: 'tag',
		term: 'Tag',
		definition:
			'A fixed name for one commit, such as `v1.4.2`, used to mark a release. Unlike a branch, a tag does not move.',
		href: '/guide/getting-started/git-and-github-basics',
		aliases: ['tags'],
	},
	{
		id: 'trademark',
		term: 'Trademark',
		definition:
			'A legal right over a name or logo, separate from the copyright and license on the code. Anyone can fork your MIT code; nobody may call the fork by your name without your leave.',
		href: '/guide/licensing/trademarks#your-license-covers-the-code-not-the-name',
		aliases: ['trademarks'],
	},
	{
		id: 'triage',
		term: 'Triage',
		definition:
			'Sorting incoming issues and pull requests: labelling them, asking for a reproduction, closing duplicates, routing them to someone who can fix them. It is the contribution maintainers are shortest of.',
		href: '/guide/contributing/non-code-contributions',
		aliases: ['triaging', 'triaged'],
	},
	{
		id: 'upstream',
		term: 'Upstream and downstream',
		definition:
			'Upstream is the project you forked from or depend on, and downstream is whoever builds on you. A fix made in your fork should go upstream, and your `upstream` remote is where you fetch from.',
		href: '/guide/contributing/contributing-to-open-source',
		aliases: ['upstream', 'downstream'],
	},
	{
		id: 'core-team',
		term: 'Core team',
		definition:
			'The small group of maintainers who make a project’s main decisions and hold its keys. PostgreSQL’s core team has seven members.',
		href: '/guide/maintaining/introduction-to-open-source-project-maintenance#solo-core-team-or-community-three-different-jobs',
		aliases: ['core team'],
	},
	{
		id: 'codeberg',
		term: 'Codeberg',
		definition:
			'A non-profit code hosting platform run by Codeberg e.V. in Germany, built on Forgejo. Zig moved its repository there from GitHub in November 2025.',
		href: '/guide/getting-started/source-code-hosting-platforms#codeberg-is-a-non-profit-with-forgejo-underneath',
	},
	{
		id: 'forgejo',
		term: 'Forgejo',
		definition:
			'Free software for hosting repositories, issues and pull requests on your own server, forked from Gitea in 2022. Codeberg runs on it, and it is developed there.',
		href: '/guide/getting-started/source-code-hosting-platforms#codeberg-is-a-non-profit-with-forgejo-underneath',
	},
	{
		id: 'gpl',
		term: 'GPL',
		definition:
			'The GNU General Public License, the best-known strong copyleft license, written by the Free Software Foundation. Anyone who distributes a modified version must share its source under the GPL; version 3 came out in 2007.',
		href: '/guide/licensing/choosing-a-license#copyleft-follows-the-code-not-the-project',
		aliases: ['GPL-3.0', 'GPL-2.0', 'GNU General Public License'],
	},
	{
		id: 'open-collective',
		term: 'Open Collective',
		definition:
			'A platform that collects donations and sponsorships for a project and publishes every expense. A project either joins a fiscal host on it or holds its own account.',
		href: '/guide/financing/effective-fundraising-strategies',
	},
	{
		id: 'openssf',
		term: 'OpenSSF',
		definition:
			'The Open Source Security Foundation, a Linux Foundation project started in 2020. It publishes Scorecard, the best-practices badge and guides for maintainers.',
		href: '/guide/maintaining/security-for-maintainers',
		aliases: ['Open Source Security Foundation'],
	},
	{
		id: 'sspl',
		term: 'SSPL',
		definition:
			'The Server Side Public License, written by MongoDB in 2018: the GPL plus a rule that whoever offers the program as a service must release the source of the whole service. The OSI does not consider it open source.',
		href: '/guide/licensing/relicensing#five-licenses-none-of-them-open-source',
	},
];

/** The glossary, sorted by term, case and accents ignored. */
export const glossary = [...entries].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));

/** The letters that have at least one term, in order. */
export const letters = [...new Set(glossary.map(({ term }) => term[0].toUpperCase()))];

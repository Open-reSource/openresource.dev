// This script is based on the one from Astro:
// https://github.com/withastro/astro.build/blob/main/scripts/update-showcase.mjs#L48

import { graphql } from '@octokit/graphql';
import type { Repository } from '@octokit/graphql-schema';
import * as ghActions from '@actions/core';
import { nameToEmoji } from 'gemoji';
import { parseHTML } from 'linkedom';
import fs from 'node:fs/promises';
import path from 'node:path';
import gh from 'parse-github-url';

import type { Showcase, ShowcaseGitHubRepoLink } from '../../src/content.config';

const emojiRegex = /:(\+1|[-\w]+):/g;

const showcaseFileLocation = 'src/content/showcase';

export class ShowcaseScraper {
	/** A GraphQL client that uses our authorization token by default. */
	#query;
	/** The GitHub user or org to scrape. */
	#org;
	/** The name of the GitHub repo to scrape. */
	#repo;
	/** The number of the discussion to use as the data source. */
	#discussion;
	/** Array of origins that should never be added to the showcase. */
	#blocklist;

	constructor(org: string, repo: string, discussion: number, blockedOrigins: string[]) {
		if (!process.env.GITHUB_TOKEN) {
			throw new Error('GITHUB_TOKEN env variable must be set to run.');
		}

		this.#query = graphql.defaults({
			headers: {
				authorization: `token ${process.env.GITHUB_TOKEN}`,
			},
		});

		this.#org = org;
		this.#repo = repo;
		this.#discussion = discussion;
		this.#blocklist = new Set(blockedOrigins.map((url) => new URL(url).origin));
	}

	/**
	 * Run the showcase scraper, extract & filter links from the GitHub discussion, and add them to the repo.
	 */
	async run(): Promise<Showcase[]> {
		console.info(`Fetching comments from ${this.#org}/${this.#repo} discussion #${this.#discussion}...`);

		const comments = await this.#getDiscussionCommentsHTML();

		console.info('Extracting URLs...');

		const showcasesKeyedByAuthor = new Map<string, Showcase>();
		const knownLinks = new Set<string>();

		for (const comment of comments) {
			const hrefs = this.#filterHrefs(this.#extractHrefs(comment.html));

			if (hrefs.length > 0) {
				const links: Showcase['links'] = [];
				for (const href of hrefs) {
					const ghReference = gh(href);

					if (ghReference?.hostname === 'github.com' && ghReference?.owner && ghReference?.name) {
						console.info(`Adding repository data from ${href}...`);
						const { repository } = await this.#getRepository(ghReference.owner, ghReference.name);

						links.push({
							type: 'github_repo',
							avatarUrl: repository.owner.avatarUrl + '&s=50',
							contributors: repository.mentionableUsers.totalCount,
							description: repository.description ? this.#emojify(repository.description) : '',
							discussions: repository.discussions.totalCount,
							forks: repository.forkCount,
							issues: repository.issues.totalCount,
							languages: this.#getRepoLanguages(repository),
							name: repository.name,
							owner: repository.owner.login,
							prs: repository.pullRequests.totalCount,
							stars: repository.stargazerCount,
							url: this.#sanitizeUrl(repository.url),
						});
					} else if (ghReference?.hostname === 'github.com') {
						console.info(`Adding github link ${href}...`);
						links.push({
							type: 'github',
							url: this.#sanitizeUrl(href),
						});
					} else {
						console.info(`Adding ${href}...`);
						links.push({
							type: 'unknown',
							url: this.#sanitizeUrl(href),
						});
					}
				}

				const dedupedLinks = links.filter((link) => !knownLinks.has(link.url));

				if (dedupedLinks.length > 0) {
					for (const link of dedupedLinks) {
						knownLinks.add(link.url);
					}

					const existingLinks = showcasesKeyedByAuthor.get(comment.author)?.links ?? [];
					showcasesKeyedByAuthor.set(comment.author, {
						author: comment.author,
						links: [...existingLinks, ...dedupedLinks],
					});
				}
			}
		}

		const showcases = Array.from(showcasesKeyedByAuthor.values());

		await this.#saveDataFiles(showcases);

		this.setActionOutput(showcases);

		return showcases;
	}

	/**
	 * Sanitize a URL by removing any query parameters or hashes.
	 */
	#sanitizeUrl(url: string) {
		const parsedUrl = new URL(url);

		return `${parsedUrl.protocol}//${parsedUrl.hostname}${parsedUrl.pathname}`;
	}

	/**
	 * Execute a GraphQL query to fetch discussion comments from the GitHub API.
	 */
	#getDiscussionComments({ first = 100, after = 'null' } = {}) {
		return this.#query<{ repository: Repository }>(`query {
    repository(owner: "${this.#org}", name: "${this.#repo}") {
      discussion(number: ${this.#discussion}) {
        bodyHTML
        comments(first: ${first}, after: ${after || 'null'}) {
          pageInfo {
            endCursor
            hasNextPage
          }
          nodes {
            author {
              login
            }
            bodyHTML
          }
         }
       }
     }
   }`);
	}

	/**
	 * Execute a GraphQL query to fetch repository data from the GitHub API.
	 */
	#getRepository(owner: string, name: string) {
		return this.#query<{ repository: Repository }>(`
      query {
        repository(owner: "${owner}", name: "${name}") {
          description
          discussions(states: OPEN) {
            totalCount
          }
          forkCount
          issues(states: OPEN) {
            totalCount
          }
          languages (first:10, orderBy: { direction: DESC, field: SIZE }) {
            edges {
              size
              node {
                color
                name
              }
            }
          }
          mentionableUsers {
            totalCount
          }
          name
          owner {
            avatarUrl
            login
          }
          pullRequests(states: OPEN) {
            totalCount
          }
          stargazerCount
          url
        }
    }`);
	}

	/**
	 * Get an array of the HTML of all comments in a specific GitHub Discussion
	 */
	async #getDiscussionCommentsHTML() {
		const allCommentsHTML: { author: string; html: string }[] = [];

		let hasNextPage = true;
		let after = '';
		while (hasNextPage) {
			const { repository } = await this.#getDiscussionComments({ after });

			if (!repository.discussion) {
				break;
			}

			const { comments } = repository.discussion;

			comments.nodes?.forEach((node) => {
				if (!node?.author || !node?.bodyHTML) {
					return;
				}

				allCommentsHTML.push({
					author: node.author.login,
					html: node.bodyHTML,
				});
			});

			const endCursor = comments.pageInfo.endCursor;
			const hasEndCursor = !!endCursor;
			hasNextPage = comments.pageInfo.hasNextPage && hasEndCursor;

			if (hasNextPage && hasEndCursor) {
				after = endCursor;
			}
		}
		return allCommentsHTML;
	}

	/**
	 * @param html HTML to parse and extract links from
	 * @returns Array of URLs found in link `href` attributes.
	 */
	#extractHrefs(html: string): string[] {
		const { document } = parseHTML(html);
		const links = document.querySelectorAll('a');
		const hrefs = [...links].map((link) => link.href).filter((href) => Boolean(href));
		return [...new Set(hrefs)];
	}

	/**
	 * Filter out URLs we already added or that are excluded by the list of blocked origins.
	 * @param hrefs Array of URLs as returned by `#extractHrefs`.
	 */
	#filterHrefs(hrefs: string[]): string[] {
		return hrefs.filter((href) => {
			const { origin } = new URL(href);
			return !this.#blocklist.has(origin);
		});
	}

	/**
	 * Clear the existing content collection and create JSON files for each showcase entry.
	 * @param showcases Content of the showcase sites
	 */
	async #saveDataFiles(showcases: Showcase[]) {
		await fs.rm(showcaseFileLocation, { recursive: true, force: true });
		await fs.mkdir(showcaseFileLocation);

		for (const showcase of showcases) {
			await fs.writeFile(
				path.join(showcaseFileLocation, `${showcase.author}.json`),
				JSON.stringify(showcase, null, 2),
				'utf8'
			);
		}
	}

	/**
	 * Expose data from this run to GitHub Actions for use in other steps.
	 * We set a `prBody` output for use when creating a PR from this run's changes.
	 */
	setActionOutput(showcases: Showcase[]) {
		const prLines = [
			'This PR is auto-generated by a GitHub action that runs every Monday to update the Open {re}Source showcase with data from GitHub and NPM.',
			'',
		];

		if (showcases.length > 0) {
			prLines.push(
				'#### Links in this PR 🆕',
				'',
				...showcases.map((showcase) => `- ${showcase.links.map((content) => content.url).join(' - ')}`),
				''
			);
		}

		if (process.env.CI) {
			ghActions.setOutput('prBody', prLines.join('\n'));
		} else {
			console.info(prLines.join('\n'));
		}
	}

	#emojify(text: string) {
		const slices: string[] = [];

		let position = 0;
		emojiRegex.lastIndex = 0;
		let match = emojiRegex.exec(text);

		while (match) {
			const code = match[1];

			// If the code is not in the emoji map, strip it out.
			if (!(code in nameToEmoji)) {
				position += code.length + 3;
				match = emojiRegex.exec(text);
				continue;
			}

			// Get the start and end positions of the emoji code including the colons.
			const start = match.index;
			const end = start + code.length + 2;

			// Append the text before the emoji if there is any.
			if (start !== position) {
				slices.push(text.slice(position, start));
			}

			// Append the emoji.
			slices.push(nameToEmoji[code]);

			// Update the position and find the next match.
			position = end;
			match = emojiRegex.exec(text);
		}

		// Append the text after the last emoji if there is any.
		slices.push(text.slice(position));

		return slices.join('');
	}

	#getRepoLanguages(repository: Repository) {
		const languages: ShowcaseGitHubRepoLink['languages'] = [];

		for (const language of repository.languages?.edges ?? []) {
			// Languages without a color are very rare but are skipped in the GitHub UI so we might as well skip them here.
			if (!language?.node.color) {
				continue;
			}

			// In most projects, the shell language is only appearing due to pre-commit hooks so we can safely skip
			// very small amounts of shell code.
			if (language.node.name === 'Shell' && language.size < 2000) {
				continue;
			}

			languages.push(language.node.name);
		}

		return languages;
	}
}

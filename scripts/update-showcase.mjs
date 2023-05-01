// This script is based on the one from Astro:
// https://github.com/withastro/astro.build/blob/main/scripts/update-showcase.mjs#L48

import octokit from "@octokit/graphql";
import ghActions from "@actions/core";
import { parseHTML } from "linkedom";
import fs from "node:fs/promises";
import * as dotenv from "dotenv";
import gh from 'parse-github-url';
dotenv.config();

class ShowcaseScraper {
  /** A GraphQL client that uses our authorization token by default. */
  #query;
  /** The GitHub user or org to scrape. */
  #org;
  /** The name of the GitHub repo to scrape. */
  #repo;
  /** The number of the discussion to use as the data source. */
  #discussion;

  constructor({
    org = "Open-reSource",
    repo = "openresource.dev",
    discussion = 3,
  } = {}) {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error("GITHUB_TOKEN env variable must be set to run.");
    }

    this.#query = octokit.graphql.defaults({
      headers: {
        authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    this.#org = org;
    this.#repo = repo;
    this.#discussion = discussion;
  }

  /**
   * Run the showcase scraper, extract & filter links from the GitHub discussion, and add them to the repo.
   * @returns {Promise<void>}
   */
  async run() {
    console.log(
      `Fetching comments from ${this.#org}/${this.#repo} discussion #${
        this.#discussion
      }...`
    );

    const commentHtml = await this.#getDiscussionCommentsHTML();

    console.log("Extracting URLs...");

    const myArray = [];

    for (const comment of commentHtml) {
      const hrefs = await this.#extractHrefs(comment);

      if (hrefs.length > 0) {
        const enhancedHrefs = [];
        for (const href of hrefs) {
          const ghReference = gh(href);

          if (ghReference.repo !== null) {
            console.log(`Adding repository data from ${href}...`);
            const { repository } = await this.#getRepository({owner: ghReference.owner,name: ghReference.name});

            enhancedHrefs.push( {
              url: href,
              repo: repository
            });
          } else {
            console.log(`Adding ${href}...`);
            enhancedHrefs.push({
              url: href
            });
          }
        }

        myArray.push(enhancedHrefs);
      }
    }

    await this.#saveDataFile(myArray);

    this.setActionOutput(myArray);
  }

  /**
   * Execute a GraphQL query to fetch discussion comments from the GitHub API.
   * @returns {Promise<{
   *  repository: {
   *    discussion: {
   *      bodyHTML: string;
   *      comments: {
   *        pageInfo: {
   *          startCursor: string;
   *          endCursor: string;
   *          hasNextPage: boolean;
   *        }
   *        nodes: {
   *          bodyHTML: string
   *        }[]
   *      }
   *    }
   *  }
   * }>}
   */
  #getDiscussionComments({ first = 100, after = "null" } = {}) {
    return this.#query(`query {
    repository(owner: "${this.#org}", name: "${this.#repo}") {
      discussion(number: ${this.#discussion}) {
        bodyHTML
        comments(first: ${first}, after: ${after || "null"}) {
          pageInfo {
            startCursor
            endCursor
            hasNextPage
           }
           nodes {
             bodyHTML
           }
         }
       }
     }
   }`);
  }

  /**
   * Execute a GraphQL query to fetch repository data from the GitHub API.
   * @returns {Promise<{
  *  repository
  * }>}
  */
  #getRepository({ owner, name} = {}) {
    return this.#query(`
      query {
        repository(owner: "${owner}", name: "${name}") {
          name
          object(expression: "HEAD:README.md") {
            ... on Blob {
              text
            }
          }
          mentionableUsers {
            totalCount
          }
          discussions(states: OPEN) {
            totalCount
          }
          nameWithOwner
          description
          openGraphImageUrl
          owner {
            avatarUrl
            login
          }
          forkCount
          issues(states: OPEN) {
            totalCount
          }
          stargazerCount
          pullRequests(states: OPEN) {
            totalCount
          }
          languages(first:10) {
            nodes {
              name
            }
          }
        }
    }`);
  }

  /**
   * Get an array of the HTML of all comments in a specific GitHub Discussion
   * @returns {Promise<string[]>}
   */
  async #getDiscussionCommentsHTML() {
    /** @type {string[]} */
    const allCommentsHTML = [];

    let hasNextPage = true;
    let after = "";
    while (hasNextPage) {
      const { repository } = await this.#getDiscussionComments({ after });
      const { bodyHTML, comments } = repository.discussion;

      comments.nodes.forEach((node) => allCommentsHTML.push(node.bodyHTML));

      hasNextPage = comments.pageInfo.hasNextPage;
      after = comments.pageInfo.endCursor;
    }
    return allCommentsHTML;
  }

  /**
   * @param {string} html HTML to parse and extract links from
   * @returns {string[]} Array of URLs found in link `href` attributes.
   */
  #extractHrefs(html) {
    const { document } = parseHTML(html);
    const links = document.querySelectorAll("a");
    const hrefs = [...links]
      .map((link) => link.href)
      .filter((href) => Boolean(href));
    return [...new Set(hrefs)];
  }

  /**
   * Create a JSON file in the `src/data` directory.
   * @param {string[]} content Content of the showcase sites
   * @returns {Promise<void>}
   */
  async #saveDataFile(content) {
    await fs.writeFile(
      `src/data/showcase.json`,
      JSON.stringify(content, null, 2),
      "utf8"
    );
  }

  /**
   * Expose data from this run to GitHub Actions for use in other steps.
   * We set a `prBody` output for use when creating a PR from this run’s changes.
   * @param {string[][]} myArray
   */
  setActionOutput(myArray) {
    const prLines = [
      "This PR is auto-generated by a GitHub action that runs every Monday to update the Open {re}Source showcase with data from GitHub and NPM.",
      "",
    ];

    if (myArray.length > 0) {
      prLines.push(
        "#### Links added in this PR 🆕",
        "",
        ...myArray.map((content) => `- ${content.map(content => content.url).join(" - ")}`),
        ""
      );
    }

    if (process.env.CI) {
      ghActions.setOutput("prBody", prLines.join("\n"));
    } else {
      console.log(prLines.join("\n"));
    }
  }
}

const scraper = new ShowcaseScraper({
  org: "Open-reSource",
  repo: "openresource.dev",
  discussion: 3,
  blockedOrigins: [
    "https://user-images.githubusercontent.com",
    "https://camo.githubusercontent.com",
    "https://openresource.dev",
    "https://www.openresource.dev",
  ],
});

await scraper.run();

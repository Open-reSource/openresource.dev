export interface GitHubRepoInfo {
	avatarUrl: string;
	description: string | null;
}

// One request per repository and per build, whatever the number of cards that show it.
const cache = new Map<string, Promise<GitHubRepoInfo | undefined>>();

/** The repository's current description and owner avatar, or `undefined` when GitHub can't be reached. */
export function fetchGitHubRepo(owner: string, repo: string): Promise<GitHubRepoInfo | undefined> {
	const key = `${owner}/${repo}`.toLowerCase();
	let result = cache.get(key);
	if (!result) {
		result = request(owner, repo);
		cache.set(key, result);
	}
	return result;
}

async function request(owner: string, repo: string): Promise<GitHubRepoInfo | undefined> {
	const token = process.env.GITHUB_TOKEN;
	try {
		const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
			headers: {
				Accept: 'application/vnd.github+json',
				'X-GitHub-Api-Version': '2022-11-28',
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			signal: AbortSignal.timeout(5000),
		});
		if (!response.ok) return undefined;
		const data = (await response.json()) as { description?: string | null; owner?: { avatar_url?: string } };
		if (!data.owner?.avatar_url) return undefined;
		return { avatarUrl: `${data.owner.avatar_url}&s=96`, description: data.description?.trim() || null };
	} catch {
		return undefined;
	}
}

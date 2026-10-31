// "Was this chapter useful?" in the quiet line at the end of a written guide chapter ("Edited", "Edit on GitHub", "Report a problem"): two links, "Yes" and "Not really". Each opens
// GitHub's new-discussion form in the site's public Discussions with the chapter and the answer already filled in, so
// the reader only has to press "Start discussion" (and may add a line). Nothing is sent from this site and nothing is
// stored on the reader's device: no cookie, no local storage. Injected on every page by
// `src/learning-paths-integration.mjs`; without JavaScript the pages read as before.
export const DISCUSSIONS = 'https://github.com/orgs/Open-reSource/discussions/new';

export type Answer = 'yes' | 'no';

/** The pre-filled new-discussion address for one answer about one chapter. */
export function feedbackUrl(chapter: { path: string; title: string }, answer: Answer): string {
	const url = new URL(DISCUSSIONS);
	const verdict = answer === 'yes' ? 'Useful' : 'Not useful';
	url.searchParams.set('category', 'general');
	url.searchParams.set('title', `Chapter feedback: ${chapter.title} (${verdict.toLowerCase()})`);
	url.searchParams.set(
		'body',
		`**Chapter:** https://openresource.dev${chapter.path}\n**Was it useful?** ${verdict}\n\n${answer === 'yes' ? 'Anything you liked, or want more of?' : 'What was missing or unclear?'}\n`
	);
	return url.toString();
}

export function askFeedback(readable: string[]) {
	const path = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
	const match = path.match(/^\/guide\/([^/]+\/[^/]+)\/$/);
	if (!match || !readable.includes(match[1])) return;
	const main = document.querySelector('main');
	if (!main) return;
	const title = main.querySelector('h1')?.textContent?.trim() || document.title;

	// The quiet line under the chapter: "Edited …", "Edit on GitHub", "Report a problem". The question joins it, in the
	// same style, so it never competes with "Next in path" and the previous/next cards. The line exists twice (under the
	// article on a phone, under the table of contents on a wide screen): the question goes into each.
	const lines = [...document.querySelectorAll('a')]
		.filter((a) => a.textContent?.trim() === 'Report a problem')
		.map((a) => a.parentElement)
		.filter((line): line is HTMLElement => !!line);
	if (lines.length === 0) return;

	lines.forEach((line, index) => {
		const root = document.createElement('span');
		root.className = 'chapter-feedback';
		root.setAttribute('role', 'group');
		root.setAttribute('aria-labelledby', `chapter-feedback-title-${index}`);

		const question = document.createElement('span');
		question.id = `chapter-feedback-title-${index}`;
		question.textContent = 'Was this chapter useful?';
		root.append(question);

		for (const [answer, label, name] of [
			['yes', 'Yes', 'Yes, this chapter was useful'],
			['no', 'Not really', 'Not really, this chapter was not useful'],
		] as const) {
			const link = document.createElement('a');
			link.href = feedbackUrl({ path, title }, answer);
			link.target = '_blank';
			link.rel = 'noopener noreferrer';
			link.textContent = label;
			link.setAttribute('aria-label', `${name} (opens a GitHub discussion)`);
			link.title = 'Opens a public discussion on GitHub. This site stores nothing about you.';
			root.append(link);
		}
		line.append(root);
	});
}

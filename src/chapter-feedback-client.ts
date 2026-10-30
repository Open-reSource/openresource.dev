// "Was this chapter useful?" at the end of a written guide chapter: two links, "Yes" and "Not really". Each opens
// GitHub's new-discussion form in the site's public Discussions with the chapter and the answer already filled in, so
// the reader only has to press "Start discussion" (and may add a line). Nothing is sent from this site and nothing is
// stored on the reader's device: no cookie, no local storage. Injected on every page by
// `src/learning-paths-integration.mjs`; without JavaScript the pages read as before.
export const DISCUSSIONS = 'https://github.com/Open-reSource/openresource.dev/discussions/new';

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

	const root = document.createElement('section');
	root.className = 'chapter-feedback';
	root.setAttribute('aria-labelledby', 'chapter-feedback-title');

	const heading = document.createElement('h2');
	heading.id = 'chapter-feedback-title';
	heading.className = 'chapter-feedback__title';
	heading.textContent = 'Was this chapter useful?';

	const actions = document.createElement('div');
	actions.className = 'chapter-feedback__actions';
	for (const [answer, label] of [
		['yes', 'Yes'],
		['no', 'Not really'],
	] as const) {
		const link = document.createElement('a');
		link.className = 'chapter-feedback__link';
		link.href = feedbackUrl({ path, title }, answer);
		link.target = '_blank';
		link.rel = 'noopener noreferrer';
		link.textContent = label;
		actions.append(link);
	}

	const note = document.createElement('p');
	note.className = 'chapter-feedback__note';
	note.textContent = 'Your answer opens a public discussion on GitHub. This site stores nothing about you.';

	root.append(heading, actions, note);
	const pager = main.querySelector('nav.pn');
	if (pager) pager.before(root);
	else main.append(root);
}

// The learning path a reader follows, on the guide chapters: "Path: First-timer, 3 of 8" under the title and "Next in
// path" above the previous/next links, injected on every page by `src/learning-paths-integration.mjs`. A reader enters a
// path from /guide/start/, whose links carry `?path=<id>`; the id is kept in localStorage so the next chapters know it,
// and removed from the address so a copied link stays clean. Nothing shows without JavaScript, on a chapter outside the
// path, or after "Leave path": the chapter reads as before.

export interface PathChapter {
	href: string;
	title: string;
}

export interface LearningPath {
	id: string;
	persona: string;
	chapters: PathChapter[];
}

export const KEY = 'learning-path';

/** The path the reader follows and where this page sits in it, or undefined when the page isn't in that path. */
export function locate(
	paths: LearningPath[],
	{ pathname, param, stored }: { pathname: string; param?: string | null; stored?: string | null }
): { path: LearningPath; index: number } | undefined {
	const byId = (id?: string | null) => paths.find((path) => path.id === id);
	// A link from the start page wins over the path stored earlier: the reader just picked it.
	const path = byId(param) ?? byId(stored);
	if (!path) return undefined;
	const here = pathname.endsWith('/') ? pathname : `${pathname}/`;
	const index = path.chapters.findIndex((chapter) => chapter.href === here);
	return index === -1 ? undefined : { path, index };
}

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className: string, text?: string) {
	const node = document.createElement(tag);
	node.className = className;
	if (text) node.textContent = text;
	return node;
}

export function follow(paths: LearningPath[]) {
	if (!location.pathname.startsWith('/guide/')) return;

	const url = new URL(location.href);
	const param = url.searchParams.get('path');
	if (param !== null) {
		url.searchParams.delete('path');
		history.replaceState(history.state, '', url);
	}

	let stored: string | null = null;
	let saved = false;
	try {
		stored = localStorage.getItem(KEY);
		if (paths.some(({ id }) => id === param)) {
			localStorage.setItem(KEY, param!);
			saved = true;
		}
	} catch {}

	const found = locate(paths, { pathname: location.pathname, param, stored });
	const main = document.querySelector('main');
	if (!found || !main) return;
	const { path, index } = found;
	const total = path.chapters.length;
	const next = path.chapters[index + 1];
	// Storage blocked (private mode, cookies off): the next link carries the path itself.
	const carry = !saved && stored !== path.id;

	const chip = element('p', 'path-chip');
	chip.append(element('span', 'path-chip__label', 'Path'));
	const name = element('a', 'path-chip__name', path.persona);
	name.href = `/guide/start/#${path.id}`;
	chip.append(name, element('span', 'path-chip__step', `${index + 1} of ${total}`));
	const leave = element('button', 'path-chip__leave', 'Leave path');
	leave.type = 'button';
	chip.append(leave);

	const nav = element('nav', 'path-next');
	nav.setAttribute('aria-label', 'Learning path');
	const link = element('a', 'path-next__link');
	if (next) {
		link.href = carry ? `${next.href}?path=${path.id}` : next.href;
		link.append(
			element('span', 'path-next__label', `Next in path · ${index + 2} of ${total}`),
			element('b', '', next.title)
		);
	} else {
		link.href = `/guide/start/`;
		link.append(
			element('span', 'path-next__label', `End of path · ${total} of ${total}`),
			element('b', '', 'Pick another path')
		);
	}
	nav.append(link);

	const title = main.querySelector('h1');
	if (title) title.after(chip);
	else main.prepend(chip);
	const pager = main.querySelector('nav.pn');
	if (pager) pager.before(nav);
	else main.append(nav);

	leave.addEventListener('click', () => {
		try {
			localStorage.removeItem(KEY);
		} catch {}
		chip.remove();
		nav.remove();
		// The button is gone: give focus back to the page where it was, at its title.
		if (title) {
			title.tabIndex = -1;
			title.focus();
		}
	});
}

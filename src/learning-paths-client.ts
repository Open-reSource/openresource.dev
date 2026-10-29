// The learning path a reader follows and what they have read, on the guide: a bar under the title with the path, the
// position in it, the progress and the "Mark as read" and "Leave path" buttons, "Next in path" above the previous/next
// links, a check in the sidebar for each chapter read, and on /guide/start/ each path's progress and a reset. Injected
// on every page by `src/learning-paths-integration.mjs`. A reader enters a path from /guide/start/, whose links carry
// `?path=<id>`; the id is kept in localStorage so the next chapters know it, and removed from the address so a copied
// link stays clean.
// Everything is added here, so without JavaScript the pages read as before. When storage is blocked (private mode,
// cookies off) nothing that needs it is shown: no button that can't save, no counter.
import {
	KEY,
	chapterKey,
	describe,
	empty,
	parse,
	progressOf,
	stringify,
	toggle,
	type Chapter,
	type Progress,
} from './reading-progress.ts';

export { KEY };

export interface PathChapter extends Chapter {}

export interface LearningPath {
	id: string;
	persona: string;
	chapters: PathChapter[];
}

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
	if (className) node.className = className;
	if (text) node.textContent = text;
	return node;
}

/** localStorage when it can be read and written, else undefined. */
function openStorage(): Storage | undefined {
	try {
		const probe = `${KEY}-probe`;
		localStorage.setItem(probe, '1');
		localStorage.removeItem(probe);
		return localStorage;
	} catch {
		return undefined;
	}
}

export function follow(paths: LearningPath[], readable: string[] = []) {
	if (!location.pathname.startsWith('/guide/')) return;

	const url = new URL(location.href);
	const param = url.searchParams.get('path');
	if (param !== null) {
		url.searchParams.delete('path');
		history.replaceState(history.state, '', url);
	}

	const storage = openStorage();
	const load = (): Progress => {
		try {
			return parse(storage?.getItem(KEY));
		} catch {
			return empty();
		}
	};
	const save = (state: Progress) => {
		try {
			storage?.setItem(KEY, stringify(state));
		} catch {}
	};
	const clear = () => {
		try {
			storage?.removeItem(KEY);
		} catch {}
	};

	let state = load();
	const picked = paths.some(({ id }) => id === param) ? param : null;
	if (picked && state.path !== picked) {
		state = { ...state, path: picked };
		save(state);
	}

	const known = new Set(readable);
	const hereKey = chapterKey(location.pathname);
	const found = locate(paths, { pathname: location.pathname, param, stored: state.path });
	const main = document.querySelector('main');

	// Called whenever something changes, here or in another tab: each piece updates itself.
	const renders: Array<() => void> = [];
	const render = () => {
		state = load();
		renders.forEach((run) => run());
	};

	// The bar under the title: the path (its name, the position, the progress) on top, the buttons below or beside it.
	// One element for both, created by whichever needs it first, so the path and "Mark as read" are laid out together.
	let bar: { root: HTMLElement; grid: HTMLElement; actions: HTMLElement } | undefined;
	const readingBar = (main: Element) => {
		if (bar) return bar;
		const root = element('div', 'reading-bar');
		const grid = element('div', 'reading-bar__grid');
		const actions = element('div', 'reading-bar__actions');
		grid.append(actions);
		root.append(grid);
		const title = main.querySelector('h1');
		if (title) title.after(root);
		else main.prepend(root);
		return (bar = { root, grid, actions });
	};

	if (found && main) chapter(found, main);
	if (storage && main && hereKey && known.has(hereKey)) markButton(main, hereKey);
	if (storage) sidebarMarks();
	if (storage && /^\/guide\/start\/?$/.test(location.pathname)) startPage();
	if (storage) addEventListener('storage', (event) => event.key === KEY && render());

	function chapter({ path, index }: NonNullable<ReturnType<typeof locate>>, main: Element) {
		const total = path.chapters.length;
		const next = path.chapters[index + 1];
		// Storage blocked: the next link carries the path itself.
		const carry = !storage;

		const { root, grid, actions } = readingBar(main);
		root.dataset.path = '';
		const identity = element('p', 'reading-bar__path');
		const name = element('a', 'reading-bar__name', path.persona);
		name.href = `/guide/start/#${path.id}`;
		identity.append(element('span', 'reading-bar__label', 'Path'), ' ', name);

		const status = element('p', 'reading-bar__status');
		status.append(element('span', 'reading-bar__step', `Chapter ${index + 1} of ${total}`));
		if (storage) {
			const counter = element('span', 'reading-bar__progress');
			counter.setAttribute('aria-live', 'polite');
			status.append(counter);
			renders.push(() => (counter.textContent = describe(progressOf(path.chapters, state))));
		}
		grid.prepend(identity, status);

		const leave = element('button', 'reading-bar__button', 'Leave path');
		leave.type = 'button';
		actions.append(leave);

		const nav = element('nav', 'path-next');
		nav.setAttribute('aria-label', 'Learning path');
		const link = element('a', 'path-next__link');
		if (next) {
			link.href = carry ? `${next.href}?path=${path.id}` : next.href;
			link.append(
				element('span', 'path-next__label', `Next in path · ${index + 2} of ${total} · ${next.minutes} min`),
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

		const pager = main.querySelector('nav.pn');
		if (pager) pager.before(nav);
		else main.append(nav);
		render();

		leave.addEventListener('click', () => {
			// The read marks stay: leaving a path forgets which one, not what was read.
			save({ ...load(), path: undefined });
			nav.remove();
			identity.remove();
			status.remove();
			leave.remove();
			delete root.dataset.path;
			// The button is gone: focus goes to "Mark as read" next to it, or, when there is none, to the title.
			const next = actions.querySelector('button');
			if (next) next.focus();
			else {
				root.remove();
				const title = main.querySelector('h1');
				if (title) {
					title.tabIndex = -1;
					title.focus();
				}
			}
		});
	}

	function markButton(main: Element, key: string) {
		const button = element('button', 'reading-bar__button');
		button.type = 'button';
		renders.push(() => {
			const read = state.read.includes(key);
			button.setAttribute('aria-pressed', String(read));
			button.textContent = read ? 'Read ✓' : 'Mark as read';
		});
		button.addEventListener('click', () => {
			save(toggle(load(), key, !load().read.includes(key)));
			render();
		});
		// First of the buttons: it is about this chapter, "Leave path" about the whole path.
		readingBar(main).actions.prepend(button);
		render();
	}

	function sidebarMarks() {
		const links = [...document.querySelectorAll<HTMLAnchorElement>('nav[aria-label="Documentation"] a[href]')].flatMap(
			(link) => {
				const key = chapterKey(new URL(link.href, location.href).pathname);
				return key && known.has(key) ? [{ link, key }] : [];
			}
		);
		renders.push(() => {
			for (const { link, key } of links) {
				const mark = link.querySelector('.read-mark');
				if (state.read.includes(key) === Boolean(mark)) continue;
				if (mark) {
					mark.remove();
					continue;
				}
				const added = element('span', 'read-mark');
				const glyph = element('span', '', '✓');
				glyph.setAttribute('aria-hidden', 'true');
				added.append(glyph, element('span', 'd-visually-hidden', ' read'));
				link.append(added);
			}
		});
		render();
	}

	function startPage() {
		for (const card of document.querySelectorAll<HTMLElement>('.path[data-path]')) {
			const path = paths.find(({ id }) => id === card.dataset.path);
			const line = card.querySelector<HTMLElement>('.path__progress');
			if (!path || !line) continue;
			renders.push(() => {
				const result = progressOf(path.chapters, state);
				line.hidden = result.done === 0;
				line.textContent = result.done === 0 ? '' : describe(result);
			});
		}

		const slot = document.querySelector<HTMLElement>('[data-progress-reset]');
		if (slot) {
			const note = element(
				'p',
				'progress-reset__note',
				"Progress stays in this browser. No account, nothing is sent anywhere, and it doesn't follow you to another device."
			);
			const row = element('p', 'progress-reset__row');
			slot.append(note, row);

			const ask = () => {
				row.replaceChildren();
				const button = element('button', 'progress-reset__button', 'Reset progress');
				button.type = 'button';
				button.addEventListener('click', confirm);
				row.append(button);
				return button;
			};
			const confirm = () => {
				row.replaceChildren(element('span', '', 'Really reset? '));
				const yes = element('button', 'progress-reset__button', 'Yes');
				const no = element('button', 'progress-reset__button', 'No');
				yes.type = no.type = 'button';
				yes.addEventListener('click', () => {
					clear();
					render();
					ask().focus();
				});
				no.addEventListener('click', () => ask().focus());
				row.append(yes, ' · ', no);
				no.focus();
			};
			ask();
		}
		render();
	}
}

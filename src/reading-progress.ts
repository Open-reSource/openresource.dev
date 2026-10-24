// What a reader has read in the guide, kept in their browser only. One object under one localStorage key, versioned so a
// later change can migrate it: the id of the learning path they follow and the chapters they marked as read
// (`<dir>/<page>`, never the bare page name, since two modules have a `finding-open-source-projects`). Nothing here
// touches the page: `src/learning-paths-client.ts` does the DOM. Nothing is ever sent anywhere.
import { formatMinutes } from './reading-time.mjs';

export const KEY = 'learning-path';

export interface Progress {
	v: 1;
	/** The learning path the reader follows, if any. */
	path?: string;
	/** Chapters marked as read, `<dir>/<page>`. */
	read: string[];
}

export interface Chapter {
	href: string;
	title: string;
	minutes: number;
}

export const empty = (): Progress => ({ v: 1, read: [] });

/** `/guide/<dir>/<page>/` (or a link to it) as `<dir>/<page>`, or undefined for any other address. */
export function chapterKey(pathname: string): string | undefined {
	return pathname.match(/^\/guide\/([^/]+\/[^/]+)\/?$/)?.[1];
}

/**
 * What localStorage held, as a Progress. Corrupt JSON, another shape or an unknown version gives an empty one, never an
 * error. A bare string is what the first version stored (just the path id) and is kept as the path.
 */
export function parse(raw: string | null | undefined): Progress {
	if (!raw) return empty();
	if (!raw.startsWith('{')) return { v: 1, path: raw, read: [] };
	try {
		const data = JSON.parse(raw);
		if (data?.v !== 1 || !Array.isArray(data.read)) return empty();
		return {
			v: 1,
			path: typeof data.path === 'string' ? data.path : undefined,
			read: [...new Set<string>(data.read.filter((key: unknown): key is string => typeof key === 'string'))],
		};
	} catch {
		return empty();
	}
}

export const stringify = ({ path, read }: Progress) => JSON.stringify({ v: 1, ...(path ? { path } : {}), read });

/** Marks or unmarks a chapter, without changing the original. */
export function toggle(state: Progress, key: string, read: boolean): Progress {
	const without = state.read.filter((item) => item !== key);
	return { ...state, read: read ? [...without, key] : without };
}

/** How far a reader is through a path: chapters marked read (in any order) and the minutes of the others. */
export function progressOf(chapters: Chapter[], state: Progress) {
	const read = new Set(state.read);
	const unread = chapters.filter(({ href }) => !read.has(chapterKey(href) ?? ''));
	return {
		done: chapters.length - unread.length,
		total: chapters.length,
		minutes: unread.reduce((total, { minutes }) => total + minutes, 0),
	};
}

export function describe({ done, total, minutes }: ReturnType<typeof progressOf>) {
	return done === total ? 'Path complete' : `${done} of ${total} read, ${formatMinutes(minutes)} left`;
}

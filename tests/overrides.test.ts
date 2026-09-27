import fs from 'node:fs';
import { describe, expect, test } from 'vitest';

// Every entry in `overrides` is scoped to the package that pulls the outdated dependency:
// `{ "<parent>": { "<dependency>": "<version>" } }`. This test fails as soon as an override is no
// longer needed (the parent is gone, or now asks for that version itself), so the dependency bump
// that makes it useless is also the one that removes it.

const read = (path: string) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));

const { overrides = {} } = read('../package.json') as { overrides?: Record<string, unknown> };

const lowest = (range: string) =>
	(range.replace(/^[\^~>=v\s]+/, '').match(/^(\d+)\.(\d+)\.(\d+)/) ?? []).slice(1).map(Number);

const atLeast = (range: string, version: string) => {
	const [a, b] = [lowest(range), lowest(version)];
	for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
	return true;
};

type Entry = { parent: string; dependency?: string; version: string };

const entries = Object.entries(overrides).flatMap(([parent, children]): Entry[] =>
	typeof children === 'object' && children !== null
		? Object.entries(children as Record<string, string>).map(([dependency, version]) => ({
				parent,
				dependency,
				version,
			}))
		: [{ parent, dependency: undefined, version: String(children) }]
);

describe('package.json overrides', () => {
	test('every override is scoped to the package that needs it', () => {
		expect(entries.filter(({ dependency }) => !dependency).map(({ parent }) => parent)).toEqual([]);
	});

	test('no override outlives its reason', () => {
		const stale = entries.flatMap(({ parent, dependency, version }) => {
			const path = `../node_modules/${parent}/package.json`;
			if (!fs.existsSync(new URL(path, import.meta.url)))
				return [`${parent} is no longer installed: remove overrides["${parent}"]`];
			const pkg = read(path);
			const range = pkg.dependencies?.[dependency!] ?? pkg.optionalDependencies?.[dependency!];
			if (!range)
				return [`${parent} no longer depends on ${dependency}: remove overrides["${parent}"]["${dependency}"]`];
			if (atLeast(range, version))
				return [
					`${parent}@${pkg.version} now asks for ${dependency} ${range}: remove overrides["${parent}"]["${dependency}"]`,
				];
			return [];
		});
		expect(stale).toEqual([]);
	});
});

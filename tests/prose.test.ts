import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

// The style rules a machine can check. Pages written before them are listed in `prose.baseline.json` with their
// current count per rule: a count may go down, never up. After fixing a page, lower its counts (or run
// `UPDATE_PROSE_BASELINE=1 npm run test -- --run prose`) so the fix can't regress.
const root = path.resolve(__dirname, '../src/content');
const baselineFile = path.join(__dirname, 'prose.baseline.json');

type Rule = { id: string; message: string; check: (line: string) => number };

const matches = (regex: RegExp) => (line: string) => line.match(regex)?.length ?? 0;

const banned: [string, RegExp][] = [
	['In this chapter, we will', /\bIn this (chapter|article|part|section),? we( will|'ll)\b/gi],
	["It's important to note", /\b(it's|it is) important to note\b/gi],
	['In conclusion', /\bIn conclusion\b/gi],
	['Remember,', /\bRemember,/g],
	['essential, crucial', /\b(essential|crucial)\b/gi],
	['vibrant, thriving', /\b(vibrant|thriving)\b/gi],
	['delve, landscape, journey', /\b(delv(e|es|ed|ing)|landscapes?|journeys?)\b/gi],
	['empower, leverage', /\b(empower\w*|leverag\w*)\b/gi],
	['In the simplest terms', /\bIn the simplest terms\b/gi],
	['Here are some …', /\bHere are (some|a few)\b/gi],
	['Not all X are created equal', /\bcreated equal\b/gi],
	['Familiarize yourself with', /\bFamiliari[sz]e yourself\b/gi],
];

const rules: Rule[] = [
	...banned.map(([name, regex]) => ({
		id: `banned: ${name}`,
		message: `Banned phrase "${name}": cut it and start with the point.`,
		check: matches(regex),
	})),
	{
		id: 'heading: Introduction/Conclusion',
		message: 'No "Introduction" or "Conclusion" heading: lead with the answer, end on the last section.',
		check: matches(/^#{2,6} +(Introduction|Conclusion)\b/gi),
	},
	{
		id: 'frontmatter: lastUpdate',
		message: 'The frontmatter field is `lastUpdated`, not `lastUpdate`.',
		check: matches(/^lastUpdate:/g),
	},
];

// File-level rules: counted once over the whole file.
const fileRules: { id: string; message: string; check: (lines: string[]) => number }[] = [
	{
		id: 'lead: more than one',
		message: 'A second `<p class="lead">` is a closing recap: delete it.',
		check: (lines) => Math.max(0, lines.reduce((n, line) => n + matches(/<p class="lead">/g)(line), 0) - 1),
	},
	{
		id: 'exclamation: more than one',
		message: 'One exclamation mark per page, if any.',
		// A `!` right after a word, closing a sentence. Skips `[!NOTE]`, `![image]`, `!=` and `<!--`.
		check: (lines) => Math.max(0, lines.reduce((n, line) => n + matches(/\w!+(?=[\s"')*_]|$)/g)(line), 0) - 1),
	},
];

const files = (dir: string): string[] =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const file = path.join(dir, entry.name);
		if (entry.isDirectory()) return files(file);
		return /\.mdx?$/.test(entry.name) ? [file] : [];
	});

// Blank out what isn't prose (code, URLs), keeping line numbers.
const prose = (source: string): string[] => {
	let fenced = false;
	return source.split('\n').map((line) => {
		if (/^\s*(```|~~~)/.test(line)) {
			fenced = !fenced;
			return '';
		}
		if (fenced) return '';
		return line
			.replace(/`[^`]*`/g, '')
			.replace(/\]\([^)]*\)/g, ']')
			.replace(/https?:\/\/\S+/g, '');
	});
};

type Counts = Record<string, Record<string, number>>;

const scan = () => {
	const counts: Counts = {};
	const where: Record<string, Record<string, string[]>> = {};
	for (const file of files(root).sort()) {
		const name = path.relative(root, file);
		const lines = prose(fs.readFileSync(file, 'utf8'));
		const add = (id: string, n: number, at: string) => {
			if (!n) return;
			(counts[name] ??= {})[id] = (counts[name][id] ?? 0) + n;
			((where[name] ??= {})[id] ??= []).push(at);
		};
		lines.forEach((line, i) => rules.forEach((rule) => add(rule.id, rule.check(line), `${name}:${i + 1}`)));
		fileRules.forEach((rule) => add(rule.id, rule.check(lines), name));
	}
	return { counts, where };
};

const messages = Object.fromEntries([...rules, ...fileRules].map((rule) => [rule.id, rule.message]));

test('prose follows the style rules', () => {
	const { counts, where } = scan();

	if (process.env.UPDATE_PROSE_BASELINE) {
		fs.writeFileSync(baselineFile, `${JSON.stringify(counts, null, 2)}\n`);
		return;
	}

	const baseline: Counts = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
	const problems: string[] = [];

	for (const [file, ids] of Object.entries(counts)) {
		for (const [id, count] of Object.entries(ids)) {
			const allowed = baseline[file]?.[id] ?? 0;
			if (count > allowed) problems.push(`${messages[id]}\n    ${where[file][id].join('\n    ')}`);
		}
	}
	for (const [file, ids] of Object.entries(baseline)) {
		for (const [id, allowed] of Object.entries(ids)) {
			const count = counts[file]?.[id] ?? 0;
			if (count < allowed)
				problems.push(
					`Fixed: in tests/prose.baseline.json, ${count ? `lower "${id}" for ${file} to ${count}` : `remove "${id}" for ${file}`}.`
				);
		}
	}

	expect(problems).toEqual([]);
});

// Where the guide stands: one row per chapter, in sidebar order, with its status, size and last update. Prints a
// Markdown table, ready to paste in an issue.
//
//   npm run status [-- --only stub|draft|complete]
import { parseArgs } from 'node:util';

import { rows } from '../src/chapter-rows.ts';
import { STATUSES } from '../src/chapter-status.mjs';

const { values } = parseArgs({ options: { only: { type: 'string' } } });
if (values.only && !STATUSES.includes(values.only)) {
	console.error(`--only takes one of: ${STATUSES.join(', ')}`);
	process.exit(1);
}

const shown = values.only ? rows.filter((r) => r.status === values.only) : rows;

console.log('| Module | Chapter | Status | Words | Images | Updated | Reading |');
console.log('| --- | --- | --- | ---: | ---: | --- | ---: |');
for (const r of shown) {
	console.log(
		`| ${r.module} | [${r.title}](https://openresource.dev${r.path}) | ${r.status} | ${r.words} | ${r.images} | ${r.updated || '–'} | ${r.minutes ? `${r.minutes} min` : '–'} |`
	);
}

const count = (status: string) => rows.filter((r) => r.status === status).length;
console.log(`\n${rows.length} chapters: ${STATUSES.map((s) => `${count(s)} ${s}`).join(', ')}.`);

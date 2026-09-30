import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

// "Report a problem" (`report` in astro.config.mjs) opens this issue form and fills the fields with the ids `page` and
// `updated` from the query string. GitHub ignores an id it doesn't find, so a renamed field would silently stay empty.
const root = path.resolve(__dirname, '..');

test('the "Report a problem" issue form has the fields the link fills', () => {
	const config = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
	const template = config.match(/report: \{[^}]*template: '([^']+)'/)?.[1];
	expect(template).toBeDefined();
	const form = fs.readFileSync(path.join(root, '.github/ISSUE_TEMPLATE', template!), 'utf8');
	const ids = [...form.matchAll(/^\s+id: (\S+)$/gm)].map((m) => m[1]);
	expect(ids).toEqual(expect.arrayContaining(['page', 'updated']));
});

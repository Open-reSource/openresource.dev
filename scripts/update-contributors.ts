// Rewrites src/data/contributors.json from the GitHub contributors API: most contributions first, as the API returns
// them, without bots and without Julien, whom the About page already names. Run it by hand, the build never calls
// the API (needs the GitHub CLI, signed in).
//
//   npm run update:contributors

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const repo = 'Open-reSource/openresource.dev';
const maintainer = 'julien-deramond';

type Contributor = { login: string; type: string };

const output = execFileSync('gh', ['api', '--paginate', '--slurp', `repos/${repo}/contributors`], {
	encoding: 'utf8',
});
const contributors = (JSON.parse(output) as Contributor[][]).flat();

const users = contributors
	.filter(({ login, type }) => type === 'User' && !login.endsWith('[bot]') && login !== maintainer)
	.map(({ login }) => ({ login }));

const file = new URL('../src/data/contributors.json', import.meta.url);
fs.writeFileSync(file, `${JSON.stringify(users, null, 2)}\n`);
console.log(`${users.length} contributors written to src/data/contributors.json`);

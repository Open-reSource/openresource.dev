// The download behind "Download all as a zip" on /guide/templates/.
import { templates } from '../templates.mjs';
import { zip } from '../templates-zip.mjs';

export const prerender = true;

const sources = import.meta.glob('../templates/*', { query: '?raw', import: 'default', eager: true }) as Record<
	string,
	string
>;

export function GET() {
	const files = templates.map(({ file, path, zipPath }) => ({
		name: zipPath ?? path,
		text: sources[`../templates/${file}`].trimEnd() + '\n',
	}));
	return new Response(zip(files), {
		headers: {
			'Content-Type': 'application/zip',
			'Content-Disposition': 'attachment; filename="open-source-templates.zip"',
		},
	});
}

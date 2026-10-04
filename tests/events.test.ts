import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';

type Event = { id: string; name: string; url: string; start?: Date | string; end?: Date | string; month: string };

const events: Event[] = parse(readFileSync('src/data/events.yml', 'utf8'), { schema: 'core' });
const time = (value: Date | string | undefined) => (value ? new Date(value).getTime() : undefined);

describe('events calendar', () => {
	it('has unique ids and names', () => {
		expect(new Set(events.map((event) => event.id)).size).toBe(events.length);
		expect(new Set(events.map((event) => event.name)).size).toBe(events.length);
	});

	it('links every event over https', () => {
		for (const event of events) expect(event.url, event.id).toMatch(/^https:\/\//);
	});

	it('never ends before it starts, and never has an end without a start', () => {
		for (const event of events) {
			if (event.end) expect(event.start, event.id).toBeDefined();
			if (event.start && event.end) expect(time(event.end)!, event.id).toBeGreaterThanOrEqual(time(event.start)!);
		}
	});
});

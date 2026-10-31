import { describe, expect, test } from 'vitest';

import { feedbackUrl } from '../src/chapter-feedback-client.ts';

const chapter = { path: '/guide/start/first-steps/', title: 'First steps & more' };

describe('chapter feedback', () => {
	test('opens a pre-filled discussion of the repository', () => {
		const url = new URL(feedbackUrl(chapter, 'no'));
		expect(url.origin + url.pathname).toBe('https://github.com/orgs/Open-reSource/discussions/new');
		expect(url.searchParams.get('category')).toBe('general');
		expect(url.searchParams.get('title')).toBe('Chapter feedback: First steps & more (not useful)');
		expect(url.searchParams.get('body')).toContain('https://openresource.dev/guide/start/first-steps/');
	});

	test('tells yes from no', () => {
		expect(new URL(feedbackUrl(chapter, 'yes')).searchParams.get('body')).toContain('Useful');
		expect(new URL(feedbackUrl(chapter, 'no')).searchParams.get('body')).toContain('Not useful');
	});
});

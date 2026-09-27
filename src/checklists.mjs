// The "Do this now" checklists written in the guide's MDX: `<Checklist id="…">`, a blank line, the task list, a blank
// line, `</Checklist>`. The checklists page reads them with this, and tests/checklists.test.ts fails on any other form.
const CHECKLIST = /<Checklist id="([^"]+)">\n\n([\s\S]*?)\n\n<\/Checklist>/g;

/** The checklists in an MDX body, as `{ id, list }` where `list` is the Markdown task list. */
export const checklistsIn = (body) => [...body.matchAll(CHECKLIST)].map(([, id, list]) => ({ id, list }));

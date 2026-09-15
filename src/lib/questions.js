// Build-time only. Lists the questions in a Q&A section, read from each <Slide question={n} title="…"> tag
// in its index.mdx, so the section's opening slide can link to them without repeating the text.
const files = import.meta.glob('/src/content/briefings/*/index.mdx', { query: '?raw', import: 'default', eager: true });

export function getQuestions(section) {
  const entry = Object.entries(files).find(([path]) => new RegExp(`/\\d+-${section}/index\\.mdx$`).test(path));
  if (!entry) throw new Error(`QuestionIndex: no briefing section "${section}"`);
  return [...entry[1].matchAll(/<Slide\s([^>]*)>/g)]
    .map((m) => ({
      number: Number(/\bquestion=\{(\d+)\}/.exec(m[1])?.[1]),
      title: /\btitle="([^"]*)"/.exec(m[1])?.[1],
    }))
    .filter((q) => q.number && q.title)
    .sort((a, b) => a.number - b.number);
}

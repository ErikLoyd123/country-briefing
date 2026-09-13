// Deterministic Lorem Ipsum so builds are stable and placeholder text is obviously placeholder.
const WORDS = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore
magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis
aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non
proident sunt culpa qui officia deserunt mollit anim id est laborum perspiciatis unde omnis iste natus error
voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis quasi
architecto beatae vitae dicta explicabo nemo ipsam quia voluptas aspernatur aut odit fugit consequuntur magni dolores
eos ratione sequi nesciunt neque porro quisquam dolorem adipisci numquam eius modi tempora incidunt magnam quaerat`
  .split(/\s+/)
  .filter(Boolean);

function rng(seed) {
  let s = (seed * 9301 + 49297) % 233280 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export function loremWords(count, seed = 1) {
  const r = rng(seed);
  return Array.from({ length: count }, () => WORDS[Math.floor(r() * WORDS.length)]);
}

export function loremSentence(seed = 1, min = 9, max = 20) {
  const r = rng(seed);
  const n = min + Math.floor(r() * (max - min));
  const words = loremWords(n, seed + 7);
  const commaAt = 3 + Math.floor(r() * (n - 6));
  const text = words.map((w, i) => (i === commaAt ? `${w},` : w)).join(' ');
  return text.charAt(0).toUpperCase() + text.slice(1) + '.';
}

export function loremParagraphs(count = 1, seed = 1) {
  return Array.from({ length: count }, (_, p) => {
    const r = rng(seed * 31 + p);
    const sentences = 3 + Math.floor(r() * 3);
    return Array.from({ length: sentences }, (_, i) => loremSentence(seed * 101 + p * 13 + i)).join(' ');
  });
}

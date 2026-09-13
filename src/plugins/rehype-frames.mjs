// Splits a briefing's MDX into screen-sized "frames" (<section class="frame">), so the
// briefing page can show one idea per laptop screen, like a slide.
//   - An h2 or h3 starts a new frame.
//   - A visual component (risk card, map, timeline, callout, …) gets its own frame,
//     unless it directly follows an h3, which it then shares a frame with. An h2 is a
//     divider (e.g. "Singapore"), so a visual right after it still starts a new frame.
//   - Prose (paragraphs, lists, tables) collects into the current frame.
// A file written as authored <Slide>s already is its frames, so it is left alone.
// Only files under src/content/briefings/ are framed. Elsewhere (the paper page) the
// frames are plain wrappers; see .briefing-prose in src/styles/global.css.

// Components that read as prose and flow with the text around them. None yet.
const PROSE_COMPONENTS = new Set([]);

const isBlank = (node) => node.type === 'text' && !node.value.trim();
const isHeading = (node) => node.type === 'element' && (node.tagName === 'h2' || node.tagName === 'h3');
const isH2 = (node) => node.type === 'element' && node.tagName === 'h2';
const isVisual = (node) => node.type === 'mdxJsxFlowElement' && !PROSE_COMPONENTS.has(node.name);
const isModuleCode = (node) => node.type === 'mdxjsEsm';

export default function rehypeFrames() {
  return (tree, file) => {
    if (!String(file.path ?? '').replace(/\\/g, '/').includes('/content/briefings/')) return;
    if (tree.children.some((n) => n.type === 'mdxJsxFlowElement' && n.name === 'Slide')) return;

    const out = [];
    let frame = null; // { node, onlyHeadings, hasH2, endsWithVisual }
    const open = () => {
      frame = { node: { type: 'element', tagName: 'section', properties: { className: ['frame'] }, children: [] }, onlyHeadings: true, hasH2: false, endsWithVisual: false };
      out.push(frame.node);
    };

    for (const node of tree.children) {
      if (isModuleCode(node)) {
        out.push(node);
        continue;
      }
      if (isBlank(node)) {
        frame?.node.children.push(node);
        continue;
      }
      const heading = isHeading(node);
      const visual = isVisual(node);
      if (!frame || (heading && !frame.onlyHeadings) || (visual && (!frame.onlyHeadings || frame.hasH2)) || (!heading && !visual && frame.endsWithVisual)) open();
      frame.node.children.push(node);
      frame.onlyHeadings &&= heading;
      frame.hasH2 ||= isH2(node);
      frame.endsWithVisual = visual;
    }

    tree.children = out;
  };
}

// Splits a briefing's MDX into screen-sized "frames" (<section class="frame">), so the
// briefing page can show one idea per laptop screen, like a slide.
//   - An h2 or h3 starts a new frame.
//   - A visual component (chart, map, timeline, callout, …) gets its own frame,
//     unless it directly follows a heading, which it then shares a frame with.
//   - Prose (paragraphs, lists, <Lorem />) collects into the current frame.
// Only files under src/content/briefings/ are framed. Elsewhere (the paper page) the
// frames are plain wrappers; see .briefing-prose in src/styles/global.css.

const PROSE_COMPONENTS = new Set(['Lorem']);

const isBlank = (node) => node.type === 'text' && !node.value.trim();
const isHeading = (node) => node.type === 'element' && (node.tagName === 'h2' || node.tagName === 'h3');
const isVisual = (node) => node.type === 'mdxJsxFlowElement' && !PROSE_COMPONENTS.has(node.name);
const isModuleCode = (node) => node.type === 'mdxjsEsm';

export default function rehypeFrames() {
  return (tree, file) => {
    if (!String(file.path ?? '').replace(/\\/g, '/').includes('/content/briefings/')) return;

    const out = [];
    let frame = null; // { node, onlyHeadings, endsWithVisual }
    const open = () => {
      frame = { node: { type: 'element', tagName: 'section', properties: { className: ['frame'] }, children: [] }, onlyHeadings: true, endsWithVisual: false };
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
      if (!frame || (heading && !frame.onlyHeadings) || (visual && !frame.onlyHeadings) || (!heading && !visual && frame.endsWithVisual)) open();
      frame.node.children.push(node);
      frame.onlyHeadings &&= heading;
      frame.endsWithVisual = visual;
    }

    tree.children = out;
  };
}

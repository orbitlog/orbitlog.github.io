import type { Root } from 'mdast';

export function readingMinutes(body: string) {
  const chinese = body.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const words = body.replace(/[\u3400-\u9fff]/g, '').match(/[A-Za-z0-9]+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(chinese / 350 + words / 200));
}

export function articleHeadings(body: string) {
  let inCode = false;
  return body.split('\n').flatMap((line, index) => {
    if (/^```/.test(line)) inCode = !inCode;
    const match = !inCode && line.match(/^## (.+)$/);
    return match ? [{ id: `section-${index + 1}`, text: match[1].replace(/[`*]/g, '') }] : [];
  });
}

// Preserve line-based anchors so the rendered headings and reading directory agree.
export function remarkArticle() {
  return (tree: Root) => {
    tree.children = tree.children.map((node) => {
      if (node.type === 'heading') {
        node.data = { ...node.data, hProperties: { id: `section-${node.position?.start.line}` } };
      }
      if (node.type === 'html' && node.value.trim() === '<!-- encoding-lab -->') {
        return { type: 'code', lang: 'encoding-lab', value: '' };
      }
      return node;
    });
  };
}

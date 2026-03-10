import { Node } from '@xyflow/react';

const CATEGORY_ORDER = ['Frontend', 'Backend', 'DevOps', 'Design', 'Data', 'Other'];

/**
 * Deterministic bipartite layout:
 *   • People  → single column on the left, sorted alphabetically
 *   • Skills  → grid on the right, sorted by category then name
 *
 * No randomness — Reset Layout always produces the same result.
 */
export function computeLayout(
  nodes: Node[],
  _edges: { source: string; target: string }[],
  width = 1400,
  height = 900,
): Map<string, { x: number; y: number }> {
  if (nodes.length === 0) return new Map();

  const personNodes = nodes.filter((n) => n.type === 'person');
  const skillNodes  = nodes.filter((n) => n.type === 'skill');
  const positions   = new Map<string, { x: number; y: number }>();

  // ── People: left column, alphabetical ───────────────────────────────────
  const sortedPeople = [...personNodes].sort((a, b) =>
    String(a.data.name ?? '').localeCompare(String(b.data.name ?? ''))
  );

  const pCount  = sortedPeople.length;
  const pGap    = Math.min(140, Math.max(80, (height - 160) / Math.max(pCount, 1)));
  const pTotalH = (pCount - 1) * pGap;
  const pStartY = (height - pTotalH) / 2;
  const pX      = width * 0.13;

  sortedPeople.forEach((p, i) => {
    positions.set(p.id, { x: pX, y: pStartY + i * pGap });
  });

  // ── Skills: right-side grid, by category then name ───────────────────────
  const sortedSkills = [...skillNodes].sort((a, b) => {
    const catA = CATEGORY_ORDER.indexOf(String(a.data.category ?? 'Other'));
    const catB = CATEGORY_ORDER.indexOf(String(b.data.category ?? 'Other'));
    if (catA !== catB) return catA - catB;
    return String(a.data.name ?? '').localeCompare(String(b.data.name ?? ''));
  });

  const sCount = sortedSkills.length;
  if (sCount === 0) return positions;

  // Choose column count for a roughly landscape grid
  const cols = sCount <= 3 ? sCount : sCount <= 8 ? 3 : sCount <= 15 ? 4 : 5;
  const rows = Math.ceil(sCount / cols);

  const rightW  = width * 0.56;
  const sGapX   = Math.min(195, rightW / Math.max(cols, 1));
  const sGapY   = Math.min(155, (height - 130) / Math.max(rows, 1));
  const sStartX = width * 0.41;
  const sStartY = (height - (rows - 1) * sGapY) / 2;

  sortedSkills.forEach((s, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.set(s.id, {
      x: sStartX + col * sGapX,
      y: sStartY + row * sGapY,
    });
  });

  return positions;
}

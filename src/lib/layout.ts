import { Node } from '@xyflow/react';

const CATEGORY_ORDER = ['Frontend', 'Backend', 'DevOps', 'Design', 'Data', 'Other'];

/**
 * Deterministic bipartite layout:
 *   • People  → column(s) on the left, sorted alphabetically
 *   • Skills  → grid on the right, sorted by category then name
 *
 * Scales dynamically for 50+ nodes of either type.
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

  const pCount = personNodes.length;
  const sCount = skillNodes.length;
  const total  = pCount + sCount;

  // Scale canvas dimensions when there are many nodes
  const scaledW = total > 30 ? width * (1 + (total - 30) * 0.012) : width;
  const scaledH = Math.max(height, pCount * 65, Math.ceil(sCount / 6) * 100);

  // ── People: left column(s), alphabetical ─────────────────────────────────
  const sortedPeople = [...personNodes].sort((a, b) =>
    String(a.data.name ?? '').localeCompare(String(b.data.name ?? ''))
  );

  // Use multiple columns when >20 people to keep it readable
  const pCols       = pCount <= 20 ? 1 : pCount <= 50 ? 2 : 3;
  const pPerCol     = Math.ceil(pCount / pCols);
  const pGap        = Math.min(130, Math.max(55, (scaledH - 120) / Math.max(pPerCol, 1)));
  const pColGap     = 160;
  const pStartX     = scaledW * 0.08;

  sortedPeople.forEach((p, i) => {
    const col = Math.floor(i / pPerCol);
    const row = i % pPerCol;
    const totalH = (Math.min(pPerCol, pCount - col * pPerCol) - 1) * pGap;
    const startY = (scaledH - totalH) / 2;
    positions.set(p.id, {
      x: pStartX + col * pColGap,
      y: startY + row * pGap,
    });
  });

  // ── Skills: right-side grid, by category then name ────────────────────────
  const sortedSkills = [...skillNodes].sort((a, b) => {
    const catA = CATEGORY_ORDER.indexOf(String(a.data.category ?? 'Other'));
    const catB = CATEGORY_ORDER.indexOf(String(b.data.category ?? 'Other'));
    if (catA !== catB) return catA - catB;
    return String(a.data.name ?? '').localeCompare(String(b.data.name ?? ''));
  });

  if (sCount === 0) return positions;

  // Dynamic column count that scales with skill count
  const cols = sCount <= 3 ? sCount
    : sCount <= 8  ? 3
    : sCount <= 15 ? 4
    : sCount <= 25 ? 5
    : sCount <= 40 ? 6
    : sCount <= 60 ? 7
    : 8;
  const rows = Math.ceil(sCount / cols);

  // Leave room for people columns on the left
  const peopleRightEdge = pStartX + (pCols - 1) * pColGap + 160;
  const sStartX = Math.max(scaledW * 0.35, peopleRightEdge);
  const rightW  = scaledW - sStartX - 40;
  const sGapX   = Math.min(180, Math.max(100, rightW / Math.max(cols, 1)));
  const sGapY   = Math.min(140, Math.max(70, (scaledH - 100) / Math.max(rows, 1)));
  const sStartY = (scaledH - (rows - 1) * sGapY) / 2;

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

import { Node } from '@xyflow/react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3-force';

interface SimNode extends SimulationNodeDatum {
  id: string;
  type: string;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: string;
  target: string;
}

export function computeLayout(
  nodes: Node[],
  edges: { source: string; target: string }[],
  width = 1400,
  height = 900
): Map<string, { x: number; y: number }> {
  if (nodes.length === 0) return new Map();

  const simNodes: SimNode[] = nodes.map((n) => ({
    id: n.id,
    type: n.type ?? 'person',
    x: n.position.x || Math.random() * width,
    y: n.position.y || Math.random() * height,
  }));

  const nodeById = new Map(simNodes.map((n) => [n.id, n]));

  const simLinks: SimLink[] = edges
    .filter((e) => nodeById.has(e.source) && nodeById.has(e.target))
    .map((e) => ({ source: e.source, target: e.target }));

  const simulation = forceSimulation(simNodes)
    .force(
      'link',
      forceLink<SimNode, SimLink>(simLinks)
        .id((d) => d.id)
        .distance(300)   // larger distance keeps nodes well separated
        .strength(0.4)
    )
    .force(
      'charge',
      forceManyBody().strength((d) => ((d as SimNode).type === 'person' ? -1400 : -700))
    )
    .force('center', forceCenter(width / 2, height / 2))
    .force(
      'collide',
      forceCollide()
        .radius((d) => ((d as SimNode).type === 'person' ? 130 : 105))
        .strength(1)
        .iterations(4)
    )
    .stop();

  for (let i = 0; i < 600; i++) simulation.tick();

  const positions = new Map<string, { x: number; y: number }>();
  simNodes.forEach((n) => {
    positions.set(n.id, { x: n.x ?? 0, y: n.y ?? 0 });
  });
  return positions;
}

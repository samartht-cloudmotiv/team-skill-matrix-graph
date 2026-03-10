'use client';

import { useMemo } from 'react';
import { Node, Edge } from '@xyflow/react';
import { useStore } from '@/lib/store';
import { PersonNodeData, SkillNodeData, ProficiencyEdgeData } from '@/lib/types';

export function useGraphData() {
  const { people, skills, connections, selectedNodeId, highlightedNodeIds } = useStore();

  const nodes: Node[] = useMemo(() => {
    const hasSelection = selectedNodeId !== null;

    const personNodes = people.map((p): Node => ({
      id: p.id,
      type: 'person',
      position: { x: 0, y: 0 },
      data: {
        ...p,
        isSelected: selectedNodeId === p.id,
        isDimmed: hasSelection && !highlightedNodeIds.has(p.id),
        connectionCount: connections.filter((c) => c.personId === p.id).length,
      } as PersonNodeData,
    }));

    const skillNodes = skills.map((s): Node => ({
      id: s.id,
      type: 'skill',
      position: { x: 0, y: 0 },
      data: {
        ...s,
        isSelected: selectedNodeId === s.id,
        isDimmed: hasSelection && !highlightedNodeIds.has(s.id),
        expertCount: connections.filter((c) => c.skillId === s.id && c.proficiency === 'expert').length,
        totalCount: connections.filter((c) => c.skillId === s.id).length,
      } as SkillNodeData,
    }));

    return [...personNodes, ...skillNodes];
  }, [people, skills, connections, selectedNodeId, highlightedNodeIds]);

  const edges: Edge[] = useMemo(() => {
    const hasSelection = selectedNodeId !== null;
    return connections.map((c): Edge => ({
      id: c.id,
      source: c.personId,
      target: c.skillId,
      type: 'proficiency',
      data: {
        proficiency: c.proficiency,
        connectionId: c.id,
        isDimmed: hasSelection && !highlightedNodeIds.has(c.personId) && !highlightedNodeIds.has(c.skillId),
      } as ProficiencyEdgeData,
    }));
  }, [connections, selectedNodeId, highlightedNodeIds]);

  return { nodes, edges };
}

'use client';

import { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeChange,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LayoutGrid } from 'lucide-react';

import PersonNode from './PersonNode';
import SkillNode from './SkillNode';
import ProficiencyEdge from './ProficiencyEdge';
import { useGraphData } from '@/hooks/useGraphData';
import { useStore } from '@/lib/store';
import { computeLayout } from '@/lib/layout';

const nodeTypes: NodeTypes = {
  person: PersonNode,
  skill: SkillNode,
};

const edgeTypes: EdgeTypes = {
  proficiency: ProficiencyEdge,
};

// Stored positions for pinned (user-dragged) nodes
const pinnedPositions = new Map<string, { x: number; y: number }>();

function GraphCanvasInner() {
  const { nodes: rawNodes, edges: rawEdges } = useGraphData();
  const { setSelectedNode, selectedNodeId } = useStore();
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const rfInstance = useRef<ReactFlowInstance | null>(null);
  const layoutDone = useRef(false);
  const prevNodeIds = useRef(new Set<string>());

  // Only allow position & dimension changes from React Flow (dragging).
  // Block add/remove/reset — we manage node topology through the Zustand store.
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    const allowed = changes.filter(
      (c) => c.type === 'position' || c.type === 'dimensions' || c.type === 'select'
    );
    if (allowed.length > 0) {
      setNodes((prev) => {
        let next = prev;
        for (const change of allowed) {
          if (change.type === 'position' && change.position) {
            next = next.map((n) =>
              n.id === change.id ? { ...n, position: change.position! } : n
            );
          }
          if (change.type === 'dimensions' && 'dimensions' in change) {
            next = next.map((n) =>
              n.id === change.id ? { ...n, measured: { ...(n.measured ?? {}), ...((change as any).dimensions ?? {}) } } : n
            );
          }
        }
        return next;
      });
    }
  }, [setNodes]);

  const runLayout = useCallback(
    (forceReset = false) => {
      if (rawNodes.length === 0) {
        setNodes([]);
        setEdges(rawEdges);
        return;
      }
      if (forceReset) pinnedPositions.clear();

      const edgesForLayout = rawEdges.map((e) => ({ source: e.source, target: e.target }));
      const positions = computeLayout(rawNodes, edgesForLayout);
      const positioned: Node[] = rawNodes.map((n) => ({
        ...n,
        position: pinnedPositions.get(n.id) ?? positions.get(n.id) ?? { x: 0, y: 0 },
      }));
      setNodes(positioned);
      setEdges(rawEdges);
      setTimeout(() => {
        rfInstance.current?.fitView({ padding: 0.12, duration: 700 });
      }, 100);
    },
    [rawNodes, rawEdges, setNodes, setEdges]
  );

  useEffect(() => {
    const currentIds = new Set(rawNodes.map((n) => n.id));
    const added = [...currentIds].filter((id) => !prevNodeIds.current.has(id));
    const removed = [...prevNodeIds.current].filter((id) => !currentIds.has(id));
    prevNodeIds.current = currentIds;

    const shouldRunLayout = !layoutDone.current || added.length > 0 || removed.length > 0;

    if (shouldRunLayout) {
      runLayout(false);
      layoutDone.current = true;
    } else {
      // Only update data (dimming, selection state, counts) without moving nodes
      setNodes((prev) =>
        prev.map((pn) => {
          const updated = rawNodes.find((n) => n.id === pn.id);
          return updated ? { ...pn, data: updated.data } : pn;
        })
      );
      setEdges(rawEdges);
    }
  }, [rawNodes, rawEdges, runLayout, setNodes, setEdges]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const type = node.type as 'person' | 'skill';
      if (selectedNodeId === node.id) {
        setSelectedNode(null, null);
      } else {
        setSelectedNode(node.id, type);
      }
    },
    [selectedNodeId, setSelectedNode]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null, null);
  }, [setSelectedNode]);

  const onNodeDragStop = useCallback((_: React.MouseEvent, node: Node) => {
    pinnedPositions.set(node.id, node.position);
  }, []);

  return (
    <div className="w-full h-full" style={{ background: 'transparent' }}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeDragStop={onNodeDragStop}
        onInit={(instance: ReactFlowInstance) => { rfInstance.current = instance; }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.25}
        maxZoom={2.5}
        nodesDraggable
        nodesConnectable={false}
        edgesFocusable={false}
        edgesReconnectable={false}
        deleteKeyCode={null}
        elementsSelectable
        style={{ background: 'transparent' }}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ style: { pointerEvents: 'visibleStroke' } }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={36}
          size={1}
          color="rgba(59, 130, 246, 0.04)"
          style={{ background: 'transparent' }}
        />
        <Controls
          style={{
            background: 'rgba(4, 10, 22, 0.88)',
            border: '1px solid rgba(59, 130, 246, 0.18)',
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        />
        <MiniMap
          style={{
            background: 'rgba(4, 10, 22, 0.88)',
            border: '1px solid rgba(59, 130, 246, 0.18)',
            borderRadius: 10,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
          nodeColor={(node) => (node.type === 'person' ? '#3b82f6' : '#0d9488')}
          maskColor="rgba(0,0,0,0.6)"
        />

        {/* Auto-layout reset button */}
        <Panel position="top-right">
          <button
            onClick={() => runLayout(true)}
            title="Reset layout"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: 'rgba(4, 10, 22, 0.88)',
              border: '1px solid rgba(59,130,246,0.2)',
              color: '#64748b',
              cursor: 'pointer',
              marginTop: 8,
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.borderColor = 'rgba(59,130,246,0.5)';
              (e.target as HTMLElement).style.color = '#60a5fa';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.borderColor = 'rgba(59,130,246,0.2)';
              (e.target as HTMLElement).style.color = '#64748b';
            }}
          >
            <LayoutGrid size={12} />
            Reset Layout
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function GraphCanvas() {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner />
    </ReactFlowProvider>
  );
}

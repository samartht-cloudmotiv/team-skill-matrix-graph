'use client';

import { useState } from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';
import { ProficiencyEdgeData } from '@/lib/types';
import { PROFICIENCY_CONFIG } from '@/lib/constants';
import { useStore } from '@/lib/store';

function ProficiencyEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const { proficiency, isDimmed } = (data as unknown as ProficiencyEdgeData) ?? {};
  const config = PROFICIENCY_CONFIG[proficiency ?? 'learning'];
  const [hovered, setHovered] = useState(false);
  const selectedNodeId = useStore((s) => s.selectedNodeId);

  // Show label when: hovered, or when source/target is the selected node
  const isConnectedToSelected = selectedNodeId === source || selectedNodeId === target;
  const showLabel = (hovered || isConnectedToSelected) && !isDimmed;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const opacity = isDimmed ? 0.04 : hovered || isConnectedToSelected
    ? Math.min(config.opacity + 0.25, 1)
    : config.opacity;
  const strokeWidth = (hovered || isConnectedToSelected) ? config.strokeWidth + 1.5 : config.strokeWidth;

  return (
    <>
      {/* Glow layer for expert + highlighted */}
      {proficiency === 'expert' && !isDimmed && (hovered || isConnectedToSelected) && (
        <path
          d={edgePath}
          fill="none"
          stroke={config.edgeColor}
          strokeWidth={strokeWidth + 6}
          strokeOpacity={0.2}
          filter="url(#glow)"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Subtle always-on glow for expert */}
      {proficiency === 'expert' && !isDimmed && (
        <path
          d={edgePath}
          fill="none"
          stroke={config.edgeColor}
          strokeWidth={strokeWidth + 3}
          strokeOpacity={0.08}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Invisible wide hit area */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={24}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'pointer' }}
      />

      {/* Actual edge line */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={config.edgeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={opacity}
        strokeDasharray={config.dashArray === 'none' ? undefined : config.dashArray}
        style={{
          pointerEvents: 'none',
          transition: 'stroke-opacity 0.25s, stroke-width 0.2s',
        }}
      />

      {/* Expert animated energy pulse */}
      {proficiency === 'expert' && !isDimmed && (
        <path
          d={edgePath}
          fill="none"
          stroke={config.edgeColor}
          strokeWidth={1.5}
          strokeOpacity={isConnectedToSelected ? 1 : 0.6}
          strokeDasharray="8 42"
          style={{
            pointerEvents: 'none',
            animation: 'dash-flow 2s linear infinite',
          }}
        />
      )}

      {/* Star label — only on hover or when connected to selected node */}
      {showLabel && (
        <g transform={`translate(${labelX}, ${labelY})`} style={{ pointerEvents: 'none' }}>
          <rect
            x={-20}
            y={-11}
            width={40}
            height={22}
            rx={5}
            fill="rgba(8, 6, 20, 0.92)"
            stroke={config.edgeColor}
            strokeWidth={0.8}
            strokeOpacity={0.7}
          />
          {/* Stars */}
          <text
            textAnchor="middle"
            y={-1}
            style={{
              fontSize: 10,
              fill: config.edgeColor,
              filter: proficiency === 'expert' ? `drop-shadow(0 0 4px ${config.edgeColor})` : 'none',
            }}
          >
            {'★'.repeat(config.stars)}{'☆'.repeat(3 - config.stars)}
          </text>
          {/* Label text */}
          <text
            textAnchor="middle"
            y={9}
            style={{ fontSize: 6.5, fill: `${config.edgeColor}bb`, letterSpacing: '0.02em' }}
          >
            {config.label.toUpperCase()}
          </text>
        </g>
      )}

      {/* Hover tooltip when not connected to selection */}
      {hovered && !isConnectedToSelected && !isDimmed && (
        <g transform={`translate(${labelX}, ${labelY - 30})`}>
          <rect x={-30} y={-10} width={60} height={20} rx={4} fill="rgba(8,6,20,0.96)" stroke={config.edgeColor} strokeWidth={0.8} />
          <text textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 9, fill: config.edgeColor, fontWeight: 600 }}>
            {config.label}
          </text>
        </g>
      )}
    </>
  );
}

export default ProficiencyEdge;

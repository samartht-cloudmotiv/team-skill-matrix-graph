'use client';

import { memo, useState } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import {
  Code2, Database, Server, Palette, Layers, GitBranch,
  Container, Workflow, Globe, Figma, Braces,
} from 'lucide-react';
import { SkillNodeData, SkillCategory } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';

const CATEGORY_ICONS: Record<SkillCategory, React.ReactNode> = {
  Frontend: <Code2 size={24} />,
  Backend: <Server size={24} />,
  DevOps: <Container size={24} />,
  Design: <Figma size={24} />,
  Data: <Database size={24} />,
  Other: <Layers size={24} />,
};

const SKILL_ICONS: Record<string, React.ReactNode> = {
  React: <Braces size={22} />,
  'Next.js': <Globe size={22} />,
  TypeScript: <Code2 size={22} />,
  'Node.js': <Server size={22} />,
  PostgreSQL: <Database size={22} />,
  Docker: <Container size={22} />,
  Figma: <Figma size={22} />,
  CSS: <Palette size={22} />,
  GraphQL: <GitBranch size={22} />,
  'CI/CD': <Workflow size={22} />,
};

const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
const HEX_SIZE = { w: 84, h: 76 };

function SkillNode({ data }: NodeProps) {
  const { name, category, isSelected, isDimmed, expertCount, totalCount } = data as unknown as SkillNodeData;
  const [hovered, setHovered] = useState(false);
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  const icon = SKILL_ICONS[name] || CATEGORY_ICONS[category];
  const active = isSelected || hovered;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: isDimmed ? 0.12 : 1,
        filter: isDimmed ? 'grayscale(1) brightness(0.3)' : 'none',
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative flex flex-col items-center"
      style={{ width: 96, cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer bloom glow */}
      <motion.div
        className="absolute"
        animate={{ opacity: active ? 0.9 : 0.2, scale: active ? 1.35 : 1.1 }}
        transition={{ duration: 0.25 }}
        style={{
          width: HEX_SIZE.w,
          height: HEX_SIZE.h,
          clipPath: HEX_CLIP,
          background: colors.border,
          filter: 'blur(14px)',
          pointerEvents: 'none',
          top: 0,
        }}
      />

      {/* Pulsing ring for selected */}
      {isSelected && (
        <motion.div
          className="absolute"
          animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          style={{
            width: HEX_SIZE.w,
            height: HEX_SIZE.h,
            clipPath: HEX_CLIP,
            background: 'transparent',
            border: `2px solid ${colors.border}`,
            pointerEvents: 'none',
            top: 0,
          }}
        />
      )}

      {/* Hex body */}
      <motion.div
        animate={{ y: hovered ? -3 : 0, scale: hovered ? 1.07 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative flex items-center justify-center"
        style={{
          width: HEX_SIZE.w,
          height: HEX_SIZE.h,
          clipPath: HEX_CLIP,
          background: active
            ? `linear-gradient(145deg, ${colors.border}60 0%, ${colors.border}25 100%)`
            : `linear-gradient(145deg, ${colors.border}35 0%, ${colors.border}10 100%)`,
        }}
      >
        {/* Inner shine */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: HEX_CLIP,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hex border ring */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: HEX_CLIP,
            border: `2px solid ${active ? colors.border : colors.border + '88'}`,
            boxShadow: active ? `inset 0 0 20px ${colors.border}40` : 'none',
          }}
        />

        {/* Icon */}
        <motion.div
          animate={{ scale: active ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          style={{
            color: active ? colors.border : `${colors.border}cc`,
            filter: active ? `drop-shadow(0 0 8px ${colors.border})` : `drop-shadow(0 0 3px ${colors.border}66)`,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {icon}
        </motion.div>
      </motion.div>

      {/* Expert count badge */}
      {expertCount > 0 && (
        <div
          className="absolute flex items-center gap-0.5"
          style={{ top: -4, right: 0, zIndex: 10 }}
        >
          <div
            style={{
              background: 'rgba(5,3,15,0.9)',
              border: '1px solid rgba(234,179,8,0.5)',
              borderRadius: 10,
              padding: '1px 5px',
              fontSize: 9,
              color: '#eab308',
              lineHeight: 1.4,
              boxShadow: '0 0 8px rgba(234,179,8,0.4)',
            }}
          >
            {'★'.repeat(Math.min(expertCount, 3))}
          </div>
        </div>
      )}

      {/* Name label */}
      <div
        className="mt-1.5 text-center"
        style={{
          background: 'rgba(5,3,15,0.82)',
          borderRadius: 6,
          padding: '2px 7px',
          border: active ? `1px solid ${colors.border}55` : '1px solid rgba(255,255,255,0.06)',
          maxWidth: 96,
          backdropFilter: 'blur(4px)',
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: active ? colors.border : `${colors.border}bb`,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 86,
            letterSpacing: '0.02em',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 8,
            color: active ? `${colors.border}bb` : `${colors.border}55`,
            marginTop: 1,
          }}
        >
          {category}
        </div>
      </div>

      {/* Hover tooltip */}
      {hovered && !isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute pointer-events-none"
          style={{
            bottom: '100%',
            marginBottom: 6,
            background: 'rgba(10, 7, 25, 0.96)',
            border: `1px solid ${colors.border}66`,
            borderRadius: 8,
            padding: '6px 10px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
            zIndex: 9999,
          }}
        >
          <div style={{ fontSize: 11, color: colors.border, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>
            {totalCount} people · {expertCount} expert · click to inspect
          </div>
        </motion.div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
    </motion.div>
  );
}

export default memo(SkillNode);

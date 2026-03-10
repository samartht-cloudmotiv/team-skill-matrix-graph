'use client';

import { memo, useState } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import {
  Code2, Database, Server, Palette, Layers,
  Container, Workflow, Globe, Figma, Braces, GitBranch,
} from 'lucide-react';
import { SkillNodeData, SkillCategory } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';

const CATEGORY_ICONS: Record<SkillCategory, React.ReactNode> = {
  Frontend: <Code2 size={22} />,
  Backend: <Server size={22} />,
  DevOps: <Container size={22} />,
  Design: <Figma size={22} />,
  Data: <Database size={22} />,
  Other: <Layers size={22} />,
};

const SKILL_ICONS: Record<string, React.ReactNode> = {
  React: <Braces size={20} />,
  'Next.js': <Globe size={20} />,
  TypeScript: <Code2 size={20} />,
  'Node.js': <Server size={20} />,
  PostgreSQL: <Database size={20} />,
  Docker: <Container size={20} />,
  Figma: <Figma size={20} />,
  CSS: <Palette size={20} />,
  GraphQL: <GitBranch size={20} />,
  'CI/CD': <Workflow size={20} />,
};

const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
const HEX_SIZE = { w: 82, h: 74 };

function SkillNode({ data }: NodeProps) {
  const { name, category, isSelected, isDimmed, expertCount, totalCount } = data as unknown as SkillNodeData;
  const [hovered, setHovered] = useState(false);
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  const icon = SKILL_ICONS[name] || CATEGORY_ICONS[category];
  const active = isSelected || hovered;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: isDimmed ? 0.12 : 1, filter: isDimmed ? 'grayscale(1) brightness(0.3)' : 'none' }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative flex flex-col items-center"
      style={{ width: 94, cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Subtle bloom — reduced compared to RPG version */}
      {active && (
        <motion.div
          className="absolute"
          animate={{ opacity: 0.5, scale: 1.2 }}
          style={{ width: HEX_SIZE.w, height: HEX_SIZE.h, clipPath: HEX_CLIP, background: colors.border, filter: 'blur(12px)', pointerEvents: 'none', top: 0 }}
        />
      )}

      {isSelected && (
        <motion.div
          className="absolute"
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          style={{ width: HEX_SIZE.w, height: HEX_SIZE.h, clipPath: HEX_CLIP, border: `1.5px solid ${colors.border}`, pointerEvents: 'none', top: 0, background: 'transparent' }}
        />
      )}

      <motion.div
        animate={{ y: hovered ? -3 : 0, scale: hovered ? 1.06 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className="relative flex items-center justify-center"
        style={{
          width: HEX_SIZE.w, height: HEX_SIZE.h, clipPath: HEX_CLIP,
          background: active
            ? `linear-gradient(145deg, ${colors.border}50 0%, ${colors.border}20 100%)`
            : `linear-gradient(145deg, ${colors.border}28 0%, ${colors.border}0a 100%)`,
        }}
      >
        <div className="absolute inset-0" style={{ clipPath: HEX_CLIP, background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)', pointerEvents: 'none' }} />
        <div className="absolute inset-0" style={{ clipPath: HEX_CLIP, border: `1.5px solid ${active ? colors.border : colors.border + '55'}` }} />
        <motion.div
          animate={{ scale: active ? 1.08 : 1 }}
          transition={{ duration: 0.2 }}
          style={{ color: active ? colors.border : `${colors.border}bb`, position: 'relative', zIndex: 2 }}
        >
          {icon}
        </motion.div>
      </motion.div>

      {/* Expert count badge — clean, no glow */}
      {expertCount > 0 && (
        <div
          className="absolute flex items-center"
          style={{ top: -3, right: 2, zIndex: 10 }}
        >
          <div style={{ background: 'rgba(3,8,18,0.92)', border: `1px solid ${colors.border}55`, borderRadius: 8, padding: '1px 5px', fontSize: 8, color: colors.border, lineHeight: 1.5 }}>
            {expertCount} expert
          </div>
        </div>
      )}

      <div className="mt-1.5 text-center" style={{ background: 'rgba(3,8,18,0.82)', borderRadius: 5, padding: '2px 6px', border: active ? `1px solid ${colors.border}44` : '1px solid rgba(255,255,255,0.05)', maxWidth: 94, backdropFilter: 'blur(4px)' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: active ? colors.border : `${colors.border}aa`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 84 }}>
          {name}
        </div>
        <div style={{ fontSize: 8, color: `${colors.border}66`, marginTop: 1 }}>
          {category}
        </div>
      </div>

      {hovered && !isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute pointer-events-none"
          style={{ bottom: '100%', marginBottom: 6, background: 'rgba(3,8,18,0.97)', border: `1px solid ${colors.border}44`, borderRadius: 7, padding: '5px 9px', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.6)', zIndex: 9999 }}
        >
          <div style={{ fontSize: 11, color: colors.border, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>{totalCount} members · {expertCount} expert</div>
        </motion.div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
    </motion.div>
  );
}

export default memo(SkillNode);

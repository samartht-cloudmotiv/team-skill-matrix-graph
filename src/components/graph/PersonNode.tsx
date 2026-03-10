'use client';

import { memo, useState } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { PersonNodeData } from '@/lib/types';
import { useStore } from '@/lib/store';
import { PALETTES } from '@/lib/constants';

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

function PersonNode({ data }: NodeProps) {
  const { name, role, isSelected, isDimmed, connectionCount } = data as unknown as PersonNodeData;
  const [hovered, setHovered] = useState(false);
  const active = isSelected || hovered;

  const palette = useStore((s) => s.palette);
  const t = PALETTES[palette];

  // Node body background
  const nodeBg = t.isDark
    ? active
      ? 'linear-gradient(145deg, #1e3a5f 0%, #0f1f3d 60%, #071020 100%)'
      : 'linear-gradient(145deg, #152843 0%, #0c1a32 60%, #060f1e 100%)'
    : active
      ? `linear-gradient(145deg, ${t.accentBg}, rgba(255,255,255,0.96))`
      : 'rgba(255,255,255,0.88)';

  const nodeBorder   = active
    ? `1.5px solid ${t.accentLight}`
    : `1px solid ${t.isDark ? t.accentLight + '38' : t.headerBorder}`;

  const nodeBoxShadow = t.isDark
    ? active
      ? `0 8px 28px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)`
      : '0 4px 14px rgba(0,0,0,0.4)'
    : active
      ? `0 6px 20px ${t.accentBg}, 0 2px 8px rgba(0,0,0,0.1)`
      : '0 2px 8px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)';

  const initialsColor = active ? t.accent : t.accentLight;

  const labelBg     = t.isDark ? 'rgba(3,8,18,0.82)' : 'rgba(255,255,255,0.94)';
  const labelBorder = active
    ? `1px solid ${t.accentBorder}`
    : t.isDark ? '1px solid rgba(255,255,255,0.05)' : `1px solid ${t.headerBorder}`;
  const nameColor   = active ? t.titleText : t.bodyText;
  const roleColor   = active ? t.accentLight : t.mutedText;

  const badgeBg     = t.isDark ? (active ? '#1d4ed8' : '#0a1628') : (active ? t.accentBg : t.cardBg);
  const badgeBorder = active ? t.accentLight : (t.isDark ? 'rgba(59,130,246,0.25)' : t.cardBorder);
  const badgeText   = active ? (t.isDark ? '#bfdbfe' : t.accent) : t.mutedText;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: isDimmed ? 0.15 : 1, filter: isDimmed ? 'grayscale(1) brightness(0.3)' : 'none' }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative flex flex-col items-center"
      style={{ width: 110, cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isSelected && (
        <motion.div
          className="absolute rounded-xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          style={{ width: 90, height: 90, borderRadius: 12, border: `2px solid ${t.accentLight}`, pointerEvents: 'none' }}
        />
      )}
      {active && (
        <div
          className="absolute rounded-xl pointer-events-none"
          style={{ width: 90, height: 90, borderRadius: 12, boxShadow: `0 0 0 2px ${t.accentLight}, 0 0 20px ${t.accentBg}` }}
        />
      )}

      <motion.div
        animate={{ y: hovered ? -3 : 0, scale: hovered ? 1.04 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className="relative flex items-center justify-center"
        style={{ width: 90, height: 90, borderRadius: 12, background: nodeBg, border: nodeBorder, boxShadow: nodeBoxShadow }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)', borderRadius: 10 }}
        />
        <span style={{ fontSize: 27, fontWeight: 700, color: initialsColor, letterSpacing: '0.04em', userSelect: 'none', lineHeight: 1 }}>
          {getInitials(name)}
        </span>
        <div
          className="absolute -top-2 -right-2 flex items-center justify-center rounded-full font-semibold"
          style={{ width: 20, height: 20, background: badgeBg, border: `1.5px solid ${badgeBorder}`, color: badgeText, fontSize: 9, boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}
        >
          {connectionCount}
        </div>
      </motion.div>

      <div
        className="mt-1.5 text-center"
        style={{ background: labelBg, borderRadius: 5, padding: '3px 7px', border: labelBorder, maxWidth: 110, backdropFilter: 'blur(4px)' }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, color: nameColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100, letterSpacing: '0.02em' }}>
          {name}
        </div>
        <div style={{ fontSize: 9, color: roleColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100, marginTop: 1 }}>
          {role}
        </div>
      </div>

      {hovered && !isSelected && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute pointer-events-none"
          style={{
            bottom: '100%', marginBottom: 6,
            background: t.panelBg, border: `1px solid ${t.accentBorder}`,
            borderRadius: 7, padding: '5px 9px', whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 9999,
          }}
        >
          <div style={{ fontSize: 11, color: t.titleText, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 9, color: t.mutedText, marginTop: 2 }}>{connectionCount} skills · click to inspect</div>
        </motion.div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="target" position={Position.Top}    style={{ opacity: 0, pointerEvents: 'none' }} />
    </motion.div>
  );
}

export default memo(PersonNode);

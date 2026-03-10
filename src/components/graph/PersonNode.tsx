'use client';

import { memo, useState } from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { PersonNodeData } from '@/lib/types';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function PersonNode({ data }: NodeProps) {
  const { name, role, isSelected, isDimmed, connectionCount } = data as unknown as PersonNodeData;
  const [hovered, setHovered] = useState(false);

  const active = isSelected || hovered;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: isDimmed ? 0.15 : 1,
        filter: isDimmed ? 'grayscale(1) brightness(0.4)' : 'none',
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="relative flex flex-col items-center"
      style={{ width: 110, cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Ambient outer glow */}
      <motion.div
        className="absolute rounded-xl"
        animate={{
          opacity: active ? 1 : 0.3,
          scale: active ? 1.15 : 1,
        }}
        transition={{ duration: 0.25 }}
        style={{
          width: 90,
          height: 90,
          borderRadius: 14,
          boxShadow: active
            ? '0 0 0 2px #eab308, 0 0 24px rgba(234,179,8,0.7), 0 0 60px rgba(234,179,8,0.3)'
            : '0 0 12px rgba(146,64,14,0.4)',
          pointerEvents: 'none',
        }}
      />

      {/* Pulsing ring for selected */}
      {isSelected && (
        <motion.div
          className="absolute rounded-xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          style={{
            width: 90,
            height: 90,
            borderRadius: 14,
            border: '2px solid #eab308',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Card body */}
      <motion.div
        animate={{ y: hovered ? -4 : 0, scale: hovered ? 1.05 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="relative flex items-center justify-center"
        style={{
          width: 90,
          height: 90,
          borderRadius: 12,
          background: active
            ? 'linear-gradient(145deg, #92400e 0%, #5c2507 50%, #2d1200 100%)'
            : 'linear-gradient(145deg, #5c2507 0%, #3a1504 50%, #1e0a02 100%)',
          border: active ? '2px solid #eab308' : '1.5px solid #78350f',
          boxShadow: active
            ? '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.12)'
            : '0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          transform: 'perspective(600px) rotateX(4deg)',
        }}
      >
        {/* Top-left shine */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
            borderRadius: 10,
          }}
        />

        {/* Initials */}
        <span
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: active ? '#fde68a' : '#d97706',
            textShadow: active
              ? '0 0 16px rgba(251,191,36,0.9), 0 2px 4px rgba(0,0,0,0.6)'
              : '0 0 8px rgba(217,119,6,0.5), 0 2px 4px rgba(0,0,0,0.6)',
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.05em',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          {getInitials(name)}
        </span>

        {/* Connection count badge */}
        <div
          className="absolute -top-2.5 -right-2.5 flex items-center justify-center rounded-full font-bold"
          style={{
            width: 22,
            height: 22,
            background: active ? '#92400e' : '#1c0a00',
            border: `1.5px solid ${active ? '#eab308' : '#78350f'}`,
            color: active ? '#fde68a' : '#d97706',
            fontSize: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
          }}
        >
          {connectionCount}
        </div>
      </motion.div>

      {/* Name label — backdrop card */}
      <div
        className="mt-2 text-center"
        style={{
          background: 'rgba(5,3,15,0.82)',
          borderRadius: 6,
          padding: '3px 8px',
          border: active ? '1px solid rgba(234,179,8,0.4)' : '1px solid rgba(120,53,14,0.25)',
          maxWidth: 110,
          backdropFilter: 'blur(4px)',
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: active ? '#fde68a' : '#c8a050',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 100,
            letterSpacing: '0.02em',
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 9,
            color: active ? '#d97706' : '#7a4f1a',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 100,
            marginTop: 1,
          }}
        >
          {role}
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
            border: '1px solid rgba(234,179,8,0.5)',
            borderRadius: 8,
            padding: '6px 10px',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
            zIndex: 9999,
          }}
        >
          <div style={{ fontSize: 11, color: '#fde68a', fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 9, color: '#d97706', marginTop: 2 }}>{connectionCount} skills · click to inspect</div>
        </motion.div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
    </motion.div>
  );
}

export default memo(PersonNode);

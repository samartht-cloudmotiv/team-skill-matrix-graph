'use client';

import { useStore } from '@/lib/store';
import { PALETTES } from '@/lib/constants';

export default function Legend() {
  const palette = useStore((s) => s.palette);
  const t = PALETTES[palette];

  return (
    <div
      className="absolute bottom-4 left-4 p-3 rounded-xl text-xs"
      style={{
        background: t.panelBg,
        border: `1px solid ${t.panelBorder}`,
        backdropFilter: 'blur(12px)',
        zIndex: 10,
        minWidth: 155,
        transition: 'background 0.4s, border-color 0.4s',
      }}
    >
      <div className="font-semibold mb-2 tracking-wider uppercase" style={{ color: t.hintText, fontSize: 9 }}>
        Legend
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 20, borderRadius: 4, background: 'linear-gradient(135deg, #1e3a5f, #0f1f3d)', border: '1.5px solid #3b82f6' }} />
          <span style={{ color: t.mutedText }}>Team Member</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 18, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', background: 'rgba(13,148,136,0.25)', border: '1px solid #0d9488' }} />
          <span style={{ color: t.mutedText }}>Skill</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 2, borderTop: '2px dashed rgba(100,116,139,0.55)' }} />
          <span style={{ color: t.mutedText }}>Learning</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 2.5, background: 'rgba(59,130,246,0.8)', borderRadius: 1 }} />
          <span style={{ color: '#60a5fa' }}>Familiar</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 3, background: '#0ea5e9', borderRadius: 1, boxShadow: '0 0 5px rgba(14,165,233,0.5)' }} />
          <span style={{ color: '#38bdf8' }}>Expert</span>
        </div>
      </div>

      <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${t.divider}`, color: t.hintText, fontSize: 9 }}>
        Click to inspect · Drag to reposition
      </div>
    </div>
  );
}

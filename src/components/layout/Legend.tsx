'use client';

export default function Legend() {
  return (
    <div
      className="absolute bottom-4 left-4 p-3 rounded-xl text-xs"
      style={{
        background: 'rgba(5, 12, 26, 0.9)',
        border: '1px solid rgba(59,130,246,0.12)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
        minWidth: 155,
      }}
    >
      <div className="font-semibold mb-2 tracking-wider uppercase" style={{ color: '#334155', fontSize: 9 }}>
        Legend
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 20, borderRadius: 4, background: 'linear-gradient(135deg, #1e3a5f, #0f1f3d)', border: '1.5px solid #3b82f6' }} />
          <span style={{ color: '#64748b' }}>Team Member</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 18, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', background: 'rgba(13,148,136,0.25)', border: '1px solid #0d9488' }} />
          <span style={{ color: '#64748b' }}>Skill</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 2, borderTop: '2px dashed rgba(100,116,139,0.55)' }} />
          <span style={{ color: '#475569' }}>Learning</span>
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

      <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: '#2d3748', fontSize: 9 }}>
        Click to inspect · Drag to reposition
      </div>
    </div>
  );
}

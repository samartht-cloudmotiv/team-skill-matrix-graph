'use client';

export default function Legend() {
  return (
    <div
      className="absolute bottom-4 left-4 p-3 rounded-xl text-xs"
      style={{
        background: 'rgba(10, 8, 22, 0.88)',
        border: '1px solid rgba(234, 179, 8, 0.15)',
        backdropFilter: 'blur(12px)',
        zIndex: 10,
        minWidth: 160,
      }}
    >
      <div className="font-semibold mb-2 tracking-wider" style={{ color: '#6b5028', fontSize: 9, textTransform: 'uppercase' }}>
        Legend
      </div>

      {/* Node types */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #4a2505, #2d1503)',
              border: '1.5px solid #92400e',
              boxShadow: '0 0 6px rgba(146,64,14,0.4)',
            }}
          />
          <span style={{ color: '#a07030' }}>Hero (Person)</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 20,
              height: 18,
              clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.5), rgba(16,185,129,0.2))',
              border: '1px solid #10b981',
            }}
          />
          <span style={{ color: '#6ee7b7' }}>Skill (Ability)</span>
        </div>
      </div>

      {/* Proficiency */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 2, borderTop: '2px dashed rgba(251,191,36,0.4)' }} />
          <span style={{ color: '#666' }}>★ Learning</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 2.5, background: 'rgba(245,158,11,0.7)' }} />
          <span style={{ color: '#888' }}>★★ Familiar</span>
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 3.5, background: '#eab308', boxShadow: '0 0 6px rgba(234,179,8,0.6)' }} />
          <span style={{ color: '#eab308' }}>★★★ Expert</span>
        </div>
      </div>

      <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#444', fontSize: 9 }}>
        Click node to inspect · Drag to reposition
      </div>
    </div>
  );
}

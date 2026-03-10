'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, AlertTriangle, Users, Layers } from 'lucide-react';
import { useStore } from '@/lib/store';
import { CATEGORY_COLORS, PROFICIENCY_CONFIG } from '@/lib/constants';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SummaryPanel({ open, onClose }: Props) {
  const { people, skills, connections } = useStore();

  const stats = useMemo(() => {
    // Skill popularity (by connection count)
    const skillCounts = skills.map((s) => ({
      skill: s,
      total: connections.filter((c) => c.skillId === s.id).length,
      expert: connections.filter((c) => c.skillId === s.id && c.proficiency === 'expert').length,
    })).sort((a, b) => b.total - a.total);

    // Skill gaps (only 1 person)
    const gaps = skillCounts.filter((sc) => sc.total === 1);

    // Proficiency distribution
    const expertTotal = connections.filter((c) => c.proficiency === 'expert').length;
    const familiarTotal = connections.filter((c) => c.proficiency === 'familiar').length;
    const learningTotal = connections.filter((c) => c.proficiency === 'learning').length;
    const totalConns = connections.length;

    // Coverage score
    const maxPossible = people.length * skills.length;
    const coveragePct = maxPossible > 0 ? Math.round((totalConns / maxPossible) * 100) : 0;

    // Person with most skills
    const personRanking = people.map((p) => ({
      person: p,
      count: connections.filter((c) => c.personId === p.id).length,
      expertCount: connections.filter((c) => c.personId === p.id && c.proficiency === 'expert').length,
    })).sort((a, b) => b.count - a.count);

    return { skillCounts, gaps, expertTotal, familiarTotal, learningTotal, totalConns, coveragePct, personRanking };
  }, [people, skills, connections]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute left-1/2 top-14"
          style={{
            transform: 'translateX(-50%)',
            width: Math.min(700, window.innerWidth - 40),
            background: 'rgba(10, 8, 22, 0.95)',
            border: '1px solid rgba(234, 179, 8, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: 16,
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            zIndex: 30,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-3 sticky top-0"
            style={{
              background: 'rgba(10,8,22,0.98)',
              borderBottom: '1px solid rgba(234,179,8,0.15)',
              borderRadius: '16px 16px 0 0',
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 16 }}>🏰</span>
              <span className="font-bold tracking-wider text-sm" style={{ color: '#fbbf24', fontFamily: 'serif' }}>
                GUILD STATS
              </span>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
              <X size={14} style={{ color: '#666' }} />
            </button>
          </div>

          <div className="p-5 grid grid-cols-2 gap-4 md:grid-cols-4">
            {/* Quick stats */}
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
              <div className="text-2xl font-bold" style={{ color: '#fbbf24' }}>{people.length}</div>
              <div className="text-xs mt-0.5 flex items-center justify-center gap-1" style={{ color: '#a07030' }}>
                <Users size={10} /> Heroes
              </div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div className="text-2xl font-bold" style={{ color: '#10b981' }}>{skills.length}</div>
              <div className="text-xs mt-0.5 flex items-center justify-center gap-1" style={{ color: '#6ee7b7' }}>
                <Layers size={10} /> Skills
              </div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="text-2xl font-bold" style={{ color: '#818cf8' }}>{stats.totalConns}</div>
              <div className="text-xs mt-0.5" style={{ color: '#a5b4fc' }}>Connections</div>
            </div>
            <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.15)' }}>
              <div className="text-2xl font-bold" style={{ color: '#eab308' }}>{stats.coveragePct}%</div>
              <div className="text-xs mt-0.5" style={{ color: '#a07030' }}>Coverage</div>
            </div>
          </div>

          <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Proficiency distribution */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#6b5028' }}>
                <TrendingUp size={11} /> Proficiency Distribution
              </div>
              {stats.totalConns > 0 && (
                <>
                  <div className="flex rounded-full overflow-hidden h-3 mb-3">
                    {stats.expertTotal > 0 && (
                      <div style={{ flex: stats.expertTotal, background: '#eab308', boxShadow: '0 0 8px rgba(234,179,8,0.4)' }} />
                    )}
                    {stats.familiarTotal > 0 && (
                      <div style={{ flex: stats.familiarTotal, background: '#f59e0b', marginLeft: 2 }} />
                    )}
                    {stats.learningTotal > 0 && (
                      <div style={{ flex: stats.learningTotal, background: 'rgba(251,191,36,0.3)', marginLeft: 2 }} />
                    )}
                  </div>
                  <div className="space-y-1">
                    {[
                      { label: 'Expert', count: stats.expertTotal, color: '#eab308' },
                      { label: 'Familiar', count: stats.familiarTotal, color: '#f59e0b' },
                      { label: 'Learning', count: stats.learningTotal, color: '#fbbf24' },
                    ].map(({ label, count, color }) => (
                      <div key={label} className="flex items-center justify-between text-xs">
                        <span style={{ color: '#666' }}>{'★'.repeat(label === 'Expert' ? 3 : label === 'Familiar' ? 2 : 1)} {label}</span>
                        <span style={{ color }}>{count} ({Math.round(count / stats.totalConns * 100)}%)</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Skill gaps */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#ef4444' }}>
                <AlertTriangle size={11} /> Skill Gaps (Single Owner)
              </div>
              {stats.gaps.length === 0 ? (
                <div className="text-xs" style={{ color: '#444' }}>No single-owner skills 🎉</div>
              ) : (
                <div className="space-y-1.5">
                  {stats.gaps.map(({ skill }) => {
                    const conn = connections.find((c) => c.skillId === skill.id);
                    const person = people.find((p) => p.id === conn?.personId);
                    const colors = CATEGORY_COLORS[skill.category];
                    return (
                      <div key={skill.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span style={{ width: 8, height: 8, borderRadius: 2, background: colors.border, display: 'inline-block' }} />
                          <span className="text-xs" style={{ color: '#ccc' }}>{skill.name}</span>
                        </div>
                        <span className="text-xs" style={{ color: '#ef4444' }}>Only {person?.name ?? '?'}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top skills leaderboard */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b5028' }}>
                🏆 Most Common Skills
              </div>
              <div className="space-y-2">
                {stats.skillCounts.slice(0, 5).map(({ skill, total, expert }, i) => {
                  const colors = CATEGORY_COLORS[skill.category];
                  return (
                    <div key={skill.id} className="flex items-center gap-2">
                      <span className="text-xs font-bold w-4 text-right" style={{ color: '#555' }}>{i + 1}</span>
                      <div className="flex-1 flex items-center gap-1.5">
                        <span style={{ width: 8, height: 8, background: colors.border, display: 'inline-block', borderRadius: 2 }} />
                        <span className="text-xs truncate" style={{ color: '#ccc' }}>{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {expert > 0 && <span className="text-xs" style={{ color: '#eab308' }}>★{expert}</span>}
                        <span className="text-xs font-semibold" style={{ color: colors.border }}>{total}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hero ranking */}
            <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b5028' }}>
                ⚔️ Hero Rankings
              </div>
              <div className="space-y-2">
                {stats.personRanking.slice(0, 5).map(({ person, count, expertCount }, i) => (
                  <div key={person.id} className="flex items-center gap-2">
                    <span className="text-xs font-bold w-4 text-right" style={{ color: '#555' }}>{i + 1}</span>
                    <div
                      className="flex-shrink-0 flex items-center justify-center rounded font-bold"
                      style={{
                        width: 22,
                        height: 22,
                        background: 'linear-gradient(135deg, #78350f, #451a03)',
                        border: '1px solid #92400e',
                        fontSize: 8,
                        color: '#fbbf24',
                      }}
                    >
                      {person.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate" style={{ color: '#e2c87a' }}>{person.name}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {expertCount > 0 && <span className="text-xs" style={{ color: '#eab308' }}>★{expertCount}</span>}
                      <span className="text-xs font-semibold" style={{ color: '#d97706' }}>{count} skills</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

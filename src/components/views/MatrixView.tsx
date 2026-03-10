'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { PROFICIENCY_CONFIG, CATEGORY_COLORS, SKILL_CATEGORIES } from '@/lib/constants';
import { Proficiency, SkillCategory } from '@/lib/types';

const CELL_STYLE: Record<Proficiency, { bg: string; text: string; border: string; glow: string }> = {
  learning: {
    bg: 'rgba(100,116,139,0.14)',
    text: '#94a3b8',
    border: 'rgba(100,116,139,0.35)',
    glow: 'rgba(100,116,139,0.2)',
  },
  familiar: {
    bg: 'rgba(59,130,246,0.15)',
    text: '#60a5fa',
    border: 'rgba(59,130,246,0.4)',
    glow: 'rgba(59,130,246,0.2)',
  },
  expert: {
    bg: 'rgba(14,165,233,0.16)',
    text: '#38bdf8',
    border: 'rgba(14,165,233,0.45)',
    glow: 'rgba(14,165,233,0.22)',
  },
};

interface HoveredCell {
  personId: string;
  skillId: string;
}

export default function MatrixView() {
  const { people, skills, connections } = useStore();
  const [hoveredCell, setHoveredCell] = useState<HoveredCell | null>(null);
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const sortedPeople = useMemo(
    () => [...people].sort((a, b) => a.name.localeCompare(b.name)),
    [people]
  );

  const sortedSkills = useMemo(
    () =>
      [...skills].sort((a, b) => {
        const catOrder = SKILL_CATEGORIES.indexOf(a.category as SkillCategory) -
                         SKILL_CATEGORIES.indexOf(b.category as SkillCategory);
        return catOrder !== 0 ? catOrder : a.name.localeCompare(b.name);
      }),
    [skills]
  );

  // personId → skillId → proficiency
  const lookup = useMemo(() => {
    const map = new Map<string, Map<string, Proficiency>>();
    connections.forEach((c) => {
      if (!map.has(c.personId)) map.set(c.personId, new Map());
      map.get(c.personId)!.set(c.skillId, c.proficiency);
    });
    return map;
  }, [connections]);

  // Per-person stats
  const personStats = useMemo(() => {
    const stats = new Map<string, { total: number; expert: number; familiar: number; learning: number }>();
    sortedPeople.forEach((p) => {
      const conns = lookup.get(p.id);
      let expert = 0, familiar = 0, learning = 0;
      conns?.forEach((prof) => {
        if (prof === 'expert') expert++;
        else if (prof === 'familiar') familiar++;
        else learning++;
      });
      stats.set(p.id, { total: (conns?.size ?? 0), expert, familiar, learning });
    });
    return stats;
  }, [sortedPeople, lookup]);

  // Per-skill stats
  const skillStats = useMemo(() => {
    const stats = new Map<string, { total: number; expert: number }>();
    sortedSkills.forEach((sk) => {
      let total = 0, expert = 0;
      connections.forEach((c) => {
        if (c.skillId === sk.id) {
          total++;
          if (c.proficiency === 'expert') expert++;
        }
      });
      stats.set(sk.id, { total, expert });
    });
    return stats;
  }, [sortedSkills, connections]);

  if (people.length === 0 || skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: '#475569' }}>
        <div className="text-center gap-3 flex flex-col items-center">
          <div className="text-sm tracking-widest" style={{ color: '#64748b' }}>
            No data to display
          </div>
          <div className="text-xs" style={{ color: '#475569' }}>Add members and skills to see the matrix</div>
        </div>
      </div>
    );
  }

  const CELL_W = 52;
  const CELL_H = 40;
  const ROW_LABEL_W = 200;
  const HEADER_H = 110;

  return (
    <div
      className="w-full h-full overflow-auto"
      style={{ paddingTop: 60, paddingBottom: 32, paddingLeft: 24, paddingRight: 24 }}
    >
      {/* Title */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="text-base font-semibold tracking-widest uppercase"
          style={{ color: '#e2e8f0', letterSpacing: '0.1em' }}
        >
          Skill Matrix
        </div>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(to right, rgba(59,130,246,0.2), transparent)' }} />
        <div className="text-xs" style={{ color: '#475569' }}>
          {people.length} members · {skills.length} skills · {connections.length} links
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-4 flex-wrap">
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: '#334155', minWidth: 80 }}
        >
          Legend
        </span>
        {(Object.entries(CELL_STYLE) as [Proficiency, typeof CELL_STYLE[Proficiency]][]).map(([level, s]) => (
          <div key={level} className="flex items-center gap-1.5">
            <div
              style={{
                width: 22, height: 16, borderRadius: 4,
                background: s.bg, border: `1px solid ${s.border}`,
              }}
            />
            <span className="text-xs capitalize" style={{ color: s.text }}>
              {'★'.repeat(PROFICIENCY_CONFIG[level].stars)}
              {'☆'.repeat(3 - PROFICIENCY_CONFIG[level].stars)}
              {' '}{level}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div style={{ width: 22, height: 16, borderRadius: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <span className="text-xs" style={{ color: '#475569' }}>No skill</span>
        </div>
        {/* Category dots */}
        <div className="flex items-center gap-3 ml-4 border-l pl-4" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {SKILL_CATEGORIES.filter((cat) => sortedSkills.some((s) => s.category === cat)).map((cat) => (
            <div key={cat} className="flex items-center gap-1">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: CATEGORY_COLORS[cat as SkillCategory]?.border ?? '#888' }} />
              <span className="text-xs" style={{ color: '#64748b' }}>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Matrix table */}
      <div style={{ display: 'inline-block', minWidth: 'max-content' }}>
        {/* Skill header row */}
        <div className="flex" style={{ paddingLeft: ROW_LABEL_W }}>
          {sortedSkills.map((skill) => {
            const catColor = CATEGORY_COLORS[skill.category as SkillCategory];
            const isHighlighted = hoveredSkill === skill.id;
            const stat = skillStats.get(skill.id);
            return (
              <div
                key={skill.id}
                style={{ width: CELL_W, flexShrink: 0, height: HEADER_H, position: 'relative' }}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                {/* Rotated label */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 18,
                    left: '50%',
                    transform: 'translateX(-50%) rotate(-45deg)',
                    transformOrigin: 'center bottom',
                    whiteSpace: 'nowrap',
                    fontSize: 10,
                    color: isHighlighted ? (catColor?.border ?? '#60a5fa') : '#475569',
                    fontWeight: isHighlighted ? 700 : 400,
                    letterSpacing: '0.04em',
                    transition: 'color 0.15s',
                    pointerEvents: 'none',
                  }}
                >
                  {skill.name}
                </div>
                {/* Category dot at bottom */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: isHighlighted ? 10 : 7,
                    height: isHighlighted ? 10 : 7,
                    borderRadius: '50%',
                    background: catColor?.border ?? '#888',
                    boxShadow: isHighlighted ? `0 0 8px ${catColor?.glow}` : 'none',
                    transition: 'all 0.15s',
                  }}
                />
                {/* Skill usage count */}
                {isHighlighted && (
                  <div
                    style={{
                      position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
                      fontSize: 9, color: catColor?.border ?? '#888', whiteSpace: 'nowrap',
                      background: 'rgba(4,10,22,0.95)', borderRadius: 3, padding: '1px 4px',
                      border: `1px solid ${catColor?.border}33`,
                    }}
                  >
                    {stat?.total ?? 0} / {stat?.expert ?? 0} exp
                  </div>
                )}
              </div>
            );
          })}
          {/* Totals header */}
          <div style={{ width: 72, flexShrink: 0, height: HEADER_H, display: 'flex', alignItems: 'flex-end', paddingBottom: 18 }}>
            <span style={{ fontSize: 9, color: '#475569', letterSpacing: '0.05em' }}>TOTAL</span>
          </div>
        </div>

        {/* Separator line */}
        <div
          style={{
            height: 1,
            marginLeft: ROW_LABEL_W,
            background: 'linear-gradient(to right, rgba(59,130,246,0.2), rgba(59,130,246,0.04))',
            marginBottom: 2,
          }}
        />

        {/* Person rows */}
        {sortedPeople.map((person, pi) => {
          const personConns = lookup.get(person.id);
          const stats = personStats.get(person.id);
          const isPersonHovered = hoveredPerson === person.id;
          return (
            <motion.div
              key={person.id}
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: pi * 0.04, duration: 0.3 }}
              style={{ marginBottom: 3 }}
              onMouseEnter={() => setHoveredPerson(person.id)}
              onMouseLeave={() => setHoveredPerson(null)}
            >
              {/* Person label */}
              <div
                style={{
                  width: ROW_LABEL_W,
                  flexShrink: 0,
                  paddingRight: 14,
                  textAlign: 'right',
                  borderRight: `1px solid ${isPersonHovered ? 'rgba(59,130,246,0.35)' : 'rgba(59,130,246,0.12)'}`,
                  transition: 'border-color 0.15s',
                  paddingTop: 2,
                  paddingBottom: 2,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: isPersonHovered ? '#60a5fa' : '#94a3b8',
                    fontWeight: 600,
                    transition: 'color 0.15s',
                    letterSpacing: '0.02em',
                  }}
                >
                  {person.name}
                </div>
                <div style={{ fontSize: 9, color: '#475569', marginTop: 1 }}>{person.role}</div>
              </div>

              {/* Skill cells */}
              {sortedSkills.map((skill) => {
                const proficiency = personConns?.get(skill.id);
                const style = proficiency ? CELL_STYLE[proficiency] : null;
                const stars = proficiency ? PROFICIENCY_CONFIG[proficiency].stars : 0;
                const isCellHovered =
                  hoveredCell?.personId === person.id && hoveredCell?.skillId === skill.id;
                const isRowHighlighted = isPersonHovered;
                const isColHighlighted = hoveredSkill === skill.id;

                return (
                  <div
                    key={skill.id}
                    onMouseEnter={() => setHoveredCell({ personId: person.id, skillId: skill.id })}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      width: CELL_W,
                      flexShrink: 0,
                      padding: 3,
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: CELL_W - 6,
                        height: CELL_H,
                        borderRadius: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 2,
                        background: style
                          ? isCellHovered
                            ? style.bg.replace('0.18', '0.35').replace('0.22', '0.4')
                            : isRowHighlighted || isColHighlighted
                            ? style.bg.replace('0.18', '0.28').replace('0.22', '0.32')
                            : style.bg
                          : isRowHighlighted || isColHighlighted
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(255,255,255,0.025)',
                        border: `1px solid ${
                          style
                            ? isCellHovered
                              ? style.border
                              : style.border.replace('0.45', '0.25').replace('0.5', '0.3').replace('0.55', '0.3')
                            : isRowHighlighted || isColHighlighted
                            ? 'rgba(255,255,255,0.1)'
                            : 'rgba(255,255,255,0.05)'
                        }`,
                        boxShadow: isCellHovered && style ? `0 0 10px ${style.glow}` : 'none',
                        transition: 'all 0.15s',
                        transform: isCellHovered && proficiency ? 'scale(1.08)' : 'scale(1)',
                        cursor: proficiency ? 'default' : 'default',
                      }}
                    >
                      {proficiency && (
                        <>
                          <div style={{ fontSize: 9, color: style?.text, lineHeight: 1 }}>
                            {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
                          </div>
                          <div
                            style={{
                              fontSize: 7,
                              color: style?.text,
                              opacity: 0.75,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              lineHeight: 1,
                            }}
                          >
                            {proficiency}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Hover tooltip */}
                    {isCellHovered && proficiency && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 4px)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'rgba(4,10,22,0.98)',
                          border: `1px solid ${CELL_STYLE[proficiency].border}`,
                          borderRadius: 6,
                          padding: '5px 9px',
                          zIndex: 200,
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                          boxShadow: `0 4px 16px ${CELL_STYLE[proficiency].glow}`,
                        }}
                      >
                        <div style={{ fontSize: 11, color: CELL_STYLE[proficiency].text, fontWeight: 600 }}>
                          {person.name}
                        </div>
                        <div style={{ fontSize: 9, color: '#888', marginTop: 2 }}>
                          {skill.name} · <span style={{ color: CELL_STYLE[proficiency].text }}>{proficiency}</span>
                        </div>
                        <div style={{ fontSize: 9, color: '#555', marginTop: 1 }}>{skill.category}</div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Row totals */}
              <div
                style={{
                  width: 72,
                  flexShrink: 0,
                  paddingLeft: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                {/* Stacked mini progress bar */}
                <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', width: 56, background: 'rgba(255,255,255,0.04)' }}>
                  {stats && stats.total > 0 && (
                    <>
                      <div style={{ flex: stats.expert, background: '#0ea5e9' }} />
                      <div style={{ flex: stats.familiar, background: '#3b82f6' }} />
                      <div style={{ flex: stats.learning, background: 'rgba(100,116,139,0.5)' }} />
                    </>
                  )}
                </div>
                <div style={{ fontSize: 8, color: '#475569' }}>
                  {stats?.total ?? 0} skill{(stats?.total ?? 0) !== 1 ? 's' : ''}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Bottom totals row */}
        <div
          style={{
            height: 1,
            marginLeft: ROW_LABEL_W,
            background: 'linear-gradient(to right, rgba(59,130,246,0.2), rgba(59,130,246,0.04))',
            marginTop: 4,
            marginBottom: 6,
          }}
        />
        <div className="flex" style={{ paddingLeft: ROW_LABEL_W }}>
          {sortedSkills.map((skill) => {
            const stat = skillStats.get(skill.id);
            const catColor = CATEGORY_COLORS[skill.category as SkillCategory];
            return (
              <div key={skill.id} style={{ width: CELL_W, flexShrink: 0, padding: 3 }}>
                <div
                  style={{
                    width: CELL_W - 6,
                    height: 28,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${catColor?.border ?? '#888'}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <div style={{ fontSize: 9, color: catColor?.border ?? '#888', fontWeight: 600 }}>
                    {stat?.total ?? 0}
                  </div>
                  {(stat?.expert ?? 0) > 0 && (
                    <div style={{ fontSize: 7, color: '#38bdf8' }}>{stat?.expert} exp</div>
                  )}
                </div>
              </div>
            );
          })}
          <div style={{ width: 72 }} />
        </div>
        <div className="flex pl-0 mt-1" style={{ paddingLeft: ROW_LABEL_W }}>
          <span style={{ fontSize: 8, color: '#475569', letterSpacing: '0.05em', paddingLeft: 6 }}>
            PEOPLE PER SKILL
          </span>
        </div>
      </div>
    </div>
  );
}

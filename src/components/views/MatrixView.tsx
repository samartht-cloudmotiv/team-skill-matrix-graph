'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { PROFICIENCY_CONFIG, CATEGORY_COLORS, SKILL_CATEGORIES, PALETTES } from '@/lib/constants';
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
  const { people, skills, connections, palette } = useStore();
  const t = PALETTES[palette];
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

  const lookup = useMemo(() => {
    const map = new Map<string, Map<string, Proficiency>>();
    connections.forEach((c) => {
      if (!map.has(c.personId)) map.set(c.personId, new Map());
      map.get(c.personId)!.set(c.skillId, c.proficiency);
    });
    return map;
  }, [connections]);

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

  const skillStats = useMemo(() => {
    const stats = new Map<string, { total: number; expert: number }>();
    sortedSkills.forEach((sk) => {
      let total = 0, expert = 0;
      connections.forEach((c) => {
        if (c.skillId === sk.id) { total++; if (c.proficiency === 'expert') expert++; }
      });
      stats.set(sk.id, { total, expert });
    });
    return stats;
  }, [sortedSkills, connections]);

  if (people.length === 0 || skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center gap-3 flex flex-col items-center">
          <div className="text-sm tracking-widest" style={{ color: t.mutedText }}>No data to display</div>
          <div className="text-xs" style={{ color: t.hintText }}>Add members and skills to see the matrix</div>
        </div>
      </div>
    );
  }

  const CELL_W      = 70;
  const CELL_H      = 54;
  const ROW_LABEL_W = 230;
  const HEADER_H    = 135;

  // Empty cell colors adapt to theme
  const emptyCellBg     = t.isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)';
  const emptyCellHovBg  = t.isDark ? 'rgba(255,255,255,0.05)'  : 'rgba(0,0,0,0.05)';
  const emptyCellBorder = t.isDark ? 'rgba(255,255,255,0.05)'  : 'rgba(0,0,0,0.07)';
  const emptyCellHovBdr = t.isDark ? 'rgba(255,255,255,0.1)'   : 'rgba(0,0,0,0.12)';

  return (
    <div
      className="w-full h-full overflow-auto"
      style={{ paddingTop: 62, paddingBottom: 32, paddingLeft: 28, paddingRight: 28 }}
    >
      {/* Title */}
      <div className="mb-5 flex items-center gap-3">
        <div
          className="text-base font-semibold tracking-widest uppercase"
          style={{ color: t.titleText, letterSpacing: '0.1em' }}
        >
          Skill Matrix
        </div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${t.headerBorder}, transparent)` }} />
        <div className="text-xs" style={{ color: t.mutedText }}>
          {people.length} members · {skills.length} skills · {connections.length} links
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 mb-5 flex-wrap">
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: t.hintText, minWidth: 80 }}>
          Legend
        </span>
        {(Object.entries(CELL_STYLE) as [Proficiency, typeof CELL_STYLE[Proficiency]][]).map(([level, s]) => (
          <div key={level} className="flex items-center gap-1.5">
            <div style={{ width: 24, height: 18, borderRadius: 4, background: s.bg, border: `1px solid ${s.border}` }} />
            <span className="text-xs capitalize" style={{ color: s.text }}>
              {'★'.repeat(PROFICIENCY_CONFIG[level].stars)}{'☆'.repeat(3 - PROFICIENCY_CONFIG[level].stars)} {level}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div style={{ width: 24, height: 18, borderRadius: 4, background: emptyCellBg, border: `1px solid ${emptyCellBorder}` }} />
          <span className="text-xs" style={{ color: t.mutedText }}>No skill</span>
        </div>
        <div className="flex items-center gap-3 ml-4 border-l pl-4" style={{ borderColor: t.divider }}>
          {SKILL_CATEGORIES.filter((cat) => sortedSkills.some((s) => s.category === cat)).map((cat) => (
            <div key={cat} className="flex items-center gap-1">
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: CATEGORY_COLORS[cat as SkillCategory]?.border ?? '#888' }} />
              <span className="text-xs" style={{ color: t.mutedText }}>{cat}</span>
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
                <div
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: '50%',
                    transform: 'translateX(-50%) rotate(-45deg)',
                    transformOrigin: 'center bottom',
                    whiteSpace: 'nowrap',
                    fontSize: 11,
                    color: isHighlighted ? (catColor?.border ?? t.accentLight) : t.mutedText,
                    fontWeight: isHighlighted ? 700 : 400,
                    letterSpacing: '0.04em',
                    transition: 'color 0.15s',
                    pointerEvents: 'none',
                  }}
                >
                  {skill.name}
                </div>
                <div
                  style={{
                    position: 'absolute', bottom: 5, left: '50%', transform: 'translateX(-50%)',
                    width: isHighlighted ? 11 : 8, height: isHighlighted ? 11 : 8,
                    borderRadius: '50%', background: catColor?.border ?? '#888',
                    boxShadow: isHighlighted ? `0 0 8px ${catColor?.glow}` : 'none',
                    transition: 'all 0.15s',
                  }}
                />
                {isHighlighted && (
                  <div
                    style={{
                      position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
                      fontSize: 9, color: catColor?.border ?? '#888', whiteSpace: 'nowrap',
                      background: t.panelBg, borderRadius: 3, padding: '1px 5px',
                      border: `1px solid ${catColor?.border}33`,
                    }}
                  >
                    {stat?.total ?? 0} / {stat?.expert ?? 0} exp
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ width: 80, flexShrink: 0, height: HEADER_H, display: 'flex', alignItems: 'flex-end', paddingBottom: 20 }}>
            <span style={{ fontSize: 10, color: t.mutedText, letterSpacing: '0.05em' }}>TOTAL</span>
          </div>
        </div>

        {/* Separator */}
        <div style={{ height: 1, marginLeft: ROW_LABEL_W, background: `linear-gradient(to right, ${t.headerBorder}, transparent)`, marginBottom: 3 }} />

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
              style={{ marginBottom: 4 }}
              onMouseEnter={() => setHoveredPerson(person.id)}
              onMouseLeave={() => setHoveredPerson(null)}
            >
              {/* Person label */}
              <div
                style={{
                  width: ROW_LABEL_W, flexShrink: 0, paddingRight: 16,
                  textAlign: 'right',
                  borderRight: `1px solid ${isPersonHovered ? t.accentBorder : t.headerBorder}`,
                  transition: 'border-color 0.15s',
                  paddingTop: 3, paddingBottom: 3,
                }}
              >
                <div style={{ fontSize: 13, color: isPersonHovered ? t.accentLight : t.bodyText, fontWeight: 600, transition: 'color 0.15s', letterSpacing: '0.02em' }}>
                  {person.name}
                </div>
                <div style={{ fontSize: 10, color: t.mutedText, marginTop: 1 }}>{person.role}</div>
              </div>

              {/* Skill cells */}
              {sortedSkills.map((skill) => {
                const proficiency = personConns?.get(skill.id);
                const cellStyle   = proficiency ? CELL_STYLE[proficiency] : null;
                const stars       = proficiency ? PROFICIENCY_CONFIG[proficiency].stars : 0;
                const isCellHovered = hoveredCell?.personId === person.id && hoveredCell?.skillId === skill.id;
                const isRowHl = isPersonHovered;
                const isColHl = hoveredSkill === skill.id;

                return (
                  <div
                    key={skill.id}
                    onMouseEnter={() => setHoveredCell({ personId: person.id, skillId: skill.id })}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{ width: CELL_W, flexShrink: 0, padding: 3, position: 'relative' }}
                  >
                    <div
                      style={{
                        width: CELL_W - 6, height: CELL_H, borderRadius: 6,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', gap: 3,
                        background: cellStyle
                          ? isCellHovered
                            ? cellStyle.bg.replace('0.14', '0.32').replace('0.15', '0.32').replace('0.16', '0.32')
                            : isRowHl || isColHl
                            ? cellStyle.bg.replace('0.14', '0.24').replace('0.15', '0.24').replace('0.16', '0.24')
                            : cellStyle.bg
                          : isRowHl || isColHl ? emptyCellHovBg : emptyCellBg,
                        border: `1px solid ${cellStyle
                          ? isCellHovered
                            ? cellStyle.border
                            : cellStyle.border.replace('0.45', '0.28').replace('0.4', '0.25').replace('0.35', '0.22')
                          : isRowHl || isColHl ? emptyCellHovBdr : emptyCellBorder
                        }`,
                        boxShadow: isCellHovered && cellStyle ? `0 0 12px ${cellStyle.glow}` : 'none',
                        transition: 'all 0.15s',
                        transform: isCellHovered && proficiency ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {proficiency && (
                        <>
                          <div style={{ fontSize: 11, color: cellStyle?.text, lineHeight: 1 }}>
                            {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
                          </div>
                          <div style={{ fontSize: 8, color: cellStyle?.text, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1 }}>
                            {proficiency}
                          </div>
                        </>
                      )}
                    </div>

                    {isCellHovered && proficiency && (
                      <div
                        style={{
                          position: 'absolute', bottom: 'calc(100% + 4px)', left: '50%',
                          transform: 'translateX(-50%)',
                          background: t.panelBg, border: `1px solid ${CELL_STYLE[proficiency].border}`,
                          borderRadius: 6, padding: '6px 10px', zIndex: 200,
                          whiteSpace: 'nowrap', pointerEvents: 'none',
                          boxShadow: `0 4px 16px ${CELL_STYLE[proficiency].glow}`,
                        }}
                      >
                        <div style={{ fontSize: 12, color: CELL_STYLE[proficiency].text, fontWeight: 600 }}>{person.name}</div>
                        <div style={{ fontSize: 10, color: t.mutedText, marginTop: 2 }}>
                          {skill.name} · <span style={{ color: CELL_STYLE[proficiency].text }}>{proficiency}</span>
                        </div>
                        <div style={{ fontSize: 9, color: t.hintText, marginTop: 1 }}>{skill.category}</div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Row totals */}
              <div style={{ width: 80, flexShrink: 0, paddingLeft: 12, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{ display: 'flex', height: 7, borderRadius: 4, overflow: 'hidden', width: 62, background: emptyCellBg }}>
                  {stats && stats.total > 0 && (
                    <>
                      <div style={{ flex: stats.expert,   background: '#0ea5e9' }} />
                      <div style={{ flex: stats.familiar, background: '#3b82f6' }} />
                      <div style={{ flex: stats.learning, background: 'rgba(100,116,139,0.5)' }} />
                    </>
                  )}
                </div>
                <div style={{ fontSize: 9, color: t.mutedText }}>
                  {stats?.total ?? 0} skill{(stats?.total ?? 0) !== 1 ? 's' : ''}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Bottom totals row */}
        <div style={{ height: 1, marginLeft: ROW_LABEL_W, background: `linear-gradient(to right, ${t.headerBorder}, transparent)`, marginTop: 5, marginBottom: 7 }} />
        <div className="flex" style={{ paddingLeft: ROW_LABEL_W }}>
          {sortedSkills.map((skill) => {
            const stat = skillStats.get(skill.id);
            const catColor = CATEGORY_COLORS[skill.category as SkillCategory];
            return (
              <div key={skill.id} style={{ width: CELL_W, flexShrink: 0, padding: 3 }}>
                <div
                  style={{
                    width: CELL_W - 6, height: 32, borderRadius: 5,
                    background: t.cardBg, border: `1px solid ${catColor?.border ?? '#888'}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 1,
                  }}
                >
                  <div style={{ fontSize: 10, color: catColor?.border ?? '#888', fontWeight: 600 }}>{stat?.total ?? 0}</div>
                  {(stat?.expert ?? 0) > 0 && (
                    <div style={{ fontSize: 8, color: '#38bdf8' }}>{stat?.expert} exp</div>
                  )}
                </div>
              </div>
            );
          })}
          <div style={{ width: 80 }} />
        </div>
        <div className="flex mt-1.5" style={{ paddingLeft: ROW_LABEL_W }}>
          <span style={{ fontSize: 9, color: t.hintText, letterSpacing: '0.05em', paddingLeft: 6 }}>PEOPLE PER SKILL</span>
        </div>
      </div>
    </div>
  );
}

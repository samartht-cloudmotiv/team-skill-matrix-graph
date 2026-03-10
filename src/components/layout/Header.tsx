'use client';

import { useState } from 'react';
import { Plus, Users, Layers, Zap, BarChart3, Share2, Grid3x3, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import PersonForm from '@/components/forms/PersonForm';
import SkillForm from '@/components/forms/SkillForm';
import ConnectionForm from '@/components/forms/ConnectionForm';
import { useStore } from '@/lib/store';
import { PALETTES } from '@/lib/constants';
import { ColorPalette } from '@/lib/types';

interface Props {
  onToggleSummary: () => void;
  summaryOpen: boolean;
  activeView: 'graph' | 'matrix';
  onViewChange: (view: 'graph' | 'matrix') => void;
}

export default function Header({ onToggleSummary, summaryOpen, activeView, onViewChange }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [personFormOpen, setPersonFormOpen] = useState(false);
  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [connFormOpen, setConnFormOpen] = useState(false);
  const { people, skills, connections, palette, setPalette } = useStore();
  const t = PALETTES[palette];

  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-2.5"
        style={{
          background: t.headerBg,
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${t.headerBorder}`,
          zIndex: 20,
          transition: 'background 0.4s, border-color 0.4s',
        }}
      >
        {/* Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: t.accentBtn,
                border: `1px solid ${t.accentBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Share2 size={13} color={t.accent} />
            </div>
            <div>
              <div
                className="font-semibold text-sm tracking-wide"
                style={{ color: t.titleText, letterSpacing: '0.06em', transition: 'color 0.4s' }}
              >
                Skill Matrix
              </div>
              <div className="text-xs" style={{ color: t.hintText, marginTop: -1, transition: 'color 0.4s' }}>Team Competency Graph</div>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex items-center gap-4 ml-1 pl-4"
            style={{ borderLeft: `1px solid ${t.divider}`, transition: 'border-color 0.4s' }}
          >
            <span className="text-xs flex items-center gap-1.5" style={{ color: t.mutedText }}>
              <Users size={11} style={{ color: t.accentLight }} />
              <span style={{ color: t.bodyText }}>{people.length}</span> Members
            </span>
            <span className="text-xs flex items-center gap-1.5" style={{ color: t.mutedText }}>
              <Layers size={11} style={{ color: '#34d399' }} />
              <span style={{ color: t.bodyText }}>{skills.length}</span> Skills
            </span>
            <span className="text-xs flex items-center gap-1.5" style={{ color: t.mutedText }}>
              <Zap size={11} style={{ color: '#a78bfa' }} />
              <span style={{ color: t.bodyText }}>{connections.length}</span> Links
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{
              border: `1px solid ${t.headerBorder}`,
              background: t.toggleBg,
              transition: 'background 0.4s, border-color 0.4s',
            }}
          >
            {(['graph', 'matrix'] as const).map((view) => (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className="flex items-center gap-1.5 text-xs h-7 px-2.5 transition-all"
                style={{
                  color: activeView === view ? t.accent : t.mutedText,
                  background: activeView === view ? t.accentBg : 'transparent',
                  borderRight: view === 'graph' ? `1px solid ${t.headerBorder}` : 'none',
                  cursor: 'pointer',
                }}
              >
                {view === 'graph' ? <Share2 size={11} /> : <Grid3x3 size={11} />}
                <span className="capitalize">{view}</span>
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleSummary}
            className="gap-1.5 text-xs h-8 transition-all"
            style={{
              color: summaryOpen ? t.accent : t.mutedText,
              border: summaryOpen ? `1px solid ${t.accentBorder}` : '1px solid transparent',
              background: summaryOpen ? t.accentBg : 'transparent',
            }}
          >
            <BarChart3 size={13} />
            Analytics
          </Button>

          {/* Palette picker */}
          <Popover open={paletteOpen} onOpenChange={setPaletteOpen}>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-xs h-8 transition-all"
                style={{
                  color: paletteOpen ? t.accent : t.mutedText,
                  border: paletteOpen ? `1px solid ${t.accentBorder}` : '1px solid transparent',
                  background: paletteOpen ? t.accentBg : 'transparent',
                }}
              >
                <Palette size={13} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-52 p-3"
              style={{
                background: t.panelBg,
                border: `1px solid ${t.panelBorder}`,
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.mutedText }}>
                Color Palette
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(PALETTES) as [ColorPalette, typeof PALETTES[ColorPalette]][]).map(([id, p]) => (
                  <button
                    key={id}
                    onClick={() => { setPalette(id); setPaletteOpen(false); }}
                    className="flex flex-col items-center gap-1.5 px-2 py-2 rounded-md text-xs transition-all"
                    style={{
                      background: palette === id ? t.accentBg : t.cardBg,
                      border: `1px solid ${palette === id ? t.accentBorder : t.cardBorder}`,
                      color: palette === id ? t.accent : t.mutedText,
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: p.swatch,
                      flexShrink: 0,
                      border: `1px solid ${t.cardBorder}`,
                    }} />
                    <span style={{ fontSize: 10 }}>{p.label}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <PopoverTrigger
              className="inline-flex items-center gap-1.5 text-xs h-8 px-3 rounded-lg font-medium"
              style={{
                background: t.accentBtn,
                border: `1px solid ${t.accentBorder}`,
                color: '#e0f2fe',
                cursor: 'pointer',
                boxShadow: `0 0 12px ${t.accentBg}`,
                transition: 'box-shadow 0.3s',
              }}
            >
              <Plus size={13} />
              Add
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-44 p-1"
              style={{
                background: t.panelBg,
                border: `1px solid ${t.panelBorder}`,
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => { setPersonFormOpen(true); setAddOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors text-left"
                  style={{ color: t.isDark ? '#93c5fd' : '#1d4ed8' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = t.accentBg)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <Users size={12} /> Add Member
                </button>
                <button
                  onClick={() => { setSkillFormOpen(true); setAddOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors text-left"
                  style={{ color: t.isDark ? '#6ee7b7' : '#059669' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.08)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <Layers size={12} /> Add Skill
                </button>
                <button
                  onClick={() => { setConnFormOpen(true); setAddOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors text-left"
                  style={{ color: t.isDark ? '#c4b5fd' : '#6d28d9' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(139,92,246,0.08)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <Zap size={12} /> Link Skill
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {personFormOpen && <PersonForm open={personFormOpen} onClose={() => setPersonFormOpen(false)} />}
      {skillFormOpen && <SkillForm open={skillFormOpen} onClose={() => setSkillFormOpen(false)} />}
      {connFormOpen && <ConnectionForm open={connFormOpen} onClose={() => setConnFormOpen(false)} />}
    </>
  );
}

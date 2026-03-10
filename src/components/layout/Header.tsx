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

  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-2.5"
        style={{
          background: 'rgba(5, 12, 26, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.12)',
          zIndex: 20,
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
                background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)',
                border: '1px solid rgba(59,130,246,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Share2 size={13} color="#93c5fd" />
            </div>
            <div>
              <div
                className="font-semibold text-sm tracking-wide"
                style={{ color: '#e2e8f0', letterSpacing: '0.06em' }}
              >
                Skill Matrix
              </div>
              <div className="text-xs" style={{ color: '#334155', marginTop: -1 }}>Team Competency Graph</div>
            </div>
          </div>

          {/* Stats */}
          <div
            className="flex items-center gap-4 ml-1 pl-4"
            style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="text-xs flex items-center gap-1.5" style={{ color: '#475569' }}>
              <Users size={11} style={{ color: '#60a5fa' }} />
              <span style={{ color: '#94a3b8' }}>{people.length}</span> Members
            </span>
            <span className="text-xs flex items-center gap-1.5" style={{ color: '#475569' }}>
              <Layers size={11} style={{ color: '#34d399' }} />
              <span style={{ color: '#94a3b8' }}>{skills.length}</span> Skills
            </span>
            <span className="text-xs flex items-center gap-1.5" style={{ color: '#475569' }}>
              <Zap size={11} style={{ color: '#a78bfa' }} />
              <span style={{ color: '#94a3b8' }}>{connections.length}</span> Links
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: '1px solid rgba(59,130,246,0.18)', background: 'rgba(8,15,30,0.7)' }}
          >
            {(['graph', 'matrix'] as const).map((view) => (
              <button
                key={view}
                onClick={() => onViewChange(view)}
                className="flex items-center gap-1.5 text-xs h-7 px-2.5 transition-all"
                style={{
                  color: activeView === view ? '#93c5fd' : '#475569',
                  background: activeView === view ? 'rgba(59,130,246,0.15)' : 'transparent',
                  borderRight: view === 'graph' ? '1px solid rgba(59,130,246,0.12)' : 'none',
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
            className="gap-1.5 text-xs h-8"
            style={{
              color: summaryOpen ? '#93c5fd' : '#475569',
              border: summaryOpen ? '1px solid rgba(59,130,246,0.35)' : '1px solid transparent',
              background: summaryOpen ? 'rgba(59,130,246,0.08)' : 'transparent',
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
                className="gap-1.5 text-xs h-8"
                style={{
                  color: paletteOpen ? '#93c5fd' : '#475569',
                  border: paletteOpen ? '1px solid rgba(59,130,246,0.35)' : '1px solid transparent',
                  background: paletteOpen ? 'rgba(59,130,246,0.08)' : 'transparent',
                }}
              >
                <Palette size={13} />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-48 p-3"
              style={{
                background: 'rgba(5, 12, 26, 0.98)',
                border: '1px solid rgba(59,130,246,0.2)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#334155' }}>
                Color Palette
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(PALETTES) as [ColorPalette, typeof PALETTES[ColorPalette]][]).map(([id, p]) => (
                  <button
                    key={id}
                    onClick={() => { setPalette(id); setPaletteOpen(false); }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-all"
                    style={{
                      background: palette === id ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${palette === id ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)'}`,
                      color: palette === id ? '#93c5fd' : '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ width: 14, height: 14, borderRadius: 3, background: p.swatch, flexShrink: 0 }} />
                    {p.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <PopoverTrigger
              className="inline-flex items-center gap-1.5 text-xs h-8 px-3 rounded-lg font-medium"
              style={{
                background: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
                border: '1px solid rgba(59,130,246,0.5)',
                color: '#e0f2fe',
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(59,130,246,0.15)',
              }}
            >
              <Plus size={13} />
              Add
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-44 p-1"
              style={{
                background: 'rgba(5, 12, 26, 0.98)',
                border: '1px solid rgba(59,130,246,0.2)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => { setPersonFormOpen(true); setAddOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors text-left"
                  style={{ color: '#93c5fd' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(59,130,246,0.1)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <Users size={12} /> Add Member
                </button>
                <button
                  onClick={() => { setSkillFormOpen(true); setAddOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors text-left"
                  style={{ color: '#6ee7b7' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.08)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <Layers size={12} /> Add Skill
                </button>
                <button
                  onClick={() => { setConnFormOpen(true); setAddOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors text-left"
                  style={{ color: '#c4b5fd' }}
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

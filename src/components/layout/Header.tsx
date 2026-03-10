'use client';

import { useState } from 'react';
import { Plus, Users, Layers, Zap, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import PersonForm from '@/components/forms/PersonForm';
import SkillForm from '@/components/forms/SkillForm';
import ConnectionForm from '@/components/forms/ConnectionForm';
import { useStore } from '@/lib/store';

interface Props {
  onToggleSummary: () => void;
  summaryOpen: boolean;
}

export default function Header({ onToggleSummary, summaryOpen }: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [personFormOpen, setPersonFormOpen] = useState(false);
  const [skillFormOpen, setSkillFormOpen] = useState(false);
  const [connFormOpen, setConnFormOpen] = useState(false);
  const { people, skills, connections } = useStore();

  return (
    <>
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-3"
        style={{
          background: 'rgba(10, 8, 22, 0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(234, 179, 8, 0.15)',
          zIndex: 20,
        }}
      >
        {/* Title */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #92400e 0%, #451a03 100%)',
              border: '1px solid #d97706',
              borderRadius: 8,
              padding: '4px 10px',
              boxShadow: '0 0 12px rgba(234,179,8,0.2)',
            }}
          >
            <span style={{ fontSize: 16 }}>⚔️</span>
            <span
              className="font-bold text-sm tracking-wider"
              style={{ color: '#fbbf24', fontFamily: 'serif' }}
            >
              SKILL MATRIX
            </span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 ml-2">
            <span className="text-xs flex items-center gap-1" style={{ color: '#6b5028' }}>
              <Users size={11} />
              {people.length} Heroes
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: '#6b5028' }}>
              <Layers size={11} />
              {skills.length} Skills
            </span>
            <span className="text-xs flex items-center gap-1" style={{ color: '#6b5028' }}>
              <Zap size={11} />
              {connections.length} Links
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleSummary}
            className="gap-1.5 text-xs h-8"
            style={{
              color: summaryOpen ? '#eab308' : '#6b5028',
              border: summaryOpen ? '1px solid rgba(234,179,8,0.4)' : '1px solid transparent',
              background: summaryOpen ? 'rgba(234,179,8,0.08)' : 'transparent',
            }}
          >
            <BarChart3 size={13} />
            Guild Stats
          </Button>

          <Popover open={addOpen} onOpenChange={setAddOpen}>
            <PopoverTrigger
              className="inline-flex items-center gap-1.5 text-xs h-8 px-2.5 rounded-lg font-medium"
              style={{
                background: 'linear-gradient(135deg, #92400e, #78350f)',
                border: '1px solid #d97706',
                color: '#fbbf24',
                boxShadow: '0 0 12px rgba(234,179,8,0.2)',
                cursor: 'pointer',
              }}
            >
              <Plus size={14} />
              Add
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-44 p-1"
              style={{
                background: 'rgba(10, 8, 22, 0.98)',
                border: '1px solid rgba(234, 179, 8, 0.25)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => { setPersonFormOpen(true); setAddOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors hover:bg-amber-950/50 text-left"
                  style={{ color: '#fbbf24' }}
                >
                  <span>⚔️</span> Add Hero
                </button>
                <button
                  onClick={() => { setSkillFormOpen(true); setAddOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors hover:bg-emerald-950/50 text-left"
                  style={{ color: '#6ee7b7' }}
                >
                  <span>🔷</span> Add Skill
                </button>
                <button
                  onClick={() => { setConnFormOpen(true); setAddOpen(false); }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs transition-colors hover:bg-indigo-950/50 text-left"
                  style={{ color: '#a5b4fc' }}
                >
                  <span>⚡</span> Link Skill
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

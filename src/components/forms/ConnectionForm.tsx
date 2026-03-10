'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Proficiency } from '@/lib/types';
import { PROFICIENCY_CONFIG } from '@/lib/constants';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

interface Props {
  open: boolean;
  onClose: () => void;
  prefilledPersonId?: string;
  prefilledSkillId?: string;
}

const PROFICIENCY_LEVELS: Proficiency[] = ['learning', 'familiar', 'expert'];

export default function ConnectionForm({ open, onClose, prefilledPersonId, prefilledSkillId }: Props) {
  const { people, skills, connections, addConnection } = useStore();
  const [personId, setPersonId] = useState(prefilledPersonId ?? '');
  const [skillId, setSkillId] = useState(prefilledSkillId ?? '');
  const [proficiency, setProficiency] = useState<Proficiency>('familiar');

  const alreadyExists = personId && skillId &&
    connections.some((c) => c.personId === personId && c.skillId === skillId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personId || !skillId || alreadyExists) return;
    addConnection({ personId, skillId, proficiency });
    onClose();
  };

  // Filter out already-connected skills/people
  const availableSkills = prefilledPersonId
    ? skills.filter((s) => !connections.some((c) => c.personId === prefilledPersonId && c.skillId === s.id))
    : skills;

  const availablePeople = prefilledSkillId
    ? people.filter((p) => !connections.some((c) => c.skillId === prefilledSkillId && c.personId === p.id))
    : people;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        style={{
          background: 'rgba(15, 10, 30, 0.98)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          boxShadow: '0 0 40px rgba(99,102,241,0.1)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#818cf8' }}>⚡ Link Skill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Person selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#a5b4fc' }}>Hero</label>
            <Select
              value={personId}
              onValueChange={(v) => v && setPersonId(v)}
              disabled={!!prefilledPersonId}
            >
              <SelectTrigger
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: '#e2e8f0',
                }}
              >
                <SelectValue placeholder="Select a person..." />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: 'rgba(15,10,30,0.98)',
                  border: '1px solid rgba(99,102,241,0.3)',
                }}
              >
                {availablePeople.map((p) => (
                  <SelectItem key={p.id} value={p.id} style={{ color: '#e2c87a' }}>
                    {p.name} — {p.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skill selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#a5b4fc' }}>Skill</label>
            <Select
              value={skillId}
              onValueChange={(v) => v && setSkillId(v)}
              disabled={!!prefilledSkillId}
            >
              <SelectTrigger
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  color: '#e2e8f0',
                }}
              >
                <SelectValue placeholder="Select a skill..." />
              </SelectTrigger>
              <SelectContent
                style={{
                  background: 'rgba(15,10,30,0.98)',
                  border: '1px solid rgba(99,102,241,0.3)',
                }}
              >
                {availableSkills.map((s) => (
                  <SelectItem key={s.id} value={s.id} style={{ color: '#d1fae5' }}>
                    {s.name} ({s.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Proficiency selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#a5b4fc' }}>Proficiency Level</label>
            <div className="flex gap-2">
              {PROFICIENCY_LEVELS.map((lvl) => {
                const cfg = PROFICIENCY_CONFIG[lvl];
                const selected = proficiency === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setProficiency(lvl)}
                    className="flex-1 py-3 rounded-lg flex flex-col items-center gap-1 transition-all"
                    style={{
                      background: selected ? `${cfg.edgeColor}22` : 'rgba(255,255,255,0.04)',
                      border: selected ? `1.5px solid ${cfg.edgeColor}` : '1px solid rgba(255,255,255,0.1)',
                      boxShadow: selected ? `0 0 16px ${cfg.glowColor}` : 'none',
                    }}
                  >
                    <span style={{ fontSize: 16, color: selected ? cfg.edgeColor : '#555' }}>
                      {'★'.repeat(cfg.stars)}{'☆'.repeat(3 - cfg.stars)}
                    </span>
                    <span style={{ fontSize: 10, color: selected ? cfg.edgeColor : '#555', fontWeight: 600 }}>
                      {cfg.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {alreadyExists && (
            <p className="text-xs" style={{ color: '#ef4444' }}>
              This connection already exists.
            </p>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} style={{ color: '#666' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!personId || !skillId || !!alreadyExists}
              style={{
                background: 'linear-gradient(135deg, #312e81, #1e1b4b)',
                border: '1px solid #6366f1',
                color: '#a5b4fc',
              }}
            >
              Link Skill
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

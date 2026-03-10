'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Skill, SkillCategory } from '@/lib/types';
import { SKILL_CATEGORIES, CATEGORY_COLORS } from '@/lib/constants';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  editSkill?: Skill;
}

export default function SkillForm({ open, onClose, editSkill }: Props) {
  const { addSkill, updateSkill } = useStore();
  const [name, setName] = useState(editSkill?.name ?? '');
  const [category, setCategory] = useState<SkillCategory>(editSkill?.category ?? 'Frontend');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editSkill) {
      updateSkill(editSkill.id, { name: name.trim(), category });
    } else {
      addSkill({ name: name.trim(), category });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        style={{
          background: 'rgba(15, 10, 30, 0.98)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 0 40px rgba(16,185,129,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#10b981' }}>
            {editSkill ? 'Edit Skill' : 'Add Skill'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#6ee7b7' }}>Skill Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. React, PostgreSQL"
              required
              autoFocus
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(16,185,129,0.3)',
                color: '#d1fae5',
              }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#6ee7b7' }}>Category</label>
            <div className="grid grid-cols-3 gap-2">
              {SKILL_CATEGORIES.map((cat) => {
                const colors = CATEGORY_COLORS[cat];
                const selected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className="py-2 px-3 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: selected ? `${colors.border}30` : 'rgba(255,255,255,0.04)',
                      border: selected ? `1.5px solid ${colors.border}` : '1px solid rgba(255,255,255,0.1)',
                      color: selected ? colors.border : '#666',
                      boxShadow: selected ? `0 0 12px ${colors.glow}` : 'none',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} style={{ color: '#666' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #065f46, #064e3b)',
                border: '1px solid #10b981',
                color: '#6ee7b7',
              }}
            >
              {editSkill ? 'Save Changes' : 'Add Skill'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

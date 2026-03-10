'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Person } from '@/lib/types';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  editPerson?: Person;
}

export default function PersonForm({ open, onClose, editPerson }: Props) {
  const { addPerson, updatePerson } = useStore();
  const [name, setName] = useState(editPerson?.name ?? '');
  const [role, setRole] = useState(editPerson?.role ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editPerson) {
      updatePerson(editPerson.id, { name: name.trim(), role: role.trim() });
    } else {
      addPerson({ name: name.trim(), role: role.trim() });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        style={{
          background: 'rgba(15, 10, 30, 0.98)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          boxShadow: '0 0 40px rgba(234,179,8,0.1)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#fbbf24' }}>
            {editPerson ? '✏️ Edit Hero' : '⚔️ Add Hero'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#a07030' }}>Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alice"
              required
              autoFocus
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(234,179,8,0.3)',
                color: '#e2c87a',
              }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#a07030' }}>Role</label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Engineer"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(234,179,8,0.2)',
                color: '#e2c87a',
              }}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="ghost" onClick={onClose} style={{ color: '#666' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #92400e, #78350f)',
                border: '1px solid #d97706',
                color: '#fbbf24',
              }}
            >
              {editPerson ? 'Save Changes' : 'Add Hero'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

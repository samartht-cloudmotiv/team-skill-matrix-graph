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
          background: 'rgba(4, 10, 22, 0.98)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 0 40px rgba(59,130,246,0.08)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#60a5fa' }}>
            {editPerson ? 'Edit Member' : 'Add Member'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#64748b' }}>Name *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alice"
              required
              autoFocus
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(59,130,246,0.3)',
                color: '#e2e8f0',
              }}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium" style={{ color: '#64748b' }}>Role</label>
            <Input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Engineer"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(59,130,246,0.2)',
                color: '#e2e8f0',
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
                background: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
                border: '1px solid rgba(59,130,246,0.5)',
                color: '#e0f2fe',
              }}
            >
              {editPerson ? 'Save Changes' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export default function ConfirmDialog({ open, onClose, onConfirm, title, description }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        style={{
          background: 'rgba(15, 10, 30, 0.98)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: '#f87171' }}>{title}</DialogTitle>
          <DialogDescription style={{ color: '#888' }}>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button type="button" variant="ghost" onClick={onClose} style={{ color: '#888' }}>
            Cancel
          </Button>
          <Button
            onClick={() => { onConfirm(); onClose(); }}
            style={{
              background: 'linear-gradient(135deg, #7f1d1d, #450a0a)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

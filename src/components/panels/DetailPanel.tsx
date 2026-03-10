'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '@/lib/store';
import PersonDetail from './PersonDetail';
import SkillDetail from './SkillDetail';

export default function DetailPanel() {
  const { selectedNodeId, selectedNodeType, setSelectedNode } = useStore();

  return (
    <AnimatePresence>
      {selectedNodeId && (
        <motion.div
          key={selectedNodeId}
          initial={{ x: 380, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 380, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 38 }}
          // Positioned directly — no full-screen wrapper that could block clicks
          style={{
            position: 'fixed',
            top: 48, // below header
            right: 0,
            bottom: 0,
            width: 360,
            background: 'rgba(4, 10, 22, 0.96)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(59, 130, 246, 0.15)',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.6)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Panel title bar */}
          <div
            className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: selectedNodeType === 'person' ? '#60a5fa' : '#2dd4bf' }}
            >
              {selectedNodeType === 'person' ? 'Member Profile' : 'Skill Details'}
            </span>
            <button
              onClick={() => setSelectedNode(null, null)}
              className="p-1 rounded transition-colors"
              style={{ color: '#555' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#fff')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#555')}
            >
              <X size={14} />
            </button>
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {selectedNodeType === 'person' && selectedNodeId && (
              <PersonDetail personId={selectedNodeId} />
            )}
            {selectedNodeType === 'skill' && selectedNodeId && (
              <SkillDetail skillId={selectedNodeId} />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

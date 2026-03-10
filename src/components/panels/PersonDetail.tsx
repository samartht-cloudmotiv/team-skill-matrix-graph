'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { CATEGORY_COLORS, PROFICIENCY_CONFIG } from '@/lib/constants';
import { Person, Proficiency } from '@/lib/types';
import { Button } from '@/components/ui/button';
import PersonForm from '@/components/forms/PersonForm';
import ConnectionForm from '@/components/forms/ConnectionForm';
import ConfirmDialog from '@/components/forms/ConfirmDialog';

function XpBar({ proficiency }: { proficiency: Proficiency }) {
  const levels: Proficiency[] = ['learning', 'familiar', 'expert'];
  const idx = levels.indexOf(proficiency);
  return (
    <div className="flex gap-1 items-center">
      {levels.map((lvl, i) => (
        <div
          key={lvl}
          className="h-2 rounded-full flex-1"
          style={{
            background: i <= idx
              ? `linear-gradient(90deg, ${PROFICIENCY_CONFIG[proficiency].edgeColor}, ${PROFICIENCY_CONFIG[proficiency].edgeColor}88)`
              : 'rgba(255,255,255,0.08)',
            boxShadow: 'none',
          }}
        />
      ))}
      <span className="text-xs ml-1" style={{ color: PROFICIENCY_CONFIG[proficiency].edgeColor, minWidth: 52 }}>
        {'★'.repeat(PROFICIENCY_CONFIG[proficiency].stars)}{'☆'.repeat(3 - PROFICIENCY_CONFIG[proficiency].stars)} {PROFICIENCY_CONFIG[proficiency].label}
      </span>
    </div>
  );
}

export default function PersonDetail({ personId }: { personId: string }) {
  const { people, skills, connections, deletePerson, setSelectedNode, deleteConnection } = useStore();
  const person = people.find((p) => p.id === personId);
  const [editOpen, setEditOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!person) return null;

  const personConns = connections.filter((c) => c.personId === personId);
  const connectedSkills = personConns.map((c) => ({
    conn: c,
    skill: skills.find((s) => s.id === c.skillId),
  })).filter((x) => x.skill);

  const expertCount = personConns.filter((c) => c.proficiency === 'expert').length;
  const familiarCount = personConns.filter((c) => c.proficiency === 'familiar').length;
  const learningCount = personConns.filter((c) => c.proficiency === 'learning').length;

  const handleDelete = () => {
    deletePerson(personId);
    setSelectedNode(null, null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="p-4 pb-3"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.22) 0%, rgba(7, 16, 32, 0.5) 100%)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.13)',
        }}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-xl"
            style={{
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #1e3a5f 0%, #0f1f3d 100%)',
              border: '2px solid #3b82f6',
              boxShadow: '0 0 12px rgba(59,130,246,0.18)',
              fontSize: 18,
              fontWeight: 700,
              color: '#93c5fd',
              fontFamily: 'var(--font-geist-sans), system-ui',
            }}
          >
            {person.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-base font-bold truncate" style={{ color: '#e2e8f0' }}>{person.name}</div>
            <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{person.role}</div>
            <div className="flex gap-2 mt-1.5 flex-wrap">
              {expertCount > 0 && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(14,165,233,0.12)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.25)' }}>{expertCount} Expert</span>}
              {familiarCount > 0 && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' }}>{familiarCount} Familiar</span>}
              {learningCount > 0 && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(100,116,139,0.1)', color: '#94a3b8', border: '1px solid rgba(100,116,139,0.2)' }}>{learningCount} Learning</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Button size="sm" variant="ghost" onClick={() => setEditOpen(true)} className="h-7 w-7 p-0 hover:bg-amber-950">
              <Edit2 size={13} style={{ color: '#d97706' }} />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setDeleteOpen(true)} className="h-7 w-7 p-0 hover:bg-red-950">
              <Trash2 size={13} style={{ color: '#ef4444' }} />
            </Button>
          </div>
        </div>
      </div>

      {/* Skills list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#334155' }}>
            Skills ({connectedSkills.length})
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setConnectOpen(true)}
            className="h-6 text-xs gap-1 px-2"
            style={{ color: '#60a5fa', border: '1px solid rgba(59,130,246,0.28)' }}
          >
            <Plus size={11} /> Link Skill
          </Button>
        </div>

        {connectedSkills.length === 0 && (
          <div className="text-center py-8" style={{ color: '#334155' }}>
            <div className="text-xs">No skills linked yet</div>
          </div>
        )}

        {connectedSkills.map(({ conn, skill }) => {
          if (!skill) return null;
          const colors = CATEGORY_COLORS[skill.category];
          return (
            <motion.div
              key={conn.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg p-2.5 flex items-center gap-2.5"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${colors.border}33`,
                cursor: 'pointer',
              }}
              onClick={() => useStore.getState().setSelectedNode(skill.id, 'skill')}
            >
              <div
                className="flex-shrink-0 rounded text-xs font-medium px-1.5 py-0.5"
                style={{ background: `${colors.border}22`, color: colors.border, border: `1px solid ${colors.border}44`, fontSize: 10 }}
              >
                {skill.category}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: '#cbd5e1' }}>{skill.name}</div>
                <XpBar proficiency={conn.proficiency} />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteConnection(conn.id); }}
                className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity"
              >
                <X size={12} style={{ color: '#ef4444' }} />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Dialogs */}
      {editOpen && <PersonForm open={editOpen} onClose={() => setEditOpen(false)} editPerson={person} />}
      {connectOpen && <ConnectionForm open={connectOpen} onClose={() => setConnectOpen(false)} prefilledPersonId={personId} />}
      {deleteOpen && (
        <ConfirmDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          title={`Remove ${person.name}?`}
          description={`This will permanently delete ${person.name} and remove all ${personConns.length} skill connection${personConns.length !== 1 ? 's' : ''}.`}
        />
      )}
    </div>
  );
}

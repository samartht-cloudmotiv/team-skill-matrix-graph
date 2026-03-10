'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Plus, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { CATEGORY_COLORS, PROFICIENCY_CONFIG } from '@/lib/constants';
import { Proficiency } from '@/lib/types';
import { Button } from '@/components/ui/button';
import SkillForm from '@/components/forms/SkillForm';
import ConnectionForm from '@/components/forms/ConnectionForm';
import ConfirmDialog from '@/components/forms/ConfirmDialog';

const HEX_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

function ProficiencyBadge({ proficiency }: { proficiency: Proficiency }) {
  const cfg = PROFICIENCY_CONFIG[proficiency];
  return (
    <span
      className="text-xs px-2 py-0.5 rounded font-medium"
      style={{
        background: `${cfg.edgeColor}18`,
        color: cfg.edgeColor,
        border: `1px solid ${cfg.edgeColor}44`,
        boxShadow: proficiency === 'expert' ? `0 0 8px ${cfg.edgeColor}33` : 'none',
      }}
    >
      {'★'.repeat(cfg.stars)}{'☆'.repeat(3 - cfg.stars)} {cfg.label}
    </span>
  );
}

export default function SkillDetail({ skillId }: { skillId: string }) {
  const { people, skills, connections, deleteSkill, setSelectedNode, deleteConnection } = useStore();
  const skill = skills.find((s) => s.id === skillId);
  const [editOpen, setEditOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!skill) return null;

  const colors = CATEGORY_COLORS[skill.category];
  const skillConns = connections.filter((c) => c.skillId === skillId);
  const connectedPeople = skillConns.map((c) => ({
    conn: c,
    person: people.find((p) => p.id === c.personId),
  })).filter((x) => x.person);

  const expertCount = skillConns.filter((c) => c.proficiency === 'expert').length;
  const familiarCount = skillConns.filter((c) => c.proficiency === 'familiar').length;
  const learningCount = skillConns.filter((c) => c.proficiency === 'learning').length;

  const handleDelete = () => {
    deleteSkill(skillId);
    setSelectedNode(null, null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="p-4 pb-3"
        style={{
          background: `linear-gradient(135deg, ${colors.border}12 0%, rgba(4, 10, 22, 0.55) 100%)`,
          borderBottom: `1px solid ${colors.border}25`,
        }}
      >
        <div className="flex items-start gap-3">
          {/* Hex icon */}
          <div className="flex-shrink-0 relative" style={{ width: 56, height: 50 }}>
            <div
              style={{
                width: 56,
                height: 50,
                clipPath: HEX_CLIP,
                background: `linear-gradient(135deg, ${colors.border}55, ${colors.border}22)`,
                border: `2px solid ${colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                color: colors.border,
                boxShadow: `0 0 16px ${colors.glow}`,
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-base font-bold truncate" style={{ color: colors.border }}>{skill.name}</div>
            <div
              className="text-xs mt-0.5 px-1.5 py-0.5 rounded inline-block"
              style={{ background: `${colors.border}22`, color: `${colors.border}bb`, border: `1px solid ${colors.border}44` }}
            >
              {skill.category}
            </div>
            <div className="flex gap-2 mt-1.5 flex-wrap text-xs" style={{ color: '#888' }}>
              <span>{expertCount} Expert</span>
              <span>·</span>
              <span>{familiarCount} Familiar</span>
              <span>·</span>
              <span>{learningCount} Learning</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Button size="sm" variant="ghost" onClick={() => setEditOpen(true)} className="h-7 w-7 p-0">
              <Edit2 size={13} style={{ color: colors.border }} />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setDeleteOpen(true)} className="h-7 w-7 p-0">
              <Trash2 size={13} style={{ color: '#ef4444' }} />
            </Button>
          </div>
        </div>

        {/* Distribution bar */}
        {skillConns.length > 0 && (
          <div className="mt-3 flex rounded-full overflow-hidden h-2 gap-0.5">
            {expertCount > 0 && (
              <div style={{ flex: expertCount, background: '#0ea5e9' }} />
            )}
            {familiarCount > 0 && (
              <div style={{ flex: familiarCount, background: '#3b82f6' }} />
            )}
            {learningCount > 0 && (
              <div style={{ flex: learningCount, background: 'rgba(100,116,139,0.45)' }} />
            )}
          </div>
        )}
      </div>

      {/* People list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#334155' }}>
            Team Members ({connectedPeople.length})
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setConnectOpen(true)}
            className="h-6 text-xs gap-1 px-2"
            style={{ color: colors.border, border: `1px solid ${colors.border}44` }}
          >
            <Plus size={11} /> Add Person
          </Button>
        </div>

        {connectedPeople.length === 0 && (
          <div className="text-center py-8" style={{ color: '#334155' }}>
            <div className="text-xs">No team members have this skill yet</div>
          </div>
        )}

        {connectedPeople.map(({ conn, person }) => {
          if (!person) return null;
          return (
            <motion.div
              key={conn.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-lg p-2.5 flex items-center gap-2.5"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                cursor: 'pointer',
              }}
              onClick={() => useStore.getState().setSelectedNode(person.id, 'person')}
            >
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-lg font-bold"
                style={{
                  width: 34,
                  height: 34,
                  background: 'linear-gradient(135deg, #1e3a5f, #0f1f3d)',
                  border: '1.5px solid rgba(59,130,246,0.4)',
                  fontSize: 11,
                  color: '#60a5fa',
                }}
              >
                {person.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate" style={{ color: '#cbd5e1' }}>{person.name}</div>
                <div className="text-xs truncate" style={{ color: '#666' }}>{person.role}</div>
              </div>
              <ProficiencyBadge proficiency={conn.proficiency} />
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
      {editOpen && <SkillForm open={editOpen} onClose={() => setEditOpen(false)} editSkill={skill} />}
      {connectOpen && <ConnectionForm open={connectOpen} onClose={() => setConnectOpen(false)} prefilledSkillId={skillId} />}
      {deleteOpen && (
        <ConfirmDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          onConfirm={handleDelete}
          title={`Remove ${skill.name}?`}
          description={`This will permanently delete the ${skill.name} skill and remove all ${skillConns.length} connection${skillConns.length !== 1 ? 's' : ''} to it.`}
        />
      )}
    </div>
  );
}

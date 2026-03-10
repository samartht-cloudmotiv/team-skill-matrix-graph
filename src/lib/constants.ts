import { SkillCategory, Proficiency } from './types';

export const CATEGORY_COLORS: Record<SkillCategory, { bg: string; glow: string; border: string; badge: string }> = {
  Frontend: {
    bg: 'from-emerald-600 to-emerald-900',
    glow: 'rgba(16, 185, 129, 0.5)',
    border: '#10b981',
    badge: 'bg-emerald-900 text-emerald-300',
  },
  Backend: {
    bg: 'from-indigo-500 to-indigo-900',
    glow: 'rgba(99, 102, 241, 0.5)',
    border: '#6366f1',
    badge: 'bg-indigo-900 text-indigo-300',
  },
  DevOps: {
    bg: 'from-amber-500 to-amber-900',
    glow: 'rgba(245, 158, 11, 0.5)',
    border: '#f59e0b',
    badge: 'bg-amber-900 text-amber-300',
  },
  Design: {
    bg: 'from-rose-500 to-rose-900',
    glow: 'rgba(244, 63, 94, 0.5)',
    border: '#f43f5e',
    badge: 'bg-rose-900 text-rose-300',
  },
  Data: {
    bg: 'from-violet-500 to-violet-900',
    glow: 'rgba(139, 92, 246, 0.5)',
    border: '#8b5cf6',
    badge: 'bg-violet-900 text-violet-300',
  },
  Other: {
    bg: 'from-slate-500 to-slate-900',
    glow: 'rgba(100, 116, 139, 0.5)',
    border: '#64748b',
    badge: 'bg-slate-900 text-slate-300',
  },
};

export const PROFICIENCY_CONFIG: Record<Proficiency, {
  label: string;
  stars: number;
  color: string;
  edgeColor: string;
  strokeWidth: number;
  opacity: number;
  dashArray: string;
  glowColor: string;
}> = {
  learning: {
    label: 'Learning',
    stars: 1,
    color: '#fbbf24',
    edgeColor: '#fbbf24',
    strokeWidth: 1.5,
    opacity: 0.35,
    dashArray: '6 4',
    glowColor: 'rgba(251, 191, 36, 0.15)',
  },
  familiar: {
    label: 'Familiar',
    stars: 2,
    color: '#f59e0b',
    edgeColor: '#f59e0b',
    strokeWidth: 2.5,
    opacity: 0.65,
    dashArray: 'none',
    glowColor: 'rgba(245, 158, 11, 0.25)',
  },
  expert: {
    label: 'Expert',
    stars: 3,
    color: '#eab308',
    edgeColor: '#eab308',
    strokeWidth: 4,
    opacity: 1,
    dashArray: 'none',
    glowColor: 'rgba(234, 179, 8, 0.5)',
  },
};

export const SKILL_CATEGORIES: SkillCategory[] = ['Frontend', 'Backend', 'DevOps', 'Design', 'Data', 'Other'];

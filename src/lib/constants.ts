import { SkillCategory, Proficiency, ColorPalette } from './types';

export const CATEGORY_COLORS: Record<SkillCategory, { bg: string; glow: string; border: string; badge: string }> = {
  Frontend: {
    bg: 'from-teal-600 to-teal-900',
    glow: 'rgba(13, 148, 136, 0.4)',
    border: '#0d9488',
    badge: 'bg-teal-900 text-teal-300',
  },
  Backend: {
    bg: 'from-indigo-500 to-indigo-900',
    glow: 'rgba(79, 70, 229, 0.4)',
    border: '#4f46e5',
    badge: 'bg-indigo-900 text-indigo-300',
  },
  DevOps: {
    bg: 'from-orange-500 to-orange-900',
    glow: 'rgba(234, 88, 12, 0.4)',
    border: '#ea580c',
    badge: 'bg-orange-900 text-orange-300',
  },
  Design: {
    bg: 'from-pink-500 to-pink-900',
    glow: 'rgba(219, 39, 119, 0.4)',
    border: '#db2777',
    badge: 'bg-pink-900 text-pink-300',
  },
  Data: {
    bg: 'from-violet-500 to-violet-900',
    glow: 'rgba(109, 40, 217, 0.4)',
    border: '#7c3aed',
    badge: 'bg-violet-900 text-violet-300',
  },
  Other: {
    bg: 'from-slate-500 to-slate-900',
    glow: 'rgba(71, 85, 105, 0.4)',
    border: '#475569',
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
    color: '#94a3b8',
    edgeColor: '#64748b',
    strokeWidth: 1.5,
    opacity: 0.45,
    dashArray: '6 5',
    glowColor: 'rgba(100, 116, 139, 0.1)',
  },
  familiar: {
    label: 'Familiar',
    stars: 2,
    color: '#60a5fa',
    edgeColor: '#3b82f6',
    strokeWidth: 2.5,
    opacity: 0.7,
    dashArray: 'none',
    glowColor: 'rgba(59, 130, 246, 0.2)',
  },
  expert: {
    label: 'Expert',
    stars: 3,
    color: '#38bdf8',
    edgeColor: '#0ea5e9',
    strokeWidth: 3.5,
    opacity: 0.95,
    dashArray: 'none',
    glowColor: 'rgba(14, 165, 233, 0.4)',
  },
};

export const SKILL_CATEGORIES: SkillCategory[] = ['Frontend', 'Backend', 'DevOps', 'Design', 'Data', 'Other'];

export const PALETTES: Record<ColorPalette, {
  label: string;
  swatch: string;   // color shown in picker
  background: string; // CSS gradient for page background
}> = {
  navy: {
    label: 'Navy',
    swatch: '#1a4a7a',
    background: 'radial-gradient(ellipse at 30% 20%, #1a2f4e 0%, #0d1b35 50%, #07111f 100%)',
  },
  slate: {
    label: 'Slate',
    swatch: '#334155',
    background: 'radial-gradient(ellipse at 30% 20%, #1e2938 0%, #111a26 50%, #080f18 100%)',
  },
  emerald: {
    label: 'Emerald',
    swatch: '#065f46',
    background: 'radial-gradient(ellipse at 30% 20%, #0c2a1e 0%, #071a12 50%, #030e0a 100%)',
  },
  violet: {
    label: 'Violet',
    swatch: '#4c1d95',
    background: 'radial-gradient(ellipse at 30% 20%, #1a1040 0%, #0f0a28 50%, #07051a 100%)',
  },
};

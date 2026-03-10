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

export type PaletteConfig = {
  label: string;
  swatch: string;
  background: string;
  isDark: boolean;
  // Header / chrome
  headerBg: string;
  headerBorder: string;
  toggleBg: string;
  divider: string;
  // Panels & popovers
  panelBg: string;
  panelBorder: string;
  cardBg: string;
  cardBorder: string;
  // Text hierarchy
  titleText: string;
  bodyText: string;
  mutedText: string;
  hintText: string;
  // Accent
  accent: string;
  accentLight: string;
  accentBorder: string;
  accentBg: string;
  accentBtn: string;
};

export const PALETTES: Record<ColorPalette, PaletteConfig> = {
  navy: {
    label: 'Navy',
    swatch: '#1a4a7a',
    background: 'radial-gradient(ellipse at 30% 20%, #1a2f4e 0%, #0d1b35 50%, #07111f 100%)',
    isDark: true,
    headerBg: 'rgba(5, 12, 26, 0.92)',
    headerBorder: 'rgba(59, 130, 246, 0.15)',
    toggleBg: 'rgba(8, 15, 30, 0.7)',
    divider: 'rgba(255,255,255,0.06)',
    panelBg: 'rgba(5, 12, 26, 0.98)',
    panelBorder: 'rgba(59, 130, 246, 0.2)',
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.08)',
    titleText: '#e2e8f0',
    bodyText: '#94a3b8',
    mutedText: '#475569',
    hintText: '#334155',
    accent: '#93c5fd',
    accentLight: '#60a5fa',
    accentBorder: 'rgba(59,130,246,0.35)',
    accentBg: 'rgba(59,130,246,0.08)',
    accentBtn: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
  },
  slate: {
    label: 'Slate',
    swatch: '#334155',
    background: 'radial-gradient(ellipse at 30% 20%, #1e2938 0%, #111a26 50%, #080f18 100%)',
    isDark: true,
    headerBg: 'rgba(8, 11, 18, 0.92)',
    headerBorder: 'rgba(59, 130, 246, 0.12)',
    toggleBg: 'rgba(10, 14, 22, 0.7)',
    divider: 'rgba(255,255,255,0.05)',
    panelBg: 'rgba(8, 11, 18, 0.98)',
    panelBorder: 'rgba(59, 130, 246, 0.18)',
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.08)',
    titleText: '#e2e8f0',
    bodyText: '#94a3b8',
    mutedText: '#475569',
    hintText: '#334155',
    accent: '#93c5fd',
    accentLight: '#60a5fa',
    accentBorder: 'rgba(59,130,246,0.35)',
    accentBg: 'rgba(59,130,246,0.08)',
    accentBtn: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
  },
  emerald: {
    label: 'Emerald',
    swatch: '#065f46',
    background: 'radial-gradient(ellipse at 30% 20%, #0c2a1e 0%, #071a12 50%, #030e0a 100%)',
    isDark: true,
    headerBg: 'rgba(3, 10, 6, 0.92)',
    headerBorder: 'rgba(52, 211, 153, 0.12)',
    toggleBg: 'rgba(4, 12, 8, 0.7)',
    divider: 'rgba(255,255,255,0.05)',
    panelBg: 'rgba(3, 10, 6, 0.98)',
    panelBorder: 'rgba(52, 211, 153, 0.15)',
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.08)',
    titleText: '#ecfdf5',
    bodyText: '#6ee7b7',
    mutedText: '#059669',
    hintText: '#065f46',
    accent: '#6ee7b7',
    accentLight: '#34d399',
    accentBorder: 'rgba(52,211,153,0.35)',
    accentBg: 'rgba(52,211,153,0.08)',
    accentBtn: 'linear-gradient(135deg, #059669, #065f46)',
  },
  violet: {
    label: 'Violet',
    swatch: '#4c1d95',
    background: 'radial-gradient(ellipse at 30% 20%, #1a1040 0%, #0f0a28 50%, #07051a 100%)',
    isDark: true,
    headerBg: 'rgba(6, 4, 18, 0.92)',
    headerBorder: 'rgba(167, 139, 250, 0.12)',
    toggleBg: 'rgba(8, 5, 22, 0.7)',
    divider: 'rgba(255,255,255,0.05)',
    panelBg: 'rgba(6, 4, 18, 0.98)',
    panelBorder: 'rgba(167, 139, 250, 0.15)',
    cardBg: 'rgba(255,255,255,0.03)',
    cardBorder: 'rgba(255,255,255,0.08)',
    titleText: '#ede9fe',
    bodyText: '#c4b5fd',
    mutedText: '#7c3aed',
    hintText: '#4c1d95',
    accent: '#c4b5fd',
    accentLight: '#a78bfa',
    accentBorder: 'rgba(167,139,250,0.35)',
    accentBg: 'rgba(167,139,250,0.08)',
    accentBtn: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
  },
  pearl: {
    label: 'Pearl',
    swatch: '#94a3b8',
    background: 'radial-gradient(ellipse at 30% 20%, #f8fafc 0%, #f1f5f9 60%, #e2e8f0 100%)',
    isDark: false,
    headerBg: 'rgba(248, 250, 252, 0.95)',
    headerBorder: 'rgba(148, 163, 184, 0.3)',
    toggleBg: 'rgba(241, 245, 249, 0.85)',
    divider: 'rgba(0,0,0,0.07)',
    panelBg: 'rgba(248, 250, 252, 0.98)',
    panelBorder: 'rgba(148, 163, 184, 0.35)',
    cardBg: 'rgba(0,0,0,0.03)',
    cardBorder: 'rgba(0,0,0,0.1)',
    titleText: '#0f172a',
    bodyText: '#334155',
    mutedText: '#64748b',
    hintText: '#94a3b8',
    accent: '#2563eb',
    accentLight: '#3b82f6',
    accentBorder: 'rgba(37,99,235,0.3)',
    accentBg: 'rgba(37,99,235,0.08)',
    accentBtn: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
  },
  sand: {
    label: 'Sand',
    swatch: '#a8896c',
    background: 'radial-gradient(ellipse at 30% 20%, #f5f0eb 0%, #ede8e0 60%, #ddd4c6 100%)',
    isDark: false,
    headerBg: 'rgba(245, 240, 235, 0.95)',
    headerBorder: 'rgba(120, 113, 108, 0.2)',
    toggleBg: 'rgba(238, 234, 227, 0.85)',
    divider: 'rgba(0,0,0,0.06)',
    panelBg: 'rgba(245, 240, 235, 0.98)',
    panelBorder: 'rgba(120, 113, 108, 0.25)',
    cardBg: 'rgba(0,0,0,0.02)',
    cardBorder: 'rgba(0,0,0,0.09)',
    titleText: '#1c1917',
    bodyText: '#44403c',
    mutedText: '#78716c',
    hintText: '#a8a29e',
    accent: '#0d9488',
    accentLight: '#14b8a6',
    accentBorder: 'rgba(13,148,136,0.3)',
    accentBg: 'rgba(13,148,136,0.08)',
    accentBtn: 'linear-gradient(135deg, #0d9488, #0f766e)',
  },
};

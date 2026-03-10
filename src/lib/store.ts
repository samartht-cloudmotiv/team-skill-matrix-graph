'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Person, Skill, Connection, Proficiency, NodeType, ColorPalette } from './types';

interface AppState {
  // Data
  people: Person[];
  skills: Skill[];
  connections: Connection[];
  isSeeded: boolean;

  // UI state (not persisted)
  selectedNodeId: string | null;
  selectedNodeType: NodeType | null;
  highlightedNodeIds: Set<string>;

  // Person CRUD
  addPerson: (person: Omit<Person, 'id'>) => string;
  updatePerson: (id: string, updates: Partial<Omit<Person, 'id'>>) => void;
  deletePerson: (id: string) => void;

  // Skill CRUD
  addSkill: (skill: Omit<Skill, 'id'>) => string;
  updateSkill: (id: string, updates: Partial<Omit<Skill, 'id'>>) => void;
  deleteSkill: (id: string) => void;

  // Connection CRUD
  addConnection: (conn: Omit<Connection, 'id'>) => string;
  updateConnection: (id: string, proficiency: Proficiency) => void;
  deleteConnection: (id: string) => void;

  // Theme
  palette: ColorPalette;
  setPalette: (palette: ColorPalette) => void;

  // UI actions
  setSelectedNode: (id: string | null, type: NodeType | null) => void;
  setHighlightedNodes: (ids: Set<string>) => void;
  markSeeded: () => void;
  seedData: (people: Person[], skills: Skill[], connections: Connection[]) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      people: [],
      skills: [],
      connections: [],
      isSeeded: false,

      // Theme
      palette: 'navy' as ColorPalette,
      setPalette: (palette) => set({ palette }),

      // UI state
      selectedNodeId: null,
      selectedNodeType: null,
      highlightedNodeIds: new Set(),

      addPerson: (person) => {
        const id = nanoid(8);
        set((s) => ({ people: [...s.people, { ...person, id }] }));
        return id;
      },
      updatePerson: (id, updates) => {
        set((s) => ({
          people: s.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },
      deletePerson: (id) => {
        set((s) => ({
          people: s.people.filter((p) => p.id !== id),
          connections: s.connections.filter((c) => c.personId !== id),
        }));
        const { selectedNodeId } = get();
        if (selectedNodeId === id) {
          set({ selectedNodeId: null, selectedNodeType: null, highlightedNodeIds: new Set() });
        }
      },

      addSkill: (skill) => {
        const id = nanoid(8);
        set((s) => ({ skills: [...s.skills, { ...skill, id }] }));
        return id;
      },
      updateSkill: (id, updates) => {
        set((s) => ({
          skills: s.skills.map((sk) => (sk.id === id ? { ...sk, ...updates } : sk)),
        }));
      },
      deleteSkill: (id) => {
        set((s) => ({
          skills: s.skills.filter((sk) => sk.id !== id),
          connections: s.connections.filter((c) => c.skillId !== id),
        }));
        const { selectedNodeId } = get();
        if (selectedNodeId === id) {
          set({ selectedNodeId: null, selectedNodeType: null, highlightedNodeIds: new Set() });
        }
      },

      addConnection: (conn) => {
        const id = nanoid(8);
        set((s) => ({ connections: [...s.connections, { ...conn, id }] }));
        return id;
      },
      updateConnection: (id, proficiency) => {
        set((s) => ({
          connections: s.connections.map((c) => (c.id === id ? { ...c, proficiency } : c)),
        }));
      },
      deleteConnection: (id) => {
        set((s) => ({ connections: s.connections.filter((c) => c.id !== id) }));
      },

      setSelectedNode: (id, type) => {
        const { connections, people, skills } = get();
        if (!id) {
          set({ selectedNodeId: null, selectedNodeType: null, highlightedNodeIds: new Set() });
          return;
        }
        // Compute highlighted nodes (connected to selected)
        const highlighted = new Set<string>();
        highlighted.add(id);
        if (type === 'person') {
          const personConns = connections.filter((c) => c.personId === id);
          personConns.forEach((c) => highlighted.add(c.skillId));
        } else if (type === 'skill') {
          const skillConns = connections.filter((c) => c.skillId === id);
          skillConns.forEach((c) => highlighted.add(c.personId));
        }
        set({ selectedNodeId: id, selectedNodeType: type, highlightedNodeIds: highlighted });
      },

      setHighlightedNodes: (ids) => set({ highlightedNodeIds: ids }),

      markSeeded: () => set({ isSeeded: true }),

      seedData: (people, skills, connections) => {
        set({ people, skills, connections, isSeeded: true });
      },
    }),
    {
      name: 'skill-matrix-v1',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
        return localStorage;
      }),
      partialize: (state) => ({
        people: state.people,
        skills: state.skills,
        connections: state.connections,
        isSeeded: state.isSeeded,
        palette: state.palette,
      }),
    }
  )
);

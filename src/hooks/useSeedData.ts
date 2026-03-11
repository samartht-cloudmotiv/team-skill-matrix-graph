'use client';

import { useEffect } from 'react';
import Papa from 'papaparse';
import { useStore } from '@/lib/store';
import { Person, Skill, Connection, Proficiency, SkillCategory } from '@/lib/types';

export function useSeedData(hydrated: boolean) {
  const { isSeeded, seedData } = useStore();

  useEffect(() => {
    if (!hydrated || isSeeded) return;

    async function loadAndSeed() {
      try {
        const [peopleText, skillsText, connsText] = await Promise.all([
          fetch('/data/people.csv').then((r) => r.text()),
          fetch('/data/skills.csv').then((r) => r.text()),
          fetch('/data/connections.csv').then((r) => r.text()),
        ]);

        const people: Person[] = (Papa.parse(peopleText, { header: true, skipEmptyLines: true }).data as any[]).map(
          (row) => ({ id: row.id, name: row.name, role: row.role })
        );

        const skills: Skill[] = (Papa.parse(skillsText, { header: true, skipEmptyLines: true }).data as any[]).map(
          (row) => ({ id: row.id, name: row.name, category: row.category as SkillCategory })
        );

        const connections: Connection[] = (
          Papa.parse(connsText, { header: true, skipEmptyLines: true }).data as any[]
        ).map((row, i) => ({
          id: `seed-conn-${i}`,
          personId: row.person_id,
          skillId: row.skill_id,
          proficiency: row.proficiency as Proficiency,
        }));

        seedData(people, skills, connections);
      } catch (err) {
        console.error('Failed to load seed data:', err);
      }
    }

    loadAndSeed();
  }, [hydrated, isSeeded, seedData]);
}

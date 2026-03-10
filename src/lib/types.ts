export type Proficiency = 'learning' | 'familiar' | 'expert';

export type SkillCategory = 'Frontend' | 'Backend' | 'DevOps' | 'Design' | 'Data' | 'Other';

export interface Person {
  id: string;
  name: string;
  role: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
}

export interface Connection {
  id: string;
  personId: string;
  skillId: string;
  proficiency: Proficiency;
}

export type NodeType = 'person' | 'skill';

export type ColorPalette = 'navy' | 'slate' | 'emerald' | 'violet' | 'pearl' | 'sand';

export interface PersonNodeData extends Record<string, unknown> {
  id: string;
  name: string;
  role: string;
  isSelected: boolean;
  isDimmed: boolean;
  connectionCount: number;
}

export interface SkillNodeData extends Record<string, unknown> {
  id: string;
  name: string;
  category: SkillCategory;
  isSelected: boolean;
  isDimmed: boolean;
  expertCount: number;
  totalCount: number;
}

export interface ProficiencyEdgeData extends Record<string, unknown> {
  proficiency: Proficiency;
  connectionId: string;
  isDimmed: boolean;
}

/**
 * Skill Data Model
 * Defines the structure for skills and technologies
 */

export type SkillTrend = 'bullish' | 'high' | 'stable' | 'bearish' | 'declining';

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string; // Icon name from lucide-react
  trend: SkillTrend;
  proficiency?: number; // 1-100
  yearsOfExperience?: number;
  featured?: boolean;
  order?: number;
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSkillDTO {
  name: string;
  category: string;
  icon?: string;
  trend: SkillTrend;
  proficiency?: number;
  yearsOfExperience?: number;
  featured?: boolean;
}

export interface UpdateSkillDTO extends Partial<CreateSkillDTO> {
  id: string;
}

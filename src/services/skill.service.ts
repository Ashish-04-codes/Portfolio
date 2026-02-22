/**
 * Skill Service
 * CRUD operations for managing skills via Firestore
 */

import { Skill, CreateSkillDTO, UpdateSkillDTO } from '../models';
import { getCollection, getDocument, saveDocument, removeDocument } from './firestore.service';
import { generateId } from '../utils/helpers';

const COLLECTION = 'skills';

class SkillService {
  /**
   * Get all skills
   */
  async getAll(): Promise<Skill[]> {
    const skills = await getCollection<Skill>(COLLECTION);
    return skills.sort((a, b) => (a.order || 999) - (b.order || 999));
  }

  /**
   * Get a single skill by ID
   */
  async getById(id: string): Promise<Skill | null> {
    return getDocument<Skill>(COLLECTION, id);
  }

  /**
   * Get featured skills only
   */
  async getFeatured(): Promise<Skill[]> {
    const skills = await this.getAll();
    return skills.filter(s => s.featured === true);
  }

  /**
   * Get skills by category
   */
  async getByCategory(category: string): Promise<Skill[]> {
    const skills = await this.getAll();
    return skills.filter(s => s.category === category);
  }

  /**
   * Create a new skill
   */
  async create(data: CreateSkillDTO): Promise<Skill> {
    const skills = await this.getAll();
    const newSkill: Skill = {
      ...data,
      id: generateId(),
      order: skills.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveDocument(COLLECTION, newSkill.id, newSkill as unknown as Record<string, unknown>);
    return newSkill;
  }

  /**
   * Update a skill
   */
  async update(data: UpdateSkillDTO): Promise<Skill | null> {
    const existing = await this.getById(data.id);
    if (!existing) return null;

    const updatedSkill: Skill = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await saveDocument(COLLECTION, data.id, updatedSkill as unknown as Record<string, unknown>);
    return updatedSkill;
  }

  /**
   * Delete a skill
   */
  async delete(id: string): Promise<boolean> {
    const existing = await this.getById(id);
    if (!existing) return false;

    await removeDocument(COLLECTION, id);
    return true;
  }

  /**
   * Reorder skills
   */
  async reorder(skillIds: string[]): Promise<void> {
    const skills = await this.getAll();
    const updates = skillIds.map(async (id, index) => {
      const skill = skills.find(s => s.id === id);
      if (skill) {
        skill.order = index;
        skill.updatedAt = new Date().toISOString();
        await saveDocument(COLLECTION, id, skill as unknown as Record<string, unknown>);
      }
    });
    await Promise.all(updates);
  }
}

export const skillService = new SkillService();

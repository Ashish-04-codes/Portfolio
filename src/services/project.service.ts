/**
 * Project Service
 * CRUD operations for managing projects via Firestore
 */

import { Project, CreateProjectDTO, UpdateProjectDTO } from '../models';
import { getCollection, getDocument, saveDocument, removeDocument } from './firestore.service';
import { generateId } from '../utils/helpers';

const COLLECTION = 'projects';

class ProjectService {
  /**
   * Get all projects
   */
  async getAll(): Promise<Project[]> {
    const projects = await getCollection<Project>(COLLECTION);
    return projects.sort((a, b) => (a.order || 999) - (b.order || 999));
  }

  /**
   * Get a single project by ID
   */
  async getById(id: string): Promise<Project | null> {
    return getDocument<Project>(COLLECTION, id);
  }

  /**
   * Get published projects only
   */
  async getPublished(): Promise<Project[]> {
    const projects = await this.getAll();
    return projects.filter(p => p.published !== false);
  }

  /**
   * Get featured projects
   */
  async getFeatured(): Promise<Project[]> {
    const projects = await this.getPublished();
    return projects.filter(p => p.featured === true);
  }

  /**
   * Create a new project
   */
  async create(data: CreateProjectDTO): Promise<Project> {
    const projects = await this.getAll();
    const newProject: Project = {
      ...data,
      id: generateId(),
      order: projects.length,
      published: data.published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveDocument(COLLECTION, newProject.id, newProject as unknown as Record<string, unknown>);
    return newProject;
  }

  /**
   * Update a project
   */
  async update(data: UpdateProjectDTO): Promise<Project | null> {
    const existing = await this.getById(data.id);
    if (!existing) return null;

    const updatedProject: Project = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await saveDocument(COLLECTION, data.id, updatedProject as unknown as Record<string, unknown>);
    return updatedProject;
  }

  /**
   * Delete a project
   */
  async delete(id: string): Promise<boolean> {
    const existing = await this.getById(id);
    if (!existing) return false;

    await removeDocument(COLLECTION, id);
    return true;
  }

  /**
   * Reorder projects
   */
  async reorder(projectIds: string[]): Promise<void> {
    const projects = await this.getAll();
    const updates = projectIds.map(async (id, index) => {
      const project = projects.find(p => p.id === id);
      if (project) {
        project.order = index;
        project.updatedAt = new Date().toISOString();
        await saveDocument(COLLECTION, id, project as unknown as Record<string, unknown>);
      }
    });
    await Promise.all(updates);
  }
}

export const projectService = new ProjectService();

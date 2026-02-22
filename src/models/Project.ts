/**
 * Project Data Model
 * Defines the structure for portfolio projects
 */

export type ProjectLayout = 
  | 'featured' 
  | 'standard' 
  | 'inverted' 
  | 'text-only' 
  | 'sidebar-image' 
  | 'placeholder';

export interface ProjectLinks {
  demo?: string;
  repo?: string;
}

export interface Project {
  id: string;
  title: string;
  year: string;
  category: string;
  layout: ProjectLayout;
  shortDesc: string;
  fullDesc?: string;
  image?: string;
  techStack?: string[];
  challenge?: string;
  solution?: string;
  links?: ProjectLinks;
  // Metadata
  featured?: boolean;
  order?: number;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectDTO {
  title: string;
  year: string;
  category: string;
  layout: ProjectLayout;
  shortDesc: string;
  fullDesc?: string;
  image?: string;
  techStack?: string[];
  challenge?: string;
  solution?: string;
  links?: ProjectLinks;
  featured?: boolean;
  published?: boolean;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  id: string;
}

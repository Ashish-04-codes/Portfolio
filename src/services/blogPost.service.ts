/**
 * Blog Post Service
 * CRUD operations for managing blog posts via Firestore
 */

import { BlogPost, CreateBlogPostDTO, UpdateBlogPostDTO } from '../models';
import { getCollection, getDocument, saveDocument, removeDocument } from './firestore.service';
import { generateId } from '../utils/helpers';

const COLLECTION = 'blog_posts';

class BlogPostService {
  /**
   * Get all blog posts
   */
  async getAll(): Promise<BlogPost[]> {
    const posts = await getCollection<BlogPost>(COLLECTION);
    return posts.sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  }

  /**
   * Get a single blog post by ID
   */
  async getById(id: string): Promise<BlogPost | null> {
    return getDocument<BlogPost>(COLLECTION, id);
  }

  /**
   * Get published blog posts only
   */
  async getPublished(): Promise<BlogPost[]> {
    const posts = await this.getAll();
    return posts.filter((p) => p.published !== false);
  }

  /**
   * Get featured blog posts
   */
  async getFeatured(): Promise<BlogPost[]> {
    const posts = await this.getPublished();
    return posts.filter((p) => p.featured === true);
  }

  /**
   * Create a new blog post
   */
  async create(data: CreateBlogPostDTO): Promise<BlogPost> {
    const newPost: BlogPost = {
      ...data,
      id: generateId(),
      published: data.published !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveDocument(COLLECTION, newPost.id, newPost as unknown as Record<string, unknown>);
    return newPost;
  }

  /**
   * Update a blog post
   */
  async update(data: UpdateBlogPostDTO): Promise<BlogPost | null> {
    const existing = await this.getById(data.id);
    if (!existing) return null;

    const updatedPost: BlogPost = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await saveDocument(COLLECTION, data.id, updatedPost as unknown as Record<string, unknown>);
    return updatedPost;
  }

  /**
   * Delete a blog post
   */
  async delete(id: string): Promise<boolean> {
    const existing = await this.getById(id);
    if (!existing) return false;

    await removeDocument(COLLECTION, id);
    return true;
  }
}

export const blogPostService = new BlogPostService();

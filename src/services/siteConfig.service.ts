/**
 * Site Config Service
 * CRUD operations for managing site configuration via Firestore
 */

import { SiteConfig } from '../models';
import { getDocument, saveDocument, removeDocument } from './firestore.service';
import { generateId } from '../utils/helpers';

const COLLECTION = 'site_config';
const DOC_ID = 'main';

class SiteConfigService {
  /**
   * Get the site configuration
   */
  async get(): Promise<SiteConfig | null> {
    return getDocument<SiteConfig>(COLLECTION, DOC_ID);
  }

  /**
   * Update the site configuration
   */
  async update(data: Partial<Omit<SiteConfig, 'id'>>): Promise<SiteConfig> {
    const existingConfig = await this.get();

    const config: SiteConfig = {
      ...existingConfig,
      ...data,
      id: existingConfig?.id || generateId(),
      updatedAt: new Date().toISOString(),
    } as SiteConfig;

    await saveDocument(COLLECTION, DOC_ID, config as unknown as Record<string, unknown>);
    return config;
  }

  /**
   * Reset to default configuration
   */
  async reset(): Promise<void> {
    await removeDocument(COLLECTION, DOC_ID);
  }
}

export const siteConfigService = new SiteConfigService();

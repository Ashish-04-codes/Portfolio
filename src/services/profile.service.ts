/**
 * Profile Service
 * CRUD operations for managing profile data via Firestore
 */

import { Profile, CreateProfileDTO, UpdateProfileDTO } from '../models';
import { getDocument, saveDocument, removeDocument } from './firestore.service';
import { logger } from '../utils/logger';
import { generateId } from '../utils/helpers';

const COLLECTION = 'profile';
const DOC_ID = 'main';

class ProfileService {
  /**
   * Get the profile
   */
  async get(): Promise<Profile | null> {
    return getDocument<Profile>(COLLECTION, DOC_ID);
  }

  /**
   * Create or update the profile
   */
  async save(data: CreateProfileDTO | UpdateProfileDTO): Promise<Profile> {
    const existingProfile = await this.get();

    // Use nullish coalescing (??) instead of || to preserve empty strings
    const sectionsArray = data.sections ?? existingProfile?.sections ?? [];

    const profile = {
      id: existingProfile?.id || generateId(),
      name: data.name ?? existingProfile?.name ?? '',
      title: data.title ?? existingProfile?.title ?? '',
      location: data.location ?? existingProfile?.location ?? '',
      bio: data.bio ?? existingProfile?.bio ?? '',
      profileImage: data.profileImage ?? existingProfile?.profileImage,
      sections: sectionsArray.map((section, index) => ({
        ...section,
        id: 'id' in section && section.id ? section.id : generateId(),
        order: section.order ?? index,
      })),
      vitals: {
        experience: data.vitals?.experience ?? existingProfile?.vitals?.experience ?? '',
        level: data.vitals?.level ?? existingProfile?.vitals?.level ?? '',
        location: data.vitals?.location ?? existingProfile?.vitals?.location ?? '',
        status: data.vitals?.status ?? existingProfile?.vitals?.status ?? '',
      },
      email: data.email ?? existingProfile?.email,
      github: data.github ?? existingProfile?.github,
      linkedin: data.linkedin ?? existingProfile?.linkedin,
      twitter: data.twitter ?? existingProfile?.twitter,
      website: data.website ?? existingProfile?.website,
      createdAt: existingProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Profile;

    await saveDocument(COLLECTION, DOC_ID, profile as unknown as Record<string, unknown>);
    logger.debug('[ProfileService] Saved profile', {
      name: profile.name,
      title: profile.title,
      location: profile.location,
    });
    return profile;
  }

  /**
   * Delete the profile
   */
  async delete(): Promise<boolean> {
    await removeDocument(COLLECTION, DOC_ID);
    return true;
  }
}

export const profileService = new ProfileService();

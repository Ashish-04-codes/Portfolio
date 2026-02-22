/**
 * Profile Data Model
 * Defines the structure for about/bio information
 */

export interface ProfileSection {
  id: string;
  heading: string;
  subheading: string;
  content: string;
  order: number;
}

export interface ProfileVitals {
  experience: string;
  level: string;
  location: string;
  status: string;
  availability?: string;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  location: string;
  bio: string;
  profileImage?: string;
  sections: ProfileSection[];
  vitals: ProfileVitals;
  // Social Links
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  // Metadata
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProfileDTO {
  name: string;
  title: string;
  location: string;
  bio: string;
  profileImage?: string;
  sections: Omit<ProfileSection, 'id'>[];
  vitals: ProfileVitals;
  email?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface UpdateProfileDTO extends Partial<CreateProfileDTO> {
  id: string;
}

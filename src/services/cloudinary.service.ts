/**
 * Cloudinary Service
 * Handle image uploads to Cloudinary
 * Configuration loaded from environment variables
 */

import { logger } from '../utils/logger';

// Validate required environment variables
if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
  throw new Error('Missing VITE_CLOUDINARY_CLOUD_NAME in .env file');
}
if (!import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) {
  throw new Error('Missing VITE_CLOUDINARY_UPLOAD_PRESET in .env file');
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

class CloudinaryService {
  /**
   * Upload an image to Cloudinary
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('cloud_name', CLOUD_NAME);

    try {
      const response = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: CloudinaryUploadResponse = await response.json();
      return data.secure_url;
    } catch (error) {
      logger.error('Error uploading to Cloudinary', { error });
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Upload multiple images
   */
  async uploadMultipleImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  /**
   * Get optimized image URL
   */
  getOptimizedUrl(
    url: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'auto' | 'jpg' | 'png' | 'webp';
    } = {}
  ): string {
    if (!url.includes('cloudinary.com')) {
      return url;
    }

    const { width, height, quality = 80, format = 'auto' } = options;
    const transformations: string[] = [];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    transformations.push(`q_${quality}`);
    transformations.push(`f_${format}`);

    const transformString = transformations.join(',');
    return url.replace('/upload/', `/upload/${transformString}/`);
  }
}

export const cloudinaryService = new CloudinaryService();

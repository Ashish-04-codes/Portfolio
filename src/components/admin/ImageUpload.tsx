/**
 * ImageUpload Component
 * Upload images to Cloudinary with preview
 */

import React, { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { cloudinaryService } from '../../services';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  helperText?: string;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  helperText,
  required = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const url = await cloudinaryService.uploadImage(file);
      onChange(url);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block font-mono text-sm font-bold uppercase tracking-wide mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      <div className="space-y-3">
        {/* Image Preview */}
        {value && (
          <div className="relative border-2 border-ink p-2 bg-surface">
            <img src={value} alt="Preview" className="w-full h-48 object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-4 right-4 p-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
              title="Remove image"
            >
              <X size={16} />
            </button>
            <p className="mt-2 font-mono text-xs text-ink/60 break-all">{value}</p>
          </div>
        )}

        {/* Upload Button */}
        {!value && (
          <div className="border-2 border-dashed border-ink p-8 text-center bg-surface hover:bg-newsprint transition-colors">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <div className="flex flex-col items-center gap-3">
                {uploading ? (
                  <>
                    <Loader size={32} className="animate-spin text-ink/60" />
                    <span className="font-mono text-sm uppercase tracking-wide">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={32} className="text-ink/60" />
                    <div>
                      <span className="font-mono text-sm uppercase tracking-wide block">
                        Click to upload image
                      </span>
                      <span className="font-mono text-xs text-ink/60 block mt-1">
                        PNG, JPG, GIF up to 5MB
                      </span>
                    </div>
                  </>
                )}
              </div>
            </label>
          </div>
        )}

        {/* Manual URL Input (fallback) */}
        {!value && !uploading && (
          <div className="relative">
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-2 border-2 border-ink font-body text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
              placeholder="Or paste image URL directly..."
            />
          </div>
        )}

        {/* Error Message */}
        {error && <p className="mt-1 text-sm text-red-600 font-mono">{error}</p>}

        {/* Helper Text */}
        {helperText && !error && <p className="mt-1 text-sm text-ink/60 font-mono">{helperText}</p>}
      </div>
    </div>
  );
};

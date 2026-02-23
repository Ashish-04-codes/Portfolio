/**
 * ImageUpload Component
 * Upload images to Cloudinary with preview, or paste a direct URL
 */

import React, { useState } from 'react';
import { Upload, X, Loader, Link as LinkIcon, ImageOff } from 'lucide-react';
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
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [imgError, setImgError] = useState(false);

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
    setImgError(false);
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

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setImgError(false);
      onChange(urlInput.trim());
      setUrlInput('');
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setError('');
    setImgError(false);
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
            {imgError ? (
              <div className="w-full h-48 flex flex-col items-center justify-center bg-newsprint text-ink/40">
                <ImageOff size={40} className="mb-2" />
                <p className="font-mono text-xs">Image could not be loaded</p>
                <p className="font-mono text-[10px] mt-1 text-ink/30">
                  The URL may block external embedding (hotlinking)
                </p>
              </div>
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={() => setImgError(true)}
              />
            )}
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

        {/* Upload / URL Options */}
        {!value && (
          <>
            {/* File Upload */}
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

            {/* URL Input Toggle */}
            {!uploading && (
              <div>
                {showUrlInput ? (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
                      className="flex-1 px-4 py-2 border-2 border-ink bg-surface text-ink font-body text-sm focus:outline-none focus:ring-2 focus:ring-ink/20"
                      placeholder="https://example.com/image.jpg"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleUrlSubmit}
                      className="px-4 py-2 border-2 border-ink bg-ink text-newsprint font-mono text-xs uppercase hover:bg-ink/80 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowUrlInput(false); setUrlInput(''); }}
                      className="px-3 py-2 border-2 border-ink font-mono text-xs hover:bg-surface transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-ink font-mono text-xs uppercase tracking-wide hover:bg-surface transition-colors"
                  >
                    <LinkIcon size={14} />
                    Or paste image URL
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Error Message */}
        {error && <p className="mt-1 text-sm text-red-600 font-mono">{error}</p>}

        {/* Helper Text */}
        {helperText && !error && <p className="mt-1 text-sm text-ink/60 font-mono">{helperText}</p>}
      </div>
    </div>
  );
};

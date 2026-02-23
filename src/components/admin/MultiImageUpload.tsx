/**
 * MultiImageUpload Component
 * Upload and manage multiple images for a project gallery
 */

import React, { useState } from 'react';
import { Upload, X, Loader, Link as LinkIcon, ImageOff, GripVertical } from 'lucide-react';
import { cloudinaryService } from '../../services';

interface MultiImageUploadProps {
    label?: string;
    images: string[];
    onChange: (images: string[]) => void;
    helperText?: string;
    maxImages?: number;
}

export const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
    label,
    images = [],
    onChange,
    helperText,
    maxImages = 10,
}) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        // Validate all files
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Please select only image files');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('Each image must be less than 5MB');
                return;
            }
        }

        if (images.length + files.length > maxImages) {
            setError(`Maximum ${maxImages} images allowed`);
            return;
        }

        setError('');
        setUploading(true);

        try {
            const uploadPromises = files.map((file) => cloudinaryService.uploadImage(file));
            const urls = await Promise.all(uploadPromises);
            onChange([...images, ...urls]);
        } catch (err: any) {
            setError(err.message || 'Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            if (images.length >= maxImages) {
                setError(`Maximum ${maxImages} images allowed`);
                return;
            }
            onChange([...images, urlInput.trim()]);
            setUrlInput('');
            setShowUrlInput(false);
        }
    };

    const handleRemove = (index: number) => {
        onChange(images.filter((_, i) => i !== index));
    };

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newImages = [...images];
        [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
        onChange(newImages);
    };

    const handleMoveDown = (index: number) => {
        if (index === images.length - 1) return;
        const newImages = [...images];
        [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
        onChange(newImages);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block font-mono text-sm font-bold uppercase tracking-wide mb-2">
                    {label}
                    <span className="font-normal text-ink/50 ml-2">
                        ({images.length}/{maxImages})
                    </span>
                </label>
            )}

            <div className="space-y-3">
                {/* Image Gallery Preview */}
                {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {images.map((url, index) => (
                            <ImagePreviewCard
                                key={`${url}-${index}`}
                                url={url}
                                index={index}
                                total={images.length}
                                onRemove={() => handleRemove(index)}
                                onMoveUp={() => handleMoveUp(index)}
                                onMoveDown={() => handleMoveDown(index)}
                            />
                        ))}
                    </div>
                )}

                {/* Add More Images */}
                {images.length < maxImages && (
                    <>
                        {/* File Upload */}
                        <div className="border-2 border-dashed border-ink p-6 text-center bg-surface hover:bg-newsprint transition-colors">
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <div className="flex flex-col items-center gap-2">
                                    {uploading ? (
                                        <>
                                            <Loader size={24} className="animate-spin text-ink/60" />
                                            <span className="font-mono text-xs uppercase">Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={24} className="text-ink/60" />
                                            <span className="font-mono text-xs uppercase">
                                                Click to upload images (multiple allowed)
                                            </span>
                                        </>
                                    )}
                                </div>
                            </label>
                        </div>

                        {/* URL Input */}
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

                {error && <p className="mt-1 text-sm text-red-600 font-mono">{error}</p>}
                {helperText && !error && <p className="mt-1 text-sm text-ink/60 font-mono">{helperText}</p>}
            </div>
        </div>
    );
};

// Individual image preview card
const ImagePreviewCard: React.FC<{
    url: string;
    index: number;
    total: number;
    onRemove: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
}> = ({ url, index, total, onRemove, onMoveUp, onMoveDown }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <div className="relative group border-2 border-ink bg-surface">
            {imgError ? (
                <div className="w-full h-28 flex flex-col items-center justify-center text-ink/30">
                    <ImageOff size={24} />
                    <p className="font-mono text-[9px] mt-1">Failed to load</p>
                </div>
            ) : (
                <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-28 object-cover"
                    onError={() => setImgError(true)}
                />
            )}

            {/* Overlay with controls */}
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/60 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {index > 0 && (
                    <button
                        type="button"
                        onClick={onMoveUp}
                        className="p-1.5 bg-newsprint text-ink text-xs font-mono hover:bg-newsprint/90"
                        title="Move left"
                    >
                        ←
                    </button>
                )}
                <button
                    type="button"
                    onClick={onRemove}
                    className="p-1.5 bg-red-600 text-white hover:bg-red-700"
                    title="Remove"
                >
                    <X size={14} />
                </button>
                {index < total - 1 && (
                    <button
                        type="button"
                        onClick={onMoveDown}
                        className="p-1.5 bg-newsprint text-ink text-xs font-mono hover:bg-newsprint/90"
                        title="Move right"
                    >
                        →
                    </button>
                )}
            </div>

            {/* Index badge */}
            <div className="absolute top-1 left-1 bg-ink text-newsprint font-mono text-[9px] px-1.5 py-0.5">
                {index + 1}
            </div>
        </div>
    );
};

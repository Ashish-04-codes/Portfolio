import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Profile, ProfileSection } from '../../models';
import { profileService, activityService, authService } from '../../services';
import { generateId } from '../../utils/helpers';
import {
  Card,
  Button,
  Input,
  Textarea,
  ImageUpload,
  Breadcrumb,
  LoadingSpinner,
} from '../../components/admin';
import { Save, Plus, Trash2, User } from 'lucide-react';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { logger } from '../../utils/logger';

interface ToastActions {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const AdminProfile: React.FC = () => {
  const navigate = useAppNavigate();
  const toast = useOutletContext<ToastActions>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    title: '',
    location: '',
    bio: '',
    profileImage: '',
    sections: [],
    vitals: { experience: '', level: '', location: '', status: '' },
    email: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  // Listen for storage changes (soft refresh - no loading spinner)
  useEffect(() => {
    const handleStorageChange = () => {
      profileService.get().then(profile => {
        if (profile) {
          setFormData(profile);
        }
      });
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const profile = await profileService.get();
    if (profile) {
      setFormData(profile);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      logger.debug('[AdminProfile] Saving profile', { name: formData.name, title: formData.title, location: formData.location });
      const savedProfile = await profileService.save(formData as any);
      // Directly update local state with saved data - no loading spinner
      setFormData(savedProfile);
      activityService.log({
        action: 'update',
        entityType: 'profile',
        entityName: formData.name,
        userEmail: authService.getUserEmail(),
      });

      toast.success('Profile saved successfully!');
    } catch (error) {
      logger.error('Error saving profile', { error });
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    const newSection: ProfileSection = {
      id: generateId(),
      heading: '',
      subheading: '',
      content: '',
      order: formData.sections?.length || 0,
    };
    setFormData({
      ...formData,
      sections: [...(formData.sections || []), newSection],
    });
  };

  const updateSection = (index: number, field: keyof ProfileSection, value: string) => {
    const sections = [...(formData.sections || [])];
    sections[index] = { ...sections[index], [field]: value };
    setFormData({ ...formData, sections });
  };

  const removeSection = (index: number) => {
    const sections = (formData.sections || []).filter((_, i) => i !== index);
    setFormData({ ...formData, sections });
  };

  if (loading) {
    return <LoadingSpinner centered message="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb currentPage="admin-profile" onNavigate={navigate} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-black text-3xl uppercase tracking-tight">
            Profile Editor
          </h2>
          <p className="font-mono text-sm text-ink/60 mt-1">
            Edit your personal information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card title="Basic Information" subtitle="Your name and professional title">
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
            />

            <Input
              label="Professional Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Full Stack Developer"
            />

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="San Francisco, CA"
            />

            <Textarea
              label="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              placeholder="Brief professional summary"
            />

            <ImageUpload
              label="Profile Picture"
              value={formData.profileImage || ''}
              onChange={(url) => setFormData({ ...formData, profileImage: url })}
            />
          </div>
        </Card>

        {/* Professional Vitals */}
        <Card title="Professional Vitals" subtitle="Quick facts displayed on About page">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Experience"
              value={formData.vitals?.experience || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vitals: { ...formData.vitals, experience: e.target.value } as any,
                })
              }
              placeholder="5+ years"
            />

            <Input
              label="Level"
              value={formData.vitals?.level || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vitals: { ...formData.vitals, level: e.target.value } as any,
                })
              }
              placeholder="Senior Developer"
            />

            <Input
              label="Location"
              value={formData.vitals?.location || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vitals: { ...formData.vitals, location: e.target.value } as any,
                })
              }
              placeholder="Remote / Hybrid"
            />

            <Input
              label="Status"
              value={formData.vitals?.status || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vitals: { ...formData.vitals, status: e.target.value } as any,
                })
              }
              placeholder="Available for hire"
            />
          </div>
        </Card>

        {/* About Sections */}
        <Card
          title="About Sections"
          subtitle="Multiple sections for your About page"
        >
          <div className="space-y-4">
            {formData.sections?.map((section, index) => (
              <div key={index} className="p-4 border-2 border-ink/20 bg-surface space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase text-ink/60">
                    Section {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="p-1 hover:bg-red-100 text-red-600 transition-colors"
                    title="Remove section"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <Input
                  label="Section Heading"
                  value={section.heading || ''}
                  onChange={(e) => updateSection(index, 'heading' as keyof ProfileSection, e.target.value)}
                  placeholder="e.g., On Approach"
                />

                <Input
                  label="Subheading"
                  value={section.subheading || ''}
                  onChange={(e) => updateSection(index, 'subheading' as keyof ProfileSection, e.target.value)}
                  placeholder="e.g., Performance First"
                />

                <Textarea
                  label="Content"
                  value={section.content}
                  onChange={(e) => updateSection(index, 'content', e.target.value)}
                  rows={4}
                  placeholder="Section content"
                />
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addSection}>
              <Plus size={16} className="mr-2" />
              Add Section
            </Button>
          </div>
        </Card>

        {/* Contact & Social Links */}
        <Card title="Contact & Social Links" subtitle="How people can reach you">
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@example.com"
            />

            <Input
              label="GitHub"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              placeholder="https://github.com/username"
            />

            <Input
              label="LinkedIn"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />

            <Input
              label="Twitter/X"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              placeholder="https://twitter.com/username"
            />

            <Input
              label="Website"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3 justify-end sticky bottom-4">
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            size="lg"
            className="shadow-lg"
          >
            {saving ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SiteConfig } from '../../models';
import { siteConfigService, activityService, authService } from '../../services';
import {
  Card,
  Button,
  Input,
  Textarea,
  ImageUpload,
  Breadcrumb,
  LoadingSpinner,
} from '../../components/admin';
import { Save, Settings } from 'lucide-react';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { logger } from '../../utils/logger';

interface ToastActions {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const AdminConfig: React.FC = () => {
  const navigate = useAppNavigate();
  const toast = useOutletContext<ToastActions>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<SiteConfig>>({
    siteTitle: 'The Daily Developer',
    tagline: 'Code. Create. Learn.',
    description: '',
    logo: '',
    seo: {
      metaDescription: '',
      keywords: [],
      ogImage: '',
    },
    analytics: {
      googleAnalyticsId: '',
      enableTracking: false,
    },
    social: {
      github: '',
      linkedin: '',
      twitter: '',
      email: '',
    },
    footer: {
      text: '',
      copyright: '',
      links: [],
    },
  });

  useEffect(() => {
    loadConfig();
  }, []);

  // Listen for storage changes from other tabs (soft refresh)
  useEffect(() => {
    const handleStorageChange = () => {
      siteConfigService.get().then((config) => {
        if (config) {
          setFormData(config);
        }
      });
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadConfig = async () => {
    setLoading(true);
    const config = await siteConfigService.get();
    if (config) {
      setFormData(config);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const savedConfig = await siteConfigService.update(formData as any);
      // Directly update local state with saved data
      setFormData(savedConfig);
      activityService.log({
        action: 'update',
        entityType: 'config',
        entityName: 'Site Configuration',
        userEmail: authService.getUserEmail(),
      });

      toast.success('Configuration saved successfully!');
    } catch (error) {
      logger.error('Error saving configuration', { error });
      toast.error('Failed to save configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const keywords = e.target.value.split(',').map((k) => k.trim());
    setFormData({
      ...formData,
      seo: { ...formData.seo, keywords } as any,
    });
  };

  if (loading) {
    return <LoadingSpinner centered message="Loading configuration..." />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb currentPage="admin-config" onNavigate={navigate} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-black text-3xl uppercase tracking-tight">
            Site Configuration
          </h2>
          <p className="font-mono text-sm text-ink/60 mt-1">Global settings and preferences</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Site Information */}
        <Card title="Basic Information" subtitle="Site title and branding">
          <div className="space-y-4">
            <Input
              label="Site Title"
              value={formData.siteTitle}
              onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
              required
              placeholder="The Daily Developer"
            />

            <Input
              label="Tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Code. Create. Learn."
            />

            <Textarea
              label="Site Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Brief description of your site"
            />

            <ImageUpload
              label="Site Logo"
              value={formData.logo || ''}
              onChange={(url) => setFormData({ ...formData, logo: url })}
            />
          </div>
        </Card>

        {/* SEO Settings */}
        <Card title="SEO Settings" subtitle="Search engine optimization">
          <div className="space-y-4">
            <Textarea
              label="Meta Description"
              value={formData.seo?.metaDescription || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, metaDescription: e.target.value } as any,
                })
              }
              rows={3}
              placeholder="Description for search results"
              helperText="Recommended: 150-160 characters"
            />

            <Textarea
              label="Keywords"
              value={formData.seo?.keywords?.join(', ') || ''}
              onChange={handleKeywordsChange}
              rows={2}
              placeholder="keyword1, keyword2, keyword3"
              helperText="Comma-separated list"
            />

            <ImageUpload
              label="Open Graph Image"
              value={formData.seo?.ogImage || ''}
              onChange={(url) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, ogImage: url } as any,
                })
              }
              helperText="Image shown when sharing on social media (1200x630px recommended)"
            />
          </div>
        </Card>

        {/* Analytics */}
        <Card title="Analytics" subtitle="Tracking and analytics settings">
          <div className="space-y-4">
            <Input
              label="Google Analytics ID"
              value={formData.analytics?.googleAnalyticsId || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  analytics: {
                    ...formData.analytics,
                    googleAnalyticsId: e.target.value,
                  } as any,
                })
              }
              placeholder="G-XXXXXXXXXX"
            />

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.analytics?.enableTracking || false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    analytics: {
                      ...formData.analytics,
                      enableTracking: e.target.checked,
                    } as any,
                  })
                }
                className="w-4 h-4 border-2 border-ink/20"
              />
              <span className="font-mono text-sm">Enable Analytics Tracking</span>
            </label>
          </div>
        </Card>

        {/* Social Media Links */}
        <Card title="Social Media" subtitle="Global social media links">
          <div className="space-y-4">
            <Input
              label="GitHub"
              value={formData.social?.github || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  social: { ...formData.social, github: e.target.value } as any,
                })
              }
              placeholder="https://github.com/username"
            />

            <Input
              label="LinkedIn"
              value={formData.social?.linkedin || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  social: { ...formData.social, linkedin: e.target.value } as any,
                })
              }
              placeholder="https://linkedin.com/in/username"
            />

            <Input
              label="Twitter/X"
              value={formData.social?.twitter || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  social: { ...formData.social, twitter: e.target.value } as any,
                })
              }
              placeholder="https://twitter.com/username"
            />

            <Input
              label="Contact Email"
              type="email"
              value={formData.social?.email || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  social: { ...formData.social, email: e.target.value } as any,
                })
              }
              placeholder="contact@example.com"
            />
          </div>
        </Card>

        {/* Footer Settings */}
        <Card title="Footer" subtitle="Footer text and copyright">
          <div className="space-y-4">
            <Textarea
              label="Footer Text"
              value={formData.footer?.text || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  footer: { ...formData.footer, text: e.target.value } as any,
                })
              }
              rows={2}
              placeholder="Footer description or message"
            />

            <Input
              label="Copyright Text"
              value={formData.footer?.copyright || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  footer: { ...formData.footer, copyright: e.target.value } as any,
                })
              }
              placeholder="© 2024 Your Name. All rights reserved."
            />
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3 justify-end sticky bottom-4">
          <Button type="submit" variant="primary" disabled={saving} size="lg" className="shadow-lg">
            {saving ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminConfig;

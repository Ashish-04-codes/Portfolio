/**
 * Admin Data Context
 * Centralized data cache for all admin panel pages.
 * Fetches all data once, provides refresh functions for CRUD updates.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Project, BlogPost, Profile, Skill, SiteConfig } from '../models';
import {
    projectService,
    blogPostService,
    profileService,
    skillService,
    siteConfigService,
} from '../services';

interface AdminData {
    projects: Project[];
    blogPosts: BlogPost[];
    profile: Profile | null;
    skills: Skill[];
    siteConfig: SiteConfig | null;
    loading: boolean;
    refreshProjects: () => Promise<void>;
    refreshBlogPosts: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    refreshSkills: () => Promise<void>;
    refreshSiteConfig: () => Promise<void>;
    refreshAll: () => Promise<void>;
}

const AdminDataContext = createContext<AdminData | undefined>(undefined);

interface AdminDataProviderProps {
    children: ReactNode;
}

export const AdminDataProvider: React.FC<AdminDataProviderProps> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProjects = useCallback(async () => {
        const data = await projectService.getAll();
        setProjects(data);
    }, []);

    const refreshBlogPosts = useCallback(async () => {
        const data = await blogPostService.getAll();
        setBlogPosts(data);
    }, []);

    const refreshProfile = useCallback(async () => {
        const data = await profileService.get();
        setProfile(data);
    }, []);

    const refreshSkills = useCallback(async () => {
        const data = await skillService.getAll();
        setSkills(data);
    }, []);

    const refreshSiteConfig = useCallback(async () => {
        const data = await siteConfigService.get();
        setSiteConfig(data);
    }, []);

    const refreshAll = useCallback(async () => {
        setLoading(true);
        await Promise.all([
            refreshProjects(),
            refreshBlogPosts(),
            refreshProfile(),
            refreshSkills(),
            refreshSiteConfig(),
        ]);
        setLoading(false);
    }, [refreshProjects, refreshBlogPosts, refreshProfile, refreshSkills, refreshSiteConfig]);

    // Initial data load
    useEffect(() => {
        refreshAll();
    }, [refreshAll]);

    // Listen for data changes from other tabs
    useEffect(() => {
        const handleStorageChange = () => {
            refreshAll();
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('dataUpdated', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('dataUpdated', handleStorageChange);
        };
    }, [refreshAll]);

    return (
        <AdminDataContext.Provider
            value={{
                projects,
                blogPosts,
                profile,
                skills,
                siteConfig,
                loading,
                refreshProjects,
                refreshBlogPosts,
                refreshProfile,
                refreshSkills,
                refreshSiteConfig,
                refreshAll,
            }}
        >
            {children}
        </AdminDataContext.Provider>
    );
};

/**
 * Hook to access admin data context
 */
export const useAdminData = (): AdminData => {
    const context = useContext(AdminDataContext);
    if (!context) {
        throw new Error('useAdminData must be used within an AdminDataProvider');
    }
    return context;
};

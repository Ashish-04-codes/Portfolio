import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, Button, Breadcrumb } from '../../components/admin';
import {
  FolderOpen,
  FileText,
  User,
  Code,
  Settings,
  Plus,
  Activity,
  Clock,
  Download
} from 'lucide-react';
import {
  projectService,
  blogPostService,
  profileService,
  skillService,
  activityService,
  authService
} from '../../services';
import type { ActivityLog } from '../../services/activity.service';
import { useAppNavigate } from '../../hooks/useAppNavigate';

interface ToastActions {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

interface Stats {
  projectsCount: number;
  blogPostsCount: number;
  skillsCount: number;
  hasProfile: boolean;
}

const AdminDashboard: React.FC = () => {
  const navigate = useAppNavigate();
  const toast = useOutletContext<ToastActions>();
  const [stats, setStats] = useState<Stats>({
    projectsCount: 0,
    blogPostsCount: 0,
    skillsCount: 0,
    hasProfile: false,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const userEmail = authService.getUserEmail();

  useEffect(() => {
    loadStats();
    loadActivity();
  }, []);

  // Listen for data changes to refresh stats (soft refresh - no spinner)
  useEffect(() => {
    const handleStorageChange = () => {
      loadStats();
      loadActivity();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dataUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dataUpdated', handleStorageChange);
    };
  }, []);

  const loadActivity = () => {
    const logs = activityService.getRecentLogs(7); // Last 7 days
    setRecentActivity(logs.slice(0, 10)); // Show last 10
  };

  const loadStats = async () => {
    const [projects, blogPosts, skills, profile] = await Promise.all([
      projectService.getAll(),
      blogPostService.getAll(),
      skillService.getAll(),
      profileService.get(),
    ]);

    setStats({
      projectsCount: projects.length,
      blogPostsCount: blogPosts.length,
      skillsCount: skills.length,
      hasProfile: !!profile,
    });
  };

  const statCards = [
    {
      icon: <FolderOpen size={24} />,
      title: 'Projects',
      count: stats.projectsCount,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => navigate('admin-projects'),
    },
    {
      icon: <FileText size={24} />,
      title: 'Blog Posts',
      count: stats.blogPostsCount,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => navigate('admin-blog'),
    },
    {
      icon: <Code size={24} />,
      title: 'Skills',
      count: stats.skillsCount,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      onClick: () => navigate('admin-skills'),
    },
    {
      icon: <User size={24} />,
      title: 'Profile',
      count: stats.hasProfile ? 1 : 0,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => navigate('admin-profile'),
    },
  ];

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getActionLabel = (log: ActivityLog) => {
    const actions: Record<string, string> = {
      login: 'Logged in',
      logout: 'Logged out',
      login_failed: 'Failed login',
      create: 'Created',
      update: 'Updated',
      delete: 'Deleted',
      publish: 'Published',
      unpublish: 'Unpublished',
    };
    return actions[log.action] || log.action;
  };

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      login: 'text-blue-600',
      logout: 'text-gray-600',
      login_failed: 'text-red-600',
      create: 'text-green-600',
      update: 'text-orange-600',
      delete: 'text-red-600',
      publish: 'text-purple-600',
      unpublish: 'text-gray-600',
    };
    return colors[action] || 'text-ink';
  };

  return (
    <div className="space-y-6">
      <Breadcrumb currentPage="admin" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-black text-3xl uppercase tracking-tight">
            Dashboard
          </h2>
          <p className="font-mono text-sm text-ink/60 mt-1">
            Welcome back, {userEmail || 'Admin'}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <button
            key={stat.title}
            onClick={stat.onClick}
            className="p-6 border-2 border-ink bg-newsprint hover:shadow-[4px_4px_0_0_rgba(var(--rgb-ink),1)] transition-all text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.color}`}>{stat.icon}</div>
              <span className="font-sans font-black text-3xl">{stat.count}</span>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-ink/60">
              {stat.title}
            </p>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" subtitle="Create new content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('admin-projects')}
            className="w-full justify-center"
          >
            <Plus size={16} className="mr-2" />
            New Project
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('admin-blog')}
            className="w-full justify-center"
          >
            <Plus size={16} className="mr-2" />
            New Post
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('admin-skills')}
            className="w-full justify-center"
          >
            <Plus size={16} className="mr-2" />
            New Skill
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('admin-config')}
            className="w-full justify-center"
          >
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card
        title="Recent Activity"
        subtitle={`Last 7 days • ${recentActivity.length} actions`}
      >
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-ink/40">
            <Activity size={48} className="mx-auto mb-3 opacity-20" />
            <p className="font-mono text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 border-l-2 border-ink/20 hover:bg-surface transition-colors"
              >
                <div className={`mt-0.5 ${getActionColor(log.action)}`}>
                  <Activity size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm">
                    <span className={`font-bold ${getActionColor(log.action)}`}>
                      {getActionLabel(log)}
                    </span>
                    {log.entityName && (
                      <>
                        {' • '}
                        <span className="text-ink">{log.entityType}</span>
                        {': '}
                        <span className="text-ink/80">{log.entityName}</span>
                      </>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-ink/40">
                    <Clock size={12} />
                    <span>{formatTimestamp(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex gap-3 pt-3 border-t-2 border-ink/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => activityService.downloadLogsAsCSV()}
                className="flex-1"
              >
                <Download size={14} className="mr-2" />
                Export Logs
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminDashboard;

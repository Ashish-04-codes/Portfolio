import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project, ProjectLayout } from '../../models';
import { projectService } from '../../services';
import {
  Card,
  Table,
  Button,
  Modal,
  Input,
  Textarea,
  Select,
  ImageUpload,
  Breadcrumb,
} from '../../components/admin';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { logger } from '../../utils/logger';

interface ToastActions {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const AdminProjects: React.FC = () => {
  const navigate = useAppNavigate();
  const toast = useOutletContext<ToastActions>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    year: new Date().getFullYear().toString(),
    category: '',
    layout: 'standard',
    shortDesc: '',
    fullDesc: '',
    image: '',
    techStack: [],
    challenge: '',
    solution: '',
    links: { demo: '', repo: '' },
    featured: false,
    published: true,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  // Listen for storage changes (soft refresh - no loading spinner)
  useEffect(() => {
    const handleStorageChange = () => {
      projectService.getAll().then((data) => {
        setProjects(data);
      });
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadProjects = async () => {
    const data = await projectService.getAll();
    setProjects(data);
  };

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        year: new Date().getFullYear().toString(),
        category: '',
        layout: 'standard',
        shortDesc: '',
        fullDesc: '',
        image: '',
        techStack: [],
        challenge: '',
        solution: '',
        links: { demo: '', repo: '' },
        featured: false,
        published: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProject) {
        await projectService.update({ ...formData, id: editingProject.id } as any);
        toast.success('Project updated successfully!');
      } else {
        await projectService.create(formData as any);
        toast.success('Project created successfully!');
      }
      // Directly refresh the list
      const updatedProjects = await projectService.getAll();
      setProjects(updatedProjects);
      handleCloseModal();
    } catch (error) {
      logger.error('Error saving project', { error });
      toast.error('Failed to save project. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectService.delete(id);
      toast.success('Project deleted successfully!');
      // Directly refresh the list
      const updatedProjects = await projectService.getAll();
      setProjects(updatedProjects);
    } catch (error) {
      logger.error('Error deleting project', { error });
      toast.error('Failed to delete project.');
    }
  };

  const handleTogglePublished = async (project: Project) => {
    try {
      await projectService.update({
        ...project,
        published: !project.published,
      });
      toast.success(project.published ? 'Project unpublished!' : 'Project published!');
      // Directly refresh the list
      const updatedProjects = await projectService.getAll();
      setProjects(updatedProjects);
    } catch (error) {
      logger.error('Error updating project', { error });
      toast.error('Failed to update project status.');
    }
  };

  const layoutOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'standard', label: 'Standard' },
    { value: 'inverted', label: 'Inverted' },
    { value: 'text-only', label: 'Text Only' },
    { value: 'sidebar-image', label: 'Sidebar Image' },
    { value: 'placeholder', label: 'Placeholder' },
  ];

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (project: Project) => (
        <div>
          <div className="font-bold">{project.title}</div>
          <div className="text-xs text-ink/60">
            {project.category} • {project.year}
          </div>
        </div>
      ),
    },
    {
      key: 'layout',
      header: 'Layout',
      width: '120px',
      render: (project: Project) => (
        <span className="font-mono text-xs uppercase bg-surface px-2 py-1">{project.layout}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (project: Project) => (
        <span
          className={`font-mono text-xs uppercase ${project.published ? 'text-green-600' : 'text-red-600'}`}
        >
          {project.published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '200px',
      render: (project: Project) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(project)}
            className="p-1.5 hover:bg-surface transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleTogglePublished(project)}
            className="p-1.5 hover:bg-surface transition-colors"
            title={project.published ? 'Unpublish' : 'Publish'}
          >
            {project.published ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={() => handleDelete(project.id)}
            className="p-1.5 hover:bg-red-100 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb currentPage="admin-projects" onNavigate={navigate} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-black text-3xl uppercase tracking-tight">
            Projects Manager
          </h2>
          <p className="font-mono text-sm text-ink/60 mt-1">{projects.length} total projects</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={16} className="inline mr-2" />
          Add Project
        </Button>
      </div>

      <Table
        columns={columns}
        data={projects}
        keyExtractor={(project) => project.id}
        emptyMessage="No projects yet. Create your first one!"
      />

      {/* Project Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Project Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              required
              placeholder="e.g., Quantum Analytics Dashboard"
            />
            <Input
              label="Year"
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
              required
              placeholder="e.g., 2023"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              required
              placeholder="e.g., FinTech"
            />
            <Select
              label="Layout"
              value={formData.layout}
              onChange={(e) => handleChange('layout', e.target.value)}
              options={layoutOptions}
              required
            />
          </div>

          <Textarea
            label="Short Description"
            value={formData.shortDesc}
            onChange={(e) => handleChange('shortDesc', e.target.value)}
            required
            placeholder="Brief one-line description..."
            rows={2}
          />

          <Textarea
            label="Full Description"
            value={formData.fullDesc}
            onChange={(e) => handleChange('fullDesc', e.target.value)}
            placeholder="Detailed project description..."
            rows={4}
          />

          <ImageUpload
            label="Project Image"
            value={formData.image}
            onChange={(url) => handleChange('image', url)}
            helperText="Upload an image or paste a URL"
          />

          <Input
            label="Tech Stack (comma-separated)"
            value={formData.techStack?.join(', ')}
            onChange={(e) =>
              handleChange(
                'techStack',
                e.target.value.split(',').map((s) => s.trim())
              )
            }
            placeholder="React, TypeScript, Node.js"
          />

          <Textarea
            label="Challenge"
            value={formData.challenge}
            onChange={(e) => handleChange('challenge', e.target.value)}
            placeholder="What was the main problem?"
            rows={3}
          />

          <Textarea
            label="Solution"
            value={formData.solution}
            onChange={(e) => handleChange('solution', e.target.value)}
            placeholder="How did you solve it?"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Demo Link"
              value={formData.links?.demo}
              onChange={(e) => handleChange('links', { ...formData.links, demo: e.target.value })}
              placeholder="https://demo.com"
            />
            <Input
              label="Repository Link"
              value={formData.links?.repo}
              onChange={(e) => handleChange('links', { ...formData.links, repo: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 font-mono text-sm">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
                className="w-4 h-4"
              />
              Featured Project
            </label>
            <label className="flex items-center gap-2 font-mono text-sm">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => handleChange('published', e.target.checked)}
                className="w-4 h-4"
              />
              Published
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-ink">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingProject ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProjects;

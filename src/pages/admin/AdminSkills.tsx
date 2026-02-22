import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Skill } from '../../models';
import { skillService, activityService, authService } from '../../services';
import {
  Card,
  Button,
  Input,
  Select,
  SearchBar,
  Modal,
  ConfirmDialog,
  Breadcrumb,
  Table,
  LoadingSpinner,
  ImageUpload,
} from '../../components/admin';
import { Plus, Edit2, Trash2, Code, TrendingUp } from 'lucide-react';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { logger } from '../../utils/logger';
import type { SkillTrend } from '../../models';

interface ToastActions {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

const CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Tools',
  'Cloud',
  'Mobile',
  'Design',
  'Other',
];

const PROFICIENCY_LEVELS: ProficiencyLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const AdminSkills: React.FC = () => {
  const navigate = useAppNavigate();
  const toast = useOutletContext<ToastActions>();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    skill: Skill | null;
  }>({ isOpen: false, skill: null });

  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    category: 'Frontend',
    proficiency: 50,
    trend: 'stable',
    yearsOfExperience: 0,
    icon: '',
    order: 0,
  });

  useEffect(() => {
    loadSkills();
  }, []);

  // Listen for storage changes (soft refresh - no loading spinner)
  useEffect(() => {
    const handleStorageChange = () => {
      skillService.getAll().then((loadedSkills) => {
        setSkills(loadedSkills);
      });
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    filterSkills();
  }, [searchQuery, skills]);

  const loadSkills = async () => {
    setLoading(true);
    const loadedSkills = await skillService.getAll();
    setSkills(loadedSkills);
    setLoading(false);
  };

  const filterSkills = () => {
    let filtered = [...skills];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          skill.category.toLowerCase().includes(query) ||
          skill.trend.toLowerCase().includes(query)
      );
    }

    // Sort by order, then by name
    filtered.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.name.localeCompare(b.name);
    });

    setFilteredSkills(filtered);
  };

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData(skill);
    } else {
      setEditingSkill(null);
      setFormData({
        name: '',
        category: 'Frontend',
        proficiency: 50,
        trend: 'stable',
        yearsOfExperience: 0,
        icon: '',
        order: skills.length,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Frontend',
      proficiency: 50,
      trend: 'stable',
      yearsOfExperience: 0,
      icon: '',
      order: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSkill) {
        await skillService.update({ id: editingSkill.id, ...formData } as any);
        activityService.log({
          action: 'update',
          entityType: 'skill',
          entityName: formData.name,
          userEmail: authService.getUserEmail(),
        });
        toast.success('Skill updated successfully!');
      } else {
        await skillService.create(formData as Skill);
        activityService.log({
          action: 'create',
          entityType: 'skill',
          entityName: formData.name,
          userEmail: authService.getUserEmail(),
        });
        toast.success('Skill added successfully!');
      }

      // Directly refresh the list
      const updatedSkills = await skillService.getAll();
      setSkills(updatedSkills);
      closeModal();
    } catch (error) {
      logger.error('Error saving skill', { error });
      toast.error('Failed to save skill. Please try again.');
    }
  };

  const confirmDelete = (skill: Skill) => {
    setDeleteConfirm({ isOpen: true, skill });
  };

  const handleDelete = async () => {
    if (deleteConfirm.skill) {
      try {
        await skillService.delete(deleteConfirm.skill.id);
        activityService.log({
          action: 'delete',
          entityType: 'skill',
          entityName: deleteConfirm.skill.name,
          userEmail: authService.getUserEmail(),
        });
        toast.success('Skill deleted successfully!');
        // Directly refresh the list
        const updatedSkills = await skillService.getAll();
        setSkills(updatedSkills);
        setDeleteConfirm({ isOpen: false, skill: null });
      } catch (error) {
        logger.error('Error deleting skill', { error });
        toast.error('Failed to delete skill.');
      }
    }
  };

  const getProficiencyLevel = (proficiency: number): string => {
    if (proficiency >= 80) return 'Expert';
    if (proficiency >= 60) return 'Advanced';
    if (proficiency >= 40) return 'Intermediate';
    return 'Beginner';
  };

  const getProficiencyColor = (proficiency: number): string => {
    const level = getProficiencyLevel(proficiency);
    switch (level) {
      case 'Expert':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Advanced':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Intermediate':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Beginner':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Skill',
      render: (skill: Skill) => (
        <div className="flex items-center gap-3">
          {skill.icon && (
            <img src={skill.icon} alt={skill.name} className="w-8 h-8 object-contain" />
          )}
          <div>
            <div className="font-mono font-bold">{skill.name}</div>
            <div className="text-xs text-ink/60">{skill.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'proficiency',
      header: 'Proficiency',
      render: (skill: Skill) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 font-mono text-xs font-medium border-2 ${getProficiencyColor(
            skill.proficiency || 0
          )}`}
        >
          <TrendingUp size={12} />
          {getProficiencyLevel(skill.proficiency || 0)} ({skill.proficiency || 0}%)
        </span>
      ),
    },
    {
      key: 'years',
      header: 'Experience',
      render: (skill: Skill) => (
        <span className="font-mono text-sm">
          {skill.yearsOfExperience && skill.yearsOfExperience > 0
            ? `${skill.yearsOfExperience} years`
            : 'N/A'}
        </span>
      ),
    },
    {
      key: 'order',
      header: 'Order',
      render: (skill: Skill) => (
        <span className="font-mono text-sm text-ink/60">{skill.order}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (skill: Skill) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(skill)}
            className="p-2 hover:bg-paper-alt transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => confirmDelete(skill)}
            className="p-2 hover:bg-red-100 text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner centered message="Loading skills..." />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb currentPage="admin-skills" onNavigate={navigate} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-sans font-black text-3xl uppercase tracking-tight">Skills Manager</h2>
          <p className="font-mono text-sm text-ink/60 mt-1">
            {skills.length} skill{skills.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button variant="primary" onClick={() => openModal()}>
          <Plus size={16} className="mr-2" />
          Add Skill
        </Button>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search skills by name, category, or proficiency..."
      />

      {filteredSkills.length === 0 ? (
        <Card
          title="No Skills Found"
          subtitle={
            searchQuery ? 'Try adjusting your search' : 'Add your first skill to get started'
          }
        >
          <div className="text-center py-8">
            <Code size={48} className="mx-auto text-ink/20 mb-4" />
            <Button variant="primary" onClick={() => openModal()}>
              <Plus size={16} className="mr-2" />
              Add Skill
            </Button>
          </div>
        </Card>
      ) : (
        <Table columns={columns} data={filteredSkills} keyExtractor={(skill) => skill.id} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Skill Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            placeholder="e.g., React"
          />

          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>

          <Select
            label="Trend"
            value={formData.trend}
            onChange={(e) =>
              setFormData({
                ...formData,
                trend: e.target.value as SkillTrend,
              })
            }
            required
          >
            <option value="bullish">Bullish</option>
            <option value="high">High</option>
            <option value="stable">Stable</option>
            <option value="bearish">Bearish</option>
            <option value="declining">Declining</option>
          </Select>

          <Input
            label="Proficiency (1-100)"
            type="number"
            min="1"
            max="100"
            value={formData.proficiency}
            onChange={(e) =>
              setFormData({ ...formData, proficiency: parseInt(e.target.value) || 50 })
            }
            placeholder="50"
            required
          />

          <Input
            label="Years of Experience"
            type="number"
            min="0"
            max="50"
            value={formData.yearsOfExperience}
            onChange={(e) =>
              setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })
            }
            placeholder="0"
          />

          <ImageUpload
            label="Icon/Logo"
            value={formData.icon || ''}
            onChange={(url) => setFormData({ ...formData, icon: url })}
          />

          <Input
            label="Display Order"
            type="number"
            min="0"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
            placeholder="0"
            helperText="Lower numbers appear first"
          />

          <div className="flex gap-3 justify-end pt-4 border-t-2 border-ink/20">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingSkill ? 'Update Skill' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Skill"
        message={`Are you sure you want to delete "${deleteConfirm.skill?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, skill: null })}
        danger
      />
    </div>
  );
};

export default AdminSkills;

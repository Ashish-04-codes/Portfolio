import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BlogPost } from '../../models';
import { blogPostService, activityService, authService } from '../../services';
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
  RichTextEditor,
  ConfirmDialog,
  SearchBar,
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

const AdminBlog: React.FC = () => {
  const navigate = useAppNavigate();
  const toast = useOutletContext<ToastActions>();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    publishDate: new Date().toISOString().split('T')[0],
    author: '',
    category: '',
    subtitle: '',
    content: [],
    featuredImage: '',
    tags: [],
    published: true,
    readTime: '5 min',
  });
  const [contentText, setContentText] = useState('');

  useEffect(() => {
    loadBlogPosts();
  }, []);

  // Listen for storage changes (soft refresh - no loading spinner)
  useEffect(() => {
    const handleStorageChange = () => {
      blogPostService.getAll().then((posts) => {
        setBlogPosts(posts);
      });
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.category.toLowerCase().includes(query) ||
          post.author.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(blogPosts);
    }
  }, [searchQuery, blogPosts]);

  const loadBlogPosts = async () => {
    const posts = await blogPostService.getAll();
    setBlogPosts(posts);
  };

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData(post);
      setContentText(post.content.map((c) => c.content).join('\n\n') || '');
    } else {
      setEditingPost(null);
      setFormData({
        title: '',
        publishDate: new Date().toISOString().split('T')[0],
        author: authService.getUserEmail() || '',
        category: '',
        subtitle: '',
        content: [],
        featuredImage: '',
        tags: [],
        published: true,
        readTime: '5 min',
      });
      setContentText('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert contentText to BlogContent array
      const contentArray = contentText
        .split('\n\n')
        .filter((p) => p.trim())
        .map((p) => ({ type: 'paragraph' as const, content: p.trim() }));

      const postData = { ...formData, content: contentArray };

      if (editingPost) {
        await blogPostService.update({ id: editingPost.id, ...postData });
        activityService.log({
          action: 'update',
          entityType: 'blog',
          entityId: editingPost.id,
          entityName: formData.title,
          userEmail: authService.getUserEmail(),
        });
        toast.success('Blog post updated successfully!');
      } else {
        await blogPostService.create(postData as any);
        activityService.log({
          action: 'create',
          entityType: 'blog',
          entityName: formData.title,
          userEmail: authService.getUserEmail(),
        });
        toast.success('Blog post created successfully!');
      }

      handleCloseModal();
      // Directly refresh the list
      const updatedPosts = await blogPostService.getAll();
      setBlogPosts(updatedPosts);
    } catch (error) {
      logger.error('Error saving blog post', { error });
      toast.error('Failed to save blog post. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    const post = blogPosts.find((p) => p.id === id);
    if (!post) return;

    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const post = blogPosts.find((p) => p.id === deleteConfirm);
      await blogPostService.delete(deleteConfirm);
      activityService.log({
        action: 'delete',
        entityType: 'blog',
        entityId: deleteConfirm,
        entityName: post?.title,
        userEmail: authService.getUserEmail(),
      });

      setDeleteConfirm(null);
      toast.success('Blog post deleted successfully!');
      // Directly refresh the list
      const updatedPosts = await blogPostService.getAll();
      setBlogPosts(updatedPosts);
    } catch (error) {
      logger.error('Error deleting blog post', { error });
      toast.error('Failed to delete blog post.');
    }
  };

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      await blogPostService.update({ id: post.id, published: !post.published });
      activityService.log({
        action: post.published ? 'unpublish' : 'publish',
        entityType: 'blog',
        entityId: post.id,
        entityName: post.title,
        userEmail: authService.getUserEmail(),
      });
      toast.success(post.published ? 'Blog post unpublished!' : 'Blog post published!');
      // Directly refresh the list
      const updatedPosts = await blogPostService.getAll();
      setBlogPosts(updatedPosts);
    } catch (error) {
      logger.error('Error updating blog post', { error });
      toast.error('Failed to update blog post status.');
    }
  };

  const handleTagsChange = (tagsString: string) => {
    const tags = tagsString
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);
    setFormData({ ...formData, tags });
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (post: BlogPost) => (
        <div>
          <p className="font-bold">{post.title}</p>
          <p className="text-xs text-ink/60">{post.category}</p>
        </div>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (post: BlogPost) => post.author,
    },
    {
      key: 'date',
      header: 'Date',
      render: (post: BlogPost) => new Date(post.publishDate).toLocaleDateString(),
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (post: BlogPost) => (
        <div className="flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-surface font-mono text-xs">
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-xs text-ink/60">+{post.tags.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (post: BlogPost) => (
        <span
          className={`px-2 py-1 font-mono text-xs uppercase ${
            post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {post.published ? 'Published' : 'Draft'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (post: BlogPost) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleOpenModal(post)}
            className="p-1.5 hover:bg-surface transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleTogglePublished(post)}
            className="p-1.5 hover:bg-surface transition-colors"
            title={post.published ? 'Unpublish' : 'Publish'}
          >
            {post.published ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
          <button
            onClick={() => handleDelete(post.id)}
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
      <Breadcrumb currentPage="admin-blog" onNavigate={navigate} />

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h2 className="font-sans font-black text-3xl uppercase tracking-tight">Blog Manager</h2>
          <p className="font-mono text-sm text-ink/60 mt-1">
            {blogPosts.length} total posts • {blogPosts.filter((p) => p.published).length} published
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={16} className="inline mr-2" />
          New Post
        </Button>
      </div>

      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search posts..." />

      <Table
        columns={columns}
        data={filteredPosts}
        keyExtractor={(post) => post.id}
        emptyMessage="No blog posts yet. Create your first one!"
      />

      {/* Blog Post Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Enter post title"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
              placeholder="Author name"
            />
            <Input
              label="Date"
              type="date"
              value={formData.publishDate}
              onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              placeholder="e.g., Web Development"
            />
            <Input
              label="Read Time"
              value={formData.readTime}
              onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
              placeholder="e.g., 5 min"
            />
          </div>

          <Input
            label="Tags (comma-separated)"
            value={formData.tags?.join(', ') || ''}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="React, TypeScript, CSS"
          />

          <Textarea
            label="Subtitle"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            rows={3}
            placeholder="Brief summary of the post"
          />

          <ImageUpload
            label="Featured Image"
            value={formData.featuredImage || ''}
            onChange={(url) => setFormData({ ...formData, featuredImage: url })}
          />

          <RichTextEditor
            label="Content"
            value={contentText}
            onChange={setContentText}
            placeholder="Write your blog post content here..."
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 border-2 border-ink"
            />
            <label htmlFor="published" className="font-mono text-sm">
              Publish immediately
            </label>
          </div>

          <div className="flex gap-3 pt-4 border-t-2 border-ink">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {editingPost ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
        danger
      />
    </div>
  );
};

export default AdminBlog;

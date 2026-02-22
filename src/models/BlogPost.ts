/**
 * Blog Post Data Model
 * Defines the structure for editorial/blog content
 */

export interface BlogContent {
    type: 'paragraph' | 'blockquote' | 'heading' | 'list';
    content: string;
    level?: number; // For headings (h1-h6)
}

export interface BlogPost {
    id: string;
    title: string;
    subtitle?: string;
    author: string;
    publishDate: string;
    readTime: string;
    category?: string;
    tags?: string[];
    featuredImage?: string;
    content: BlogContent[];
    // Metadata
    published?: boolean;
    featured?: boolean;
    order?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateBlogPostDTO {
    title: string;
    subtitle?: string;
    author: string;
    publishDate: string;
    readTime: string;
    category?: string;
    tags?: string[];
    featuredImage?: string;
    content: BlogContent[];
    published?: boolean;
    featured?: boolean;
}

export interface UpdateBlogPostDTO extends Partial<CreateBlogPostDTO> {
    id: string;
}

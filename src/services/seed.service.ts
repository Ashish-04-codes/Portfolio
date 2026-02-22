/**
 * Database Seed Service
 * Initializes Firestore with default data from the original hardcoded content
 */

import {
  projectService,
  blogPostService,
  profileService,
  skillService,
  siteConfigService
} from './';
import { logger } from '../utils/logger';

class SeedService {
  /**
   * Check if database has been seeded by checking if projects collection has data
   */
  async isSeeded(): Promise<boolean> {
    const projects = await projectService.getAll();
    return projects.length > 0;
  }

  /**
   * Seed the database with default data
   */
  async seedDatabase(): Promise<void> {
    if (await this.isSeeded()) {
      logger.info('Database already seeded. Skipping...');
      return;
    }

    logger.info('Seeding database with default data...');

    try {
      await this.seedProjects();
      await this.seedBlogPosts();
      await this.seedProfile();
      await this.seedSkills();
      await this.seedSiteConfig();

      logger.info('Database seeded successfully!');
    } catch (error) {
      logger.error('Error seeding database', { error });
    }
  }

  /**
   * Seed projects from ClassifiedsPage
   */
  private async seedProjects(): Promise<void> {
    const projects = [
      {
        title: 'Quantum Analytics Dashboard',
        year: '2023',
        category: 'FinTech',
        layout: 'featured' as const,
        shortDesc: 'A comprehensive data visualization suite for enterprise-level financial tracking. Features real-time websocket updates.',
        fullDesc: 'Quantum Analytics is a high-frequency trading dashboard designed for institutional investors. The goal was to visualize terabytes of financial data in real-time with sub-millisecond latency. The interface allows traders to monitor market movements, execute trades, and analyze historical trends without leaving the viewport.',
        image: 'https://picsum.photos/1200/800?grayscale',
        techStack: ['React', 'D3.js', 'TypeScript', 'WebSockets', 'Redis'],
        challenge: 'Rendering 50,000+ data points in real-time caused significant DOM trashing and frame rate drops on standard React rendering cycles.',
        solution: 'Implemented a hybrid approach using Canvas API for heavy charts and React for UI controls. utilized Web Workers to parse incoming WebSocket messages off the main thread, maintaining a steady 60fps.',
        links: { demo: 'https://example.com', repo: 'https://github.com' },
        featured: true,
        published: true,
      },
      {
        title: 'Neo-Bank Mobile',
        year: '2023',
        category: 'Mobile App',
        layout: 'standard' as const,
        shortDesc: 'Seamless mobile banking experience focusing on accessibility and speed.',
        fullDesc: 'A cross-platform mobile application for a digital-first bank. The focus was on extreme accessibility (WCAG AAA compliance) and "instant" interactions.',
        image: 'https://picsum.photos/400/300?grayscale',
        techStack: ['React Native', 'Redux Toolkit', 'Node.js'],
        challenge: 'Achieving native-like transition smoothness while maintaining a shared codebase for iOS and Android.',
        solution: 'Utilized Reanimated 2 for purely native-driver animations and implemented optimistic UI updates to mask network latency during transactions.',
        links: { repo: 'https://github.com' },
        featured: false,
        published: true,
      },
      {
        title: 'React-Grid-System',
        year: 'Ongoing',
        category: 'Open Source',
        layout: 'inverted' as const,
        shortDesc: 'A lightweight layout engine I maintain. Used by 5k+ developers.',
        fullDesc: 'An open-source library providing a flexible, flexbox-based grid system for React applications. It mimics the Bootstrap grid but with a smaller footprint and typed props.',
        techStack: ['React', 'NPM', 'Rollup'],
        challenge: 'Maintaining backward compatibility while migrating the library to support React Server Components.',
        solution: 'Adopted a monorepo structure to publish separate ESM and CJS builds, ensuring compatibility across Next.js app directory and legacy Create React App projects.',
        links: { repo: 'https://github.com' },
        featured: false,
        published: true,
      },
      {
        title: 'E-Comm Platform',
        year: '2022',
        category: 'Commerce',
        layout: 'text-only' as const,
        shortDesc: 'High-performance headless commerce solution handling 10k+ concurrent users.',
        fullDesc: 'A headless e-commerce storefront built for a luxury fashion brand. The site integrates with Shopify Plus for checkout but uses a custom frontend for browsing and storytelling.',
        techStack: ['Next.js', 'GraphQL', 'Stripe', 'Vercel'],
        challenge: 'The client required heavy imagery and video content without compromising Core Web Vitals.',
        solution: 'Implemented aggressive image optimization using next/image, lazy-loading strategies, and edge-caching for static assets to achieve a Lighthouse score of 98.',
        links: { demo: 'https://example.com' },
        featured: false,
        published: true,
      },
      {
        title: 'Generative Art',
        year: '2021',
        category: 'Experimental',
        layout: 'sidebar-image' as const,
        shortDesc: 'Algorithmic art pieces created using p5.js and WebGL.',
        fullDesc: 'A collection of algorithmic artworks generated via code. These pieces explore the relationship between organized chaos and mathematical precision.',
        image: 'https://picsum.photos/200/400?grayscale',
        techStack: ['p5.js', 'WebGL', 'GLSL'],
        challenge: 'Creating random patterns that feel organic rather than purely chaotic noise.',
        solution: ' utilized Perlin noise and flow fields to simulate natural textures like topography and fluid dynamics.',
        links: { demo: 'https://example.com' },
        featured: false,
        published: true,
      },
      {
        title: 'Project Archive',
        year: '2018-2020',
        category: 'Archive',
        layout: 'placeholder' as const,
        shortDesc: 'Browse older works.',
        fullDesc: 'This archive contains older projects including my first portfolio, a PHP forum, and various jQuery plugins. Kept for nostalgia and to measure growth.',
        featured: false,
        published: true,
      },
    ];

    for (const project of projects) {
      await projectService.create(project);
    }
  }

  /**
   * Seed blog posts from EditorialPage
   */
  private async seedBlogPosts(): Promise<void> {
    await blogPostService.create({
      title: 'The Architecture of Obsolescence',
      subtitle: 'Why chasing the newest framework might be the fastest way to build legacy code.',
      author: '[Your Name]',
      publishDate: '2024-10-24',
      readTime: '4 Min Read',
      category: 'Engineering',
      tags: ['Architecture', 'Best Practices', 'Opinion'],
      content: [
        {
          type: 'paragraph',
          content: 'There is a peculiar rhythm to the life of a software engineer. It is syncopated by the release cycles of major frameworks, punctuated by the deprecation warnings in our terminals, and underscored by a persistent anxiety that we are falling behind. We build cathedrals on foundations of sand, not because we lack stone, but because the sand merchants have better marketing departments.',
        },
        {
          type: 'paragraph',
          content: 'Consider the humble `div`. It has survived the browser wars, the rise and fall of Flash, and the tumultuous transition from table-based layouts to Flexbox. Yet, in our quest for abstraction, we have buried it under layers of hydration logic and state management libraries that promise simplicity while delivering complexity on an installment plan.',
        },
        {
          type: 'blockquote',
          content: 'We build cathedrals on foundations of sand, not because we lack stone, but because the sand merchants have better marketing departments.',
        },
        {
          type: 'paragraph',
          content: 'The modern stack is a marvel of engineering, to be sure. But one must ask: are we solving problems, or are we merely solving the problems created by our previous solutions? The React component you wrote three years ago is now considered "legacy" not because it stopped working, but because the paradigm of how to write it has shifted three times since.',
        },
      ],
      published: true,
      featured: true,
    });
  }

  /**
   * Seed profile from AboutPage
   */
  private async seedProfile(): Promise<void> {
    await profileService.save({
      name: '[Your Name]',
      title: 'Full-Stack Engineer',
      location: 'San Francisco',
      bio: 'I have spent the last 5 years working with startups and enterprise clients to build scalable web applications. My experience ranges from early-stage MVP development to refactoring legacy systems for high-traffic environments. I thrive in collaborative teams where communication is as valued as code quality.',
      profileImage: 'https://picsum.photos/400/500?grayscale',
      sections: [
        {
          heading: 'On Approach',
          subheading: 'Performance First',
          content: 'I believe that performance is a feature, not an afterthought. Whether it\'s optimizing Core Web Vitals or reducing bundle sizes, I ensure that applications are fast, accessible, and resilient. My approach is data-driven, using metrics to guide architectural decisions.',
          order: 0,
        },
        {
          heading: 'On The Future',
          subheading: 'Continuous Evolution',
          content: 'The web is constantly changing, and so am I. Currently, I am exploring the potential of Server Components, Edge Computing, and WebAssembly to push the boundaries of what\'s possible in the browser.',
          order: 1,
        },
      ],
      vitals: {
        experience: '5+ Years',
        level: 'Senior',
        location: 'Remote',
        status: 'Available',
      },
      email: 'contact@example.com',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    });
  }

  /**
   * Seed skills from FrontPage
   */
  private async seedSkills(): Promise<void> {
    const skills = [
      {
        name: 'React.js',
        category: 'Frontend',
        icon: 'Terminal',
        trend: 'bullish' as const,
        proficiency: 95,
        yearsOfExperience: 5,
        featured: true,
      },
      {
        name: 'TypeScript',
        category: 'Languages',
        icon: 'Sun',
        trend: 'high' as const,
        proficiency: 90,
        yearsOfExperience: 4,
        featured: true,
      },
      {
        name: 'AWS',
        category: 'Cloud',
        icon: 'Cloud',
        trend: 'stable' as const,
        proficiency: 80,
        yearsOfExperience: 3,
        featured: true,
      },
      {
        name: 'jQuery',
        category: 'Frontend',
        icon: 'Database',
        trend: 'bearish' as const,
        proficiency: 70,
        yearsOfExperience: 6,
        featured: true,
      },
    ];

    for (const skill of skills) {
      await skillService.create(skill);
    }
  }

  /**
   * Seed site configuration
   */
  private async seedSiteConfig(): Promise<void> {
    await siteConfigService.update({
      siteName: 'The Daily Developer',
      tagline: 'Portfolio & Technical Insights',
      description: 'A newspaper-themed portfolio showcasing modern web development expertise',
      author: '[Your Name]',
      location: 'San Francisco',
      email: 'contact@example.com',
      heroTitle: 'Full-Stack Engineer Redefines User Experience',
      heroSubtitle: 'Specializing in React, TypeScript, and Modern Web Architecture',
      heroImage: 'https://picsum.photos/800/600?grayscale',
      availableForWork: true,
      availabilityMessage: 'Available for Full-time Roles & Freelance Commissions',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
    });
  }

  /**
   * Reset database (clear all Firestore data and reseed)
   */
  async resetDatabase(): Promise<void> {
    logger.info('Resetting database...');
    // Delete all documents from each collection
    const [projects, posts, skills] = await Promise.all([
      projectService.getAll(),
      blogPostService.getAll(),
      skillService.getAll(),
    ]);
    await Promise.all([
      ...projects.map(p => projectService.delete(p.id)),
      ...posts.map(p => blogPostService.delete(p.id)),
      ...skills.map(s => skillService.delete(s.id)),
      profileService.delete(),
      siteConfigService.reset(),
    ]);
    await this.seedDatabase();
  }
}

export const seedService = new SeedService();

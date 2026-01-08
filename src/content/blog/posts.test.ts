import { describe, it, expect } from 'vitest';
import { posts, getPostBySlug, getAllPosts, getAllPostsIncludingDrafts, type BlogPost } from './posts';

describe('blog posts module', () => {
  describe('posts array', () => {
    it('has at least one post', () => {
      expect(posts.length).toBeGreaterThan(0);
    });

    it('each post has required fields', () => {
      posts.forEach((post) => {
        expect(post.slug).toBeDefined();
        expect(post.title).toBeDefined();
        expect(post.description).toBeDefined();
        expect(post.date).toBeDefined();
        expect(post.tags).toBeDefined();
        expect(post.content).toBeDefined();
        expect(post.readingTime).toBeDefined();
      });
    });

    it('each post has valid date format (YYYY-MM-DD)', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      posts.forEach((post) => {
        expect(post.date).toMatch(dateRegex);
      });
    });

    it('each post has at least one tag', () => {
      posts.forEach((post) => {
        expect(post.tags.length).toBeGreaterThan(0);
      });
    });

    it('slugs are unique', () => {
      const slugs = posts.map((post) => post.slug);
      const uniqueSlugs = new Set(slugs);
      expect(uniqueSlugs.size).toBe(slugs.length);
    });

    it('slugs contain only valid URL characters', () => {
      const slugRegex = /^[a-z0-9-]+$/;
      posts.forEach((post) => {
        expect(post.slug).toMatch(slugRegex);
      });
    });
  });

  describe('getPostBySlug', () => {
    it('returns a post when slug exists', () => {
      const post = getPostBySlug('hello-world');
      expect(post).toBeDefined();
      expect(post?.slug).toBe('hello-world');
    });

    it('returns undefined when slug does not exist', () => {
      const post = getPostBySlug('non-existent-post');
      expect(post).toBeUndefined();
    });

    it('returns correct post data', () => {
      const post = getPostBySlug('hello-world');
      expect(post?.title).toBe('Hello, World!');
      expect(post?.tags).toContain('personal');
    });
  });

  describe('getAllPosts', () => {
    it('returns only non-draft posts', () => {
      const allPosts = getAllPosts();
      const nonDraftPosts = posts.filter((post) => !post.draft);
      expect(allPosts.length).toBe(nonDraftPosts.length);
    });

    it('does not include draft posts', () => {
      const allPosts = getAllPosts();
      allPosts.forEach((post) => {
        expect(post.draft).not.toBe(true);
      });
    });

    it('returns posts sorted by date descending (newest first)', () => {
      const allPosts = getAllPosts();
      for (let i = 0; i < allPosts.length - 1; i++) {
        const currentDate = new Date(allPosts[i].date).getTime();
        const nextDate = new Date(allPosts[i + 1].date).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });

    it('does not modify the original posts array', () => {
      const originalLength = posts.length;
      const originalFirstSlug = posts[0].slug;
      
      getAllPosts();
      
      expect(posts.length).toBe(originalLength);
      expect(posts[0].slug).toBe(originalFirstSlug);
    });
  });

  describe('getAllPostsIncludingDrafts', () => {
    it('returns all posts including drafts', () => {
      const allPosts = getAllPostsIncludingDrafts();
      expect(allPosts.length).toBe(posts.length);
    });

    it('returns posts sorted by date descending (newest first)', () => {
      const allPosts = getAllPostsIncludingDrafts();
      for (let i = 0; i < allPosts.length - 1; i++) {
        const currentDate = new Date(allPosts[i].date).getTime();
        const nextDate = new Date(allPosts[i + 1].date).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });
  });

  describe('BlogPost type validation', () => {
    it('hello-world post matches BlogPost interface', () => {
      const post: BlogPost | undefined = getPostBySlug('hello-world');
      expect(post).toBeDefined();
      
      if (post) {
        // Type checking - these should all compile
        const slug: string = post.slug;
        const title: string = post.title;
        const description: string = post.description;
        const date: string = post.date;
        const tags: string[] = post.tags;
        const content: string = post.content;
        const readingTime: string = post.readingTime;
        
        expect(typeof slug).toBe('string');
        expect(typeof title).toBe('string');
        expect(typeof description).toBe('string');
        expect(typeof date).toBe('string');
        expect(Array.isArray(tags)).toBe(true);
        expect(typeof content).toBe('string');
        expect(typeof readingTime).toBe('string');
      }
    });
  });
});

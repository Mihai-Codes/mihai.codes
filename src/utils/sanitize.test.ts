import { describe, it, expect } from 'vitest';
import { escapeHTML, sanitizeHTML, sanitizeUserInput, ALLOWED_TAGS } from './sanitize';

describe('sanitize utilities', () => {
  describe('escapeHTML', () => {
    it('escapes ampersand', () => {
      expect(escapeHTML('foo & bar')).toBe('foo &amp; bar');
    });

    it('escapes less than', () => {
      expect(escapeHTML('foo < bar')).toBe('foo &lt; bar');
    });

    it('escapes greater than', () => {
      expect(escapeHTML('foo > bar')).toBe('foo &gt; bar');
    });

    it('escapes double quotes', () => {
      expect(escapeHTML('foo "bar"')).toBe('foo &quot;bar&quot;');
    });

    it('escapes single quotes', () => {
      expect(escapeHTML("foo 'bar'")).toBe('foo &#x27;bar&#x27;');
    });

    it('escapes multiple special characters', () => {
      expect(escapeHTML('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    it('returns unchanged string with no special characters', () => {
      expect(escapeHTML('Hello World')).toBe('Hello World');
    });

    it('handles empty string', () => {
      expect(escapeHTML('')).toBe('');
    });
  });

  describe('sanitizeHTML', () => {
    it('returns the input unchanged (trusted content passthrough)', () => {
      const html = '<h1>Title</h1><p>Content</p>';
      expect(sanitizeHTML(html)).toBe(html);
    });

    it('handles empty string', () => {
      expect(sanitizeHTML('')).toBe('');
    });
  });

  describe('sanitizeUserInput', () => {
    it('strips HTML tags', () => {
      expect(sanitizeUserInput('<script>alert("xss")</script>Hello')).toBe(
        'alert(&quot;xss&quot;)Hello'
      );
    });

    it('strips nested tags', () => {
      expect(sanitizeUserInput('<div><p>Content</p></div>')).toBe('Content');
    });

    it('escapes remaining special characters after stripping', () => {
      expect(sanitizeUserInput('<p>Hello & Goodbye</p>')).toBe('Hello &amp; Goodbye');
    });

    it('handles input with no HTML', () => {
      expect(sanitizeUserInput('Plain text')).toBe('Plain text');
    });

    it('handles empty string', () => {
      expect(sanitizeUserInput('')).toBe('');
    });
  });

  describe('ALLOWED_TAGS', () => {
    it('includes common block elements', () => {
      expect(ALLOWED_TAGS).toContain('h1');
      expect(ALLOWED_TAGS).toContain('p');
      expect(ALLOWED_TAGS).toContain('div');
    });

    it('includes inline elements', () => {
      expect(ALLOWED_TAGS).toContain('strong');
      expect(ALLOWED_TAGS).toContain('em');
      expect(ALLOWED_TAGS).toContain('a');
    });

    it('includes code elements', () => {
      expect(ALLOWED_TAGS).toContain('code');
      expect(ALLOWED_TAGS).toContain('pre');
    });

    it('does not include script tag', () => {
      expect(ALLOWED_TAGS).not.toContain('script');
    });

    it('does not include style tag', () => {
      expect(ALLOWED_TAGS).not.toContain('style');
    });
  });
});

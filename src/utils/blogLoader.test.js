// src/utils/blogLoader.test.js
import { describe, it, expect } from 'vitest';
import { parseFrontmatter } from './blogLoader';

describe('blogLoader tests', () => {
  describe('parseFrontmatter', () => {
    it('should parse standard frontmatter and text content', () => {
      const markdown = `---
id: 12
title: "My Journey"
category: 'Travel'
draft: false
---
This is the body of the markdown file.
It stretches across multiple lines.`;

      const result = parseFrontmatter(markdown);
      
      expect(result.data).toEqual({
        id: 12,
        title: "My Journey",
        category: "Travel",
        draft: "false" // string representation as converted by simple parser
      });
      
      expect(result.content).toBe(`This is the body of the markdown file.\nIt stretches across multiple lines.`);
    });

    it('should fall back to raw content if frontmatter markers are missing', () => {
      const markdown = `Hello this is a simple text.
No frontmatter at all.`;
      
      const result = parseFrontmatter(markdown);
      
      expect(result.data).toEqual({});
      expect(result.content).toBe(markdown);
    });

    it('should handle quoted values correctly', () => {
      const markdown = `---
title: "A quote with 'single' quotes"
desc: 'A quote with "double" quotes'
---
Body`;

      const result = parseFrontmatter(markdown);
      
      expect(result.data.title).toBe("A quote with 'single' quotes");
      expect(result.data.desc).toBe('A quote with "double" quotes');
    });

    it('should handle numeric conversions', () => {
      const markdown = `---
id: 456
pi: 3.14
---
Body`;

      const result = parseFrontmatter(markdown);
      
      expect(result.data.id).toBe(456);
      expect(result.data.pi).toBe(3.14);
    });
  });
});

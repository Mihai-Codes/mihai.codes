import type { RequestHandler } from '@builder.io/qwik-city';
import { getAllPosts } from '../../lib/sanity';
import { profile } from '../../data/profile';

export const onGet: RequestHandler = async ({ send }) => {
  const posts = await getAllPosts();
  
  // Full blog content with each post
  const blogContent = posts.map(post => `
## ${post.title}

**URL**: /blog/${post.slug}
**Date**: ${post.date}
**Tags**: ${post.tags.join(', ')}
**Reading Time**: ${post.readingTime}

${post.description}

### Content

${post.content}

---
`).join('\n');

  const llmsFullTxt = `# mihai.codes - Full Content for LLM Context

> This file contains the complete content of mihai.codes for AI/LLM context retrieval and RAG applications.
> Generated dynamically from Sanity CMS.
> Last updated: ${new Date().toISOString()}

---

# About Mihai Chindris

**Name**: ${profile.name}
**Location**: ${profile.location}
**Tagline**: ${profile.tagline}

## Summary

${profile.summary}

## Contact Information

- **Email**: ${profile.socials.email}
- **Alternative Email**: ${profile.socials.email_alt}
- **LinkedIn**: ${profile.socials.linkedin}
- **GitHub**: ${profile.socials.github}
- **XING**: ${profile.socials.xing}

## Professional Experience

**Company**: ${profile.experience.company}
**Total Duration**: ${profile.experience.totalDuration}

${profile.experience.roles.map(r => `
### ${r.title}
**Period**: ${r.date} (${r.duration})

${r.description}
`).join('\n')}

## Education

${profile.education.map(e => `
### ${e.school}
**Degree**: ${e.degree}
**Period**: ${e.date}
**Status**: ${e.status}

${e.details}
`).join('\n')}

## Technical Skills

${profile.skills.map(s => `- ${s}`).join('\n')}

## Certifications

${profile.certifications.map(c => `- ${c}`).join('\n')}

## Projects Portfolio

${profile.projects.map(p => `
### ${p.name}
**Role**: ${p.role}
**Date**: ${p.date}
**URL**: ${p.url}

${p.description}
`).join('\n')}

---

# Blog Posts

${blogContent}

---

# Technical Architecture

## Tech Stack

- **Framework**: Qwik + Qwik City (resumability, zero hydration)
- **Styling**: Tailwind CSS with Modal.com-inspired dark theme
- **CMS**: Sanity (headless, GROQ queries)
- **Hosting**: Cloudflare Pages (edge deployment)
- **Language**: TypeScript

## Key Features

1. **Instant Loading**: Qwik's resumability means near-zero JavaScript on initial load
2. **Dark/Light Theme**: System-aware with manual toggle, persisted to localStorage
3. **Blog with CMS**: Content managed via Sanity Studio with Markdown support
4. **Dynamic Sitemap**: Auto-generated from Sanity content for SEO
5. **Edge Deployed**: Cloudflare Pages for global performance
6. **RSS Feed**: Available at /rss.xml

## Site Structure

- **Home (/)**: Portfolio with experience, education, projects, credentials
- **Blog (/blog)**: Technical articles fetched from Sanity CMS
- **Individual Posts (/blog/[slug])**: Full article pages with markdown rendering
- **Sitemap (/sitemap.xml)**: Dynamic sitemap for SEO
- **RSS (/rss.xml)**: RSS feed for blog subscribers
- **LLMs.txt (/llms.txt)**: This structured context file

## Repository Links

- **Main Site**: https://github.com/chindris-mihai-alexandru/mihai.codes
- **Sanity Studio**: https://github.com/chindris-mihai-alexandru/mihai-codes-studio
- **Live Site**: https://mihai.codes
- **Studio**: https://mihai-codes.sanity.studio

---

# Metadata

- **Author**: ${profile.name}
- **License**: MIT
- **Sanity Project ID**: 76ahey7l
- **Dataset**: production
`;

  send(new Response(llmsFullTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  }));
};

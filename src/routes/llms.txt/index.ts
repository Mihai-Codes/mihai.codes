import type { RequestHandler } from '@builder.io/qwik-city';
import { getAllPosts } from '../../lib/sanity';
import { profile } from '../../data/profile';

export const onGet: RequestHandler = async ({ send }) => {
  const posts = await getAllPosts();
  
  const blogSection = posts.map(post => 
    `- [${post.title}](/blog/${post.slug}): ${post.description}${post.tags.length ? ` Tags: ${post.tags.join(', ')}` : ''}`
  ).join('\n');

  const projectsSection = profile.projects.map(p => 
    `- [${p.name}](${p.url}): ${p.role} - ${p.description}`
  ).join('\n');

  const llmsTxt = `# mihai.codes

> Personal portfolio and blog of ${profile.name} - ${profile.tagline}. Built with Qwik, Tailwind CSS, and Cloudflare Pages.

## About ${profile.name}

${profile.summary}

### Contact
- Email: ${profile.socials.email}
- LinkedIn: ${profile.socials.linkedin}
- GitHub: ${profile.socials.github}

## Blog Posts

Technical articles on engineering, cloud computing, and building in public.

${blogSection}

## Projects

${projectsSection}

## Technical Skills

${profile.skills.join(', ')}

## Certifications

${profile.certifications.map(c => `- ${c}`).join('\n')}

## Experience

**${profile.experience.company}** (${profile.experience.totalDuration})

${profile.experience.roles.map(r => `- **${r.title}** (${r.date}): ${r.description}`).join('\n')}

## Education

${profile.education.map(e => `- **${e.school}** - ${e.degree} (${e.date}): ${e.details}`).join('\n')}

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Qwik + Qwik City |
| Styling | Tailwind CSS |
| CMS | Sanity (headless) |
| Hosting | Cloudflare Pages (edge) |
| Language | TypeScript |

## Repository Structure

\`\`\`
src/
├── components/     # Reusable UI components
├── context/        # Qwik context providers
├── data/           # Static data (profile.ts)
├── lib/            # Utilities (Sanity client)
└── routes/         # File-based routing
    ├── index.tsx   # Home page
    ├── blog/       # Blog routes
    └── llms.txt/   # This file
\`\`\`

## Related

- Sanity Studio: https://github.com/chindris-mihai-alexandru/mihai-codes-studio
- Live Site: https://mihai.codes
- GitHub: https://github.com/chindris-mihai-alexandru/mihai.codes

## License

MIT - Built by ${profile.name}
`;

  send(new Response(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  }));
};

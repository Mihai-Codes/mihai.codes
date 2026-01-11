import { component$ } from '@builder.io/qwik';
import { Link, routeLoader$ } from '@builder.io/qwik-city';
import { getAllPosts, type BlogPost } from '../../lib/sanity';
import { ThemeToggle } from '../../components/theme-toggle/theme-toggle';

// Fetch posts at request time from Sanity
export const usePosts = routeLoader$<BlogPost[]>(async () => {
  return await getAllPosts();
});

export default component$(() => {
  const posts = usePosts();

  return (
    <div class="min-h-screen p-8 md:p-16 max-w-4xl mx-auto">
      {/* Theme toggle - fixed position */}
      <div class="fixed top-4 right-4 md:top-8 md:right-8 z-50">
        <ThemeToggle />
      </div>

      {/* Back to home */}
      <nav class="mb-8">
        <Link href="/" class="text-accent hover:underline font-mono text-sm">
          &larr; Back to home
        </Link>
      </nav>

      <header class="mb-16">
        <h1 class="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
          Blog
        </h1>
        <p class="text-xl text-text-secondary font-mono">
          Thoughts on engineering, product, and building in public.
        </p>
      </header>

      <main>
        <div class="space-y-8">
          {posts.value.length === 0 ? (
            <p class="text-text-secondary font-mono">No posts yet. Check back soon!</p>
          ) : (
            posts.value.map((post) => (
              <article key={post.slug} class="modal-card card-border-reveal p-6 rounded-lg group">
                <Link href={`/blog/${post.slug}`} class="block">
                  <div class="flex justify-between items-start mb-2">
                    <h2 class="text-xl font-bold group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <span class="text-sm font-mono text-text-secondary shrink-0 ml-4">
                      {post.date}
                    </span>
                  </div>
                  <p class="text-text-secondary mb-3">{post.description}</p>
                  <div class="flex items-center gap-4 text-sm">
                    <span class="font-mono text-text-secondary">{post.readingTime}</span>
                    <div class="flex gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          class="px-2 py-1 bg-muted rounded text-xs font-mono text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </main>

      <footer class="mt-24 pt-8 border-t border-border text-text-secondary text-sm font-mono text-center">
        <p class="text-text-primary font-semibold">mihai.codes</p>
        <p class="mt-2">
          Built with Qwik · Deployed on Cloudflare Pages ·{' '}
          <a
            href="https://github.com/chindris-mihai-alexandru/mihai.codes"
            target="_blank"
            class="text-accent hover:underline"
          >
            Source on GitHub
          </a>
        </p>
        <p class="mt-2">&copy; {new Date().getFullYear()} Mihai Chindriș</p>
      </footer>
    </div>
  );
});

export const head = {
  title: 'Blog | Mihai Chindriș',
  meta: [
    {
      name: 'description',
      content: 'Thoughts on engineering, product, and building in public.',
    },
    {
      property: 'og:title',
      content: 'Blog | Mihai Chindriș',
    },
    {
      property: 'og:description',
      content: 'Thoughts on engineering, product, and building in public.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: 'https://mihai.codes/blog',
    },
    {
      property: 'og:site_name',
      content: 'mihai.codes',
    },
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:title',
      content: 'Blog | Mihai Chindriș',
    },
    {
      name: 'twitter:description',
      content: 'Thoughts on engineering, product, and building in public.',
    },
  ],
};

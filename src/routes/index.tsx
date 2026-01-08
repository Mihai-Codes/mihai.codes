import { component$ } from '@builder.io/qwik';
import { profile } from '../data/profile';
import { ThemeToggle } from '../components/theme-toggle/theme-toggle';

export default component$(() => {
  return (
    <div class="min-h-screen p-8 md:p-16 max-w-4xl mx-auto">
      {/* Theme toggle - fixed position */}
      <div class="fixed top-4 right-4 md:top-8 md:right-8 z-50">
        <ThemeToggle />
      </div>

      <header class="mb-16">
        <h1 class="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
          {profile.name}
        </h1>
        <p class="text-xl text-text-secondary font-mono mb-6">
          {profile.tagline}
        </p>
        <div class="flex gap-4 text-sm font-mono text-accent">
          <a href={profile.socials.github} target="_blank" class="hover:underline">GitHub</a>
          <a href={profile.socials.linkedin} target="_blank" class="hover:underline">LinkedIn</a>
          <a href={`mailto:${profile.socials.email}`} class="hover:underline">Email</a>
        </div>
      </header>

      <main class="space-y-16">
        <section>
          <h2 class="text-2xl font-bold mb-6 border-b border-border pb-2">About</h2>
          <p class="text-lg leading-relaxed text-text-secondary">
            {profile.summary}
          </p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-6 border-b border-border pb-2">Experience</h2>
          <div class="space-y-8">
            {profile.experience.map((role, i) => (
              <div key={i} class="modal-card p-6 rounded-lg">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-xl font-bold">{role.company}</h3>
                  <span class="text-sm font-mono text-text-secondary">{role.date}</span>
                </div>
                <div class="text-accent font-mono text-sm mb-3">{role.role}</div>
                <p class="text-text-secondary text-sm">{role.details}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-6 border-b border-border pb-2">Projects</h2>
          <div class="grid md:grid-cols-2 gap-6">
            {profile.projects.map((project, i) => (
              <div key={i} class="modal-card p-6 rounded-lg">
                <h3 class="text-lg font-bold mb-2">{project.name}</h3>
                <p class="text-xs font-mono text-text-secondary mb-3">{project.role}</p>
                <p class="text-sm text-text-secondary">{project.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer class="mt-24 pt-8 border-t border-border text-center text-text-secondary text-sm font-mono">
        <p>Built with Qwik & Tailwind CSS</p>
        <p class="mt-2">&copy; 2026 Mihai Chindriș</p>
      </footer>
    </div>
  );
});

export const head = {
  title: 'Mihai Chindriș | Software Engineer & Aspiring PM',
  meta: [
    {
      name: 'description',
      content: 'Personal site of Mihai Chindriș',
    },
  ],
};

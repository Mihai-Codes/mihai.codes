import { component$, useVisibleTask$ } from '@builder.io/qwik';

interface GitHubWidgetProps {
  /** GitHub username */
  username: string;
}

export const GitHubWidget = component$<GitHubWidgetProps>(({ username }) => {
  // Load GitHub widget script when component becomes visible
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    // Check if script already loaded
    if (!document.querySelector('script[src*="github-card"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/github-card@1.2.1/dist/widget.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  });

  return (
    <div class="github-widget" data-username={username}>
      <a
        href={`https://github.com/${username}`}
        target="_blank"
        class="text-accent hover:underline font-mono text-sm"
      >
        View GitHub Profile
      </a>
    </div>
  );
});

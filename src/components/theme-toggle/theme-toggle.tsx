import { component$ } from '@builder.io/qwik';

/**
 * Theme Toggle Button
 * 
 * This component renders a button that toggles between light and dark themes.
 * 
 * IMPORTANT: For SSG compatibility, this uses event delegation:
 * - The button has id="theme-toggle-btn"
 * - The click handler is attached via document.addEventListener in root.tsx's themeScript
 * - This way, no inline script is needed (which may not execute in SSG HTML)
 * 
 * The window.__toggleTheme function and event listener are defined in root.tsx.
 */
export const ThemeToggle = component$(() => {
  // We use dangerouslySetInnerHTML to render raw HTML
  // The click handler is attached via event delegation in root.tsx (head script)
  const buttonHtml = `
    <button
      id="theme-toggle-btn"
      class="p-2 rounded-lg border border-border hover:border-accent transition-colors cursor-pointer"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      <!-- Sun icon - shown in dark mode -->
      <svg
        class="w-5 h-5 hidden dark:block text-accent pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <!-- Moon icon - shown in light mode -->
      <svg
        class="w-5 h-5 block dark:hidden text-accent pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  `;

  return <div dangerouslySetInnerHTML={buttonHtml} />;
});

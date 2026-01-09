import { component$ } from '@builder.io/qwik';

/**
 * Theme Toggle Button
 * 
 * This component renders a button that toggles between light and dark themes.
 * 
 * IMPORTANT: For SSG compatibility, we render raw HTML that includes:
 * 1. The button element with an ID
 * 2. An inline script that attaches the click handler immediately
 * 
 * This approach works because the script runs synchronously right after
 * the button is parsed into the DOM, before the page finishes loading.
 * 
 * The window.__toggleTheme function is defined in root.tsx's themeScript.
 */
export const ThemeToggle = component$(() => {
  // We use dangerouslySetInnerHTML to render raw HTML with a button and inline script
  // The script immediately attaches the click handler after the button exists
  const buttonHtml = `
    <button
      id="theme-toggle-btn"
      class="p-2 rounded-lg border border-border hover:border-accent transition-colors"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      <!-- Sun icon - shown in dark mode -->
      <svg
        class="w-5 h-5 hidden dark:block text-accent"
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
        class="w-5 h-5 block dark:hidden text-accent"
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
    <script>
      (function() {
        var btn = document.getElementById('theme-toggle-btn');
        if (btn && window.__toggleTheme) {
          btn.onclick = window.__toggleTheme;
        }
      })();
    </script>
  `;

  return <div dangerouslySetInnerHTML={buttonHtml} />;
});

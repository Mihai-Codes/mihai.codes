import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import { ThemeProvider } from './context/theme';

import './global.css';

// Inline script for theme handling - works without Qwik hydration
// This runs in <head> BEFORE body renders, preventing FOUC
// The toggle button uses inline onclick="window.__toggleTheme()" to call this
const themeScript = `
(function() {
  var STORAGE_KEY = 'mihai-codes-theme';
  var stored = localStorage.getItem(STORAGE_KEY);
  var theme = stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  // Apply theme immediately to prevent FOUC
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
  
  // Store current theme globally
  window.__theme = theme;
  
  // Global theme setter - updates class, localStorage, and window.__theme
  window.__setTheme = function(t) {
    window.__theme = t;
    localStorage.setItem(STORAGE_KEY, t);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(t);
  };
  
  // Toggle function
  window.__toggleTheme = function() {
    var newTheme = window.__theme === 'dark' ? 'light' : 'dark';
    window.__setTheme(newTheme);
  };
  
  // Event delegation for theme toggle button
  // This works because the listener is on document, not the button itself
  // So it works even when the button is rendered later in SSG HTML
  document.addEventListener('click', function(e) {
    if (e.target.closest('#theme-toggle-btn')) {
      window.__toggleTheme();
    }
  });
})();
`;

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        {/* Prevent FOUC by setting theme before render */}
        <script dangerouslySetInnerHTML={themeScript} />
        <RouterHead />
        <ServiceWorkerRegister />
      </head>
      <body lang="en">
        <ThemeProvider>
          <RouterOutlet />
        </ThemeProvider>
        {/* LinkedIn embed script - auto-finds badge elements after page load */}
        <script
          async
          src="https://platform.linkedin.com/badges/js/profile.js"
        />
      </body>
    </QwikCityProvider>
  );
});

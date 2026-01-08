import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';
import { ThemeProvider } from './context/theme';

import './global.css';

// Inline script to prevent FOUC and handle theme toggle (works without Qwik hydration)
const themeScript = `
(function() {
  var STORAGE_KEY = 'mihai-codes-theme';
  var stored = localStorage.getItem(STORAGE_KEY);
  var theme = stored || 'system';
  
  function applyTheme(t) {
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    if (t === 'system') {
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(t);
    }
  }
  
  // Apply theme immediately to prevent FOUC
  applyTheme(theme);
  
  // Store current theme globally for toggle access
  window.__theme = theme;
  window.__setTheme = function(t) {
    window.__theme = t;
    localStorage.setItem(STORAGE_KEY, t);
    applyTheme(t);
    // Update button title
    var btn = document.querySelector('[data-theme-toggle]');
    if (btn) btn.title = 'Current: ' + t + '. Click to change.';
  };
  
  // Attach click handler - use capturing phase to run before Qwik
  function attachHandler() {
    var btn = document.querySelector('[data-theme-toggle]');
    if (btn && !btn.__themeHandlerAttached) {
      btn.__themeHandlerAttached = true;
      btn.title = 'Current: ' + window.__theme + '. Click to change.';
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        var cycle = { dark: 'light', light: 'system', system: 'dark' };
        window.__setTheme(cycle[window.__theme]);
      }, true); // capture phase
    }
  }
  
  // Try multiple times to ensure button is found
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHandler);
  } else {
    attachHandler();
  }
  // Also try after a short delay as backup
  setTimeout(attachHandler, 100);
  setTimeout(attachHandler, 500);
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
      </body>
    </QwikCityProvider>
  );
});

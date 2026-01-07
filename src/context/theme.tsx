import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useSignal,
  useVisibleTask$,
  type Signal,
} from '@builder.io/qwik';

export type Theme = 'light' | 'dark' | 'system';

export const ThemeContext = createContextId<Signal<Theme>>('theme-context');

const STORAGE_KEY = 'mihai-codes-theme';

export const ThemeProvider = component$(() => {
  const theme = useSignal<Theme>('system');

  // Read theme from localStorage on mount (client-side only)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    () => {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        theme.value = stored;
      }
      applyTheme(theme.value);
    },
    { strategy: 'document-ready' }
  );

  // Watch for theme changes and apply
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    track(() => theme.value);
    localStorage.setItem(STORAGE_KEY, theme.value);
    applyTheme(theme.value);
  });

  useContextProvider(ThemeContext, theme);

  return <Slot />;
});

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    root.classList.add(theme);
  }
}

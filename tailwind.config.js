/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        'card-bg': 'var(--card-bg)',
        'text-secondary': 'var(--text-secondary)',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      /**
       * EPHEMERAL ANIMATIONS - Phase 3
       * 
       * These keyframes and animations are scaffolding for the design-first
       * ephemeral features. Values will be populated from Figma Make designs
       * after Gemini validation.
       * 
       * Reference: _private/EPHEMERAL_DESIGN_HANDOFF.md
       * Research: Virtual Nature (sunrise/sunset transience triggers awe)
       * 
       * @see https://qwik.dev/docs/integrations/tailwind/
       */
      keyframes: {
        // Ephemeral fade - gentle opacity transitions for transient content
        'ephemeral-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Atmospheric glow - subtle color shifts suggesting time passing
        'atmospheric-glow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
        // Reading journey - progress indication as user scrolls
        'reading-progress': {
          '0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
          '100%': { transform: 'scaleX(1)', transformOrigin: 'left' },
        },
        // Sunrise gradient - warm color shift for time-of-day awareness
        'sunrise-shift': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(30deg)' },
        },
        // Sunset gradient - cool color shift
        'sunset-shift': {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(-30deg)' },
        },
      },
      animation: {
        // Default values - will be refined based on Figma specs
        'ephemeral-fade': 'ephemeral-fade 0.5s ease-out',
        'atmospheric-glow': 'atmospheric-glow 8s ease-in-out infinite',
        'reading-progress': 'reading-progress 0.3s ease-out',
        'sunrise-shift': 'sunrise-shift 1800s linear', // 30 min cycle
        'sunset-shift': 'sunset-shift 1800s linear',
      },
      /**
       * Transition defaults for ephemeral effects
       * @see https://tailwindcss.com/docs/transition-duration
       */
      transitionDuration: {
        'ephemeral': '500ms',
        'atmospheric': '2000ms',
      },
      transitionTimingFunction: {
        'ephemeral': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'atmospheric': 'cubic-bezier(0.16, 1, 0.3, 1)', // ease-out-expo
      },
    },
  },
  plugins: [],
};

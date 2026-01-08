import { component$, useVisibleTask$ } from '@builder.io/qwik';

interface CredlyBadgeProps {
  badgeId: string;
  width?: number;
  height?: number;
}

export const CredlyBadge = component$<CredlyBadgeProps>(
  ({ badgeId, width = 150, height = 270 }) => {
    // Load Credly embed script when component becomes visible
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      // Check if script already loaded
      if (!document.querySelector('script[src*="credly.com/assets/utilities/embed.js"]')) {
        const script = document.createElement('script');
        script.src = '//cdn.credly.com/assets/utilities/embed.js';
        script.async = true;
        document.body.appendChild(script);
      } else {
        // If script already exists, trigger re-render of badges
        // @ts-expect-error Credly global
        if (window.CredlyBadge) {
          // @ts-expect-error Credly global
          window.CredlyBadge.init();
        }
      }
    });

    return (
      <div
        data-iframe-width={width}
        data-iframe-height={height}
        data-share-badge-id={badgeId}
        data-share-badge-host="https://www.credly.com"
        class="credly-badge"
      />
    );
  }
);

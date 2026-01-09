import { component$, useContext } from '@builder.io/qwik';
import { ThemeContext } from '../../context/theme';

type BadgeSize = 'small' | 'medium' | 'large';

interface LinkedInBadgeProps {
  /** LinkedIn profile URL path (e.g., "mihai-chindris") */
  profileId: string;
  /** Badge size variant */
  size?: BadgeSize;
}

const BADGE_SIZES: Record<BadgeSize, { width: string; height: string }> = {
  small: { width: '110', height: '22' },
  medium: { width: '160', height: '30' },
  large: { width: '200', height: '71' },
};

/**
 * LinkedIn Profile Badge component.
 * 
 * The LinkedIn embed script is loaded in root.tsx and auto-discovers
 * elements with the LI-profile-badge class and data attributes.
 * This approach works reliably with SSG since the script runs after
 * the page loads, finding the badge elements in the static HTML.
 */
export const LinkedInBadge = component$<LinkedInBadgeProps>(
  ({ profileId, size = 'medium' }) => {
    const theme = useContext(ThemeContext);
    const dimensions = BADGE_SIZES[size];

    return (
      <div
        class="badge-base LI-profile-badge"
        data-locale="en_US"
        data-size={size}
        data-theme={theme.value}
        data-type="HORIZONTAL"
        data-vanity={profileId}
        data-version="v1"
        style={{ width: `${dimensions.width}px` }}
      >
        <a
          class="badge-base__link LI-simple-link"
          href={`https://www.linkedin.com/in/${profileId}?trk=profile-badge`}
          target="_blank"
        >
          View LinkedIn Profile
        </a>
      </div>
    );
  }
);

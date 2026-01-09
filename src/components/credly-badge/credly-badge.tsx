import { component$ } from '@builder.io/qwik';

export interface CredlyBadgeData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  badgeUrl: string;
  issuerName: string;
  issuedAt?: string;
}

interface CredlyBadgeProps {
  badge: CredlyBadgeData | null;
}

/**
 * Credly Badge component
 * 
 * Displays a Credly badge using data fetched at build time (SSG).
 * The parent route uses routeLoader$ to fetch badge data from Credly's
 * public page and extracts the OG meta tags.
 * 
 * This approach works reliably on SSG because:
 * 1. Data is fetched server-side at build time (no CORS issues)
 * 2. Badge info is baked into the static HTML
 * 3. No client-side JavaScript required for display
 */
export const CredlyBadge = component$<CredlyBadgeProps>(({ badge }) => {
  if (!badge) {
    return (
      <div class="flex flex-col items-center p-4 text-text-secondary">
        <div class="w-[120px] h-[120px] bg-surface rounded-lg flex items-center justify-center mb-3">
          <svg class="w-12 h-12 text-text-secondary opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <p class="text-sm font-mono">Badge unavailable</p>
      </div>
    );
  }

  return (
    <a
      href={badge.badgeUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="flex flex-col items-center p-2 hover:opacity-90 transition-opacity group"
    >
      <img
        src={badge.imageUrl}
        alt={badge.title}
        width={120}
        height={120}
        class="mb-3 group-hover:scale-105 transition-transform"
        loading="lazy"
      />
      <div class="text-center max-w-[180px]">
        <p class="text-sm font-semibold text-text-primary leading-tight mb-1">
          {badge.title}
        </p>
        <p class="text-xs text-text-secondary font-mono">
          {badge.issuerName}
        </p>
      </div>
    </a>
  );
});

/**
 * Fetches badge data from Credly by scraping the public badge page.
 * This function is meant to be called from a routeLoader$ in the route file.
 * 
 * @param badgeId - The Credly badge ID (UUID format)
 * @returns Badge data or null if fetch fails
 */
export async function fetchCredlyBadge(badgeId: string): Promise<CredlyBadgeData | null> {
  try {
    const response = await fetch(`https://www.credly.com/badges/${badgeId}`);
    if (!response.ok) {
      console.error('Credly fetch error:', response.status);
      return null;
    }
    
    const html = await response.text();
    
    // Extract OG meta tags from HTML
    const getMetaContent = (property: string): string => {
      const regex = new RegExp(`<meta property="${property}" content="([^"]*)"`, 'i');
      const match = html.match(regex);
      return match ? match[1] : '';
    };
    
    const ogTitle = getMetaContent('og:title');
    const ogDescription = getMetaContent('og:description');
    const ogImage = getMetaContent('og:image');
    const ogUrl = getMetaContent('og:url');
    
    // Parse title to extract badge name and issuer
    // Format: "Badge Name was issued by Issuer Name to Recipient Name."
    let title = ogTitle;
    let issuerName = 'Credly';
    
    const issuedByMatch = ogTitle.match(/^(.+?) was issued by (.+?) to /);
    if (issuedByMatch) {
      title = issuedByMatch[1].trim();
      issuerName = issuedByMatch[2].trim();
    }
    
    // Get a larger image by modifying the URL
    // Credly uses: linkedin_thumb_blob, twitter_thumb_201604_blob, etc.
    // We can use size/340x340 format for a good quality image
    let imageUrl = ogImage;
    if (imageUrl.includes('linkedin_thumb_blob')) {
      // Try to get a cleaner URL by extracting the image ID
      const imageIdMatch = imageUrl.match(/images\/([^/]+)\//);
      if (imageIdMatch) {
        imageUrl = `https://images.credly.com/size/340x340/images/${imageIdMatch[1]}/image.png`;
      }
    }
    
    return {
      id: badgeId,
      title,
      description: ogDescription,
      imageUrl,
      badgeUrl: ogUrl || `https://www.credly.com/badges/${badgeId}/public_url`,
      issuerName,
    };
  } catch (error) {
    console.error('Failed to fetch Credly badge:', error);
    return null;
  }
}

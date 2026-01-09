import { component$ } from '@builder.io/qwik';

interface GitHubWidgetProps {
  /** GitHub username */
  username: string;
  /** Pre-fetched user data (from routeLoader$) */
  userData?: GitHubUser | null;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

/**
 * GitHub Widget component
 * 
 * For SSG, pass userData from routeLoader$ so it's rendered at build time.
 * If userData is not provided, shows a fallback with static avatar.
 */
export const GitHubWidget = component$<GitHubWidgetProps>(({ username, userData }) => {
  // Fallback avatar URL using GitHub's avatar service
  const avatarUrl = userData?.avatar_url || `https://avatars.githubusercontent.com/u/12643176?v=4`;
  const profileUrl = userData?.html_url || `https://github.com/${username}`;
  const displayName = userData?.name || username;
  
  return (
    <div class="github-widget">
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        class="flex flex-col sm:flex-row items-center sm:items-start gap-4 group text-center sm:text-left"
      >
        <img
          src={avatarUrl}
          alt={displayName}
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          class="rounded-full border-2 border-border group-hover:border-accent transition-colors flex-shrink-0"
        />
        <div class="min-w-0">
          <div class="font-bold group-hover:text-accent transition-colors">
            {displayName}
          </div>
          <div class="text-sm text-text-secondary font-mono">@{username}</div>
          {userData?.bio && (
            <div class="text-xs text-text-secondary mt-1 max-w-[200px] truncate">
              {userData.bio}
            </div>
          )}
          {userData && (
            <div class="flex justify-center sm:justify-start gap-4 mt-2 text-xs text-text-secondary font-mono">
              <span>{userData.public_repos} repos</span>
              <span>{userData.followers} followers</span>
            </div>
          )}
        </div>
      </a>
    </div>
  );
});

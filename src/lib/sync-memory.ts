/**
 * Hindsight Memory Sync
 * Syncs blog posts and profile data to Hindsight memory
 */
import { getAllPosts } from './sanity';
import { profile } from '../data/profile';
import { retainMemoryBatch } from './hindsight';

export async function syncMemoryBank() {
  try {
    const items: Array<{ content: string; context?: string }> = [];

    // Add profile information
    items.push({
      content: `${profile.name} is a ${profile.tagline} based in ${profile.location}. ${profile.summary}`,
      context: 'profile',
    });

    // Add experience
    for (const role of profile.experience.roles) {
      items.push({
        content: `${profile.name} worked as ${role.title} at ${profile.experience.company} (${role.date}): ${role.description}`,
        context: 'experience',
      });
    }

    // Add skills
    items.push({
      content: `${profile.name}'s technical skills: ${profile.skills.join(', ')}`,
      context: 'skills',
      });

    // Add blog posts
    const posts = await getAllPosts();
    for (const post of posts) {
      items.push({
        content: `Blog post: "${post.title}" (${post.date}). ${post.description}. Tags: ${post.tags.join(', ')}. URL: https://mihai.codes/blog/${post.slug}`,
        context: 'blog',
      });
    }

    // Add projects
    for (const project of profile.projects) {
      items.push({
        content: `Project: ${project.name} - ${project.role}. ${project.description}. URL: ${project.url}`,
        context: 'projects',
      });
    }

    // Batch retain all items in a single API call
    console.log(`Syncing ${items.length} memory items...`);
    await retainMemoryBatch(items);

    console.log('✅ Memory bank synced successfully');
  } catch (error) {
    console.error('❌ Failed to sync memory bank:', error);
    // Don't exit with error code to prevent CI failure
    console.log('⚠️  Memory sync failed, but continuing with deployment...');
  }
}

// Run when executed directly
void syncMemoryBank();

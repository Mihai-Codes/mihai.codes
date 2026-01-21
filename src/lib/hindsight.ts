/**
 * Hindsight Memory Integration
 * Provides agent memory capabilities for mihai.codes
 */
import { HindsightClient } from '@vectorize-io/hindsight-client';

const HINDSIGHT_URL = process.env.HINDSIGHT_API_URL || 'http://localhost:8888';
const BANK_ID = 'mihai-codes';

export const hindsight = new HindsightClient({ baseUrl: HINDSIGHT_URL });

/**
 * Retain information in agent memory
 * Uses async mode for faster response - processing happens in background
 */
export async function retainMemory(content: string, context?: string) {
  return await hindsight.retain(BANK_ID, content, { context, async: true });
}

/**
 * Retain multiple memories in a single batch
 * Uses async mode for faster response - processing happens in background
 */
export async function retainMemoryBatch(items: Array<{ content: string; context?: string }>) {
  return await hindsight.retainBatch(
    BANK_ID,
    items.map((item) => ({ content: item.content, context: item.context })),
    { async: true }
  );
}

/**
 * Recall memories based on query
 */
export async function recallMemory(query: string) {
  return await hindsight.recall(BANK_ID, query);
}

/**
 * Reflect on memories to generate insights
 */
export async function reflectOnMemory(query: string) {
  return await hindsight.reflect(BANK_ID, query);
}

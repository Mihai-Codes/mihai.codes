/**
 * Hindsight Memory API
 * Endpoints for querying agent memory
 */
import type { RequestHandler } from '@builder.io/qwik-city';
import { recallMemory, reflectOnMemory } from '../../../lib/hindsight';

export const onGet: RequestHandler = async ({ query, json }) => {
  const q = query.get('q');
  const mode = query.get('mode') || 'recall'; // recall or reflect

  if (!q) {
    json(400, { error: 'Query parameter "q" is required' });
    return;
  }

  try {
    const result = mode === 'reflect' 
      ? await reflectOnMemory(q)
      : await recallMemory(q);

    json(200, { query: q, mode, result });
  } catch (error) {
    json(500, { error: 'Failed to query memory', details: String(error) });
  }
};

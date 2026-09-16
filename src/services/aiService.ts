import type { AssistantPrompt } from '../modules/ai/promptSchema';
import { validatePrompt } from '../modules/ai/promptSchema';
import { request } from './apiClient';

export interface AssistantReply {
  readonly text: string;
  readonly citedSkus: readonly string[];
}

export class InvalidPromptError extends Error {
  constructor(readonly problems: readonly string[]) {
    super(`invalid assistant prompt: ${problems.join('; ')}`);
    this.name = 'InvalidPromptError';
  }
}

export async function ask(prompt: AssistantPrompt): Promise<AssistantReply> {
  const problems = validatePrompt(prompt);
  if (problems.length > 0) {
    throw new InvalidPromptError(problems);
  }

  return request<AssistantReply>('/ai/assistant', { method: 'POST', body: prompt });
}

/**
 * The full answer takes around four seconds to arrive. Streaming it does not
 * make the model faster, but it does mean the panel stops looking broken.
 */
export async function* askStreaming(prompt: AssistantPrompt): AsyncGenerator<string> {
  const problems = validatePrompt(prompt);
  if (problems.length > 0) {
    throw new InvalidPromptError(problems);
  }

  const response = await fetch('/api/ai/assistant/stream', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(prompt),
  });

  if (!response.ok || !response.body) {
    throw new Error(`assistant stream failed with ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

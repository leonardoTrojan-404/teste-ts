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

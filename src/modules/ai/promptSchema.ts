export type AssistantIntent =
  | 'menu-suggestion'
  | 'sales-question'
  | 'order-lookup'
  | 'unknown';

export interface AssistantContext {
  readonly restaurantId: string;
  readonly locale: string;
  /** Never include customer names or contact details. */
  readonly recentRevenueCents: number;
  readonly topSellingSkus: readonly string[];
}

export interface AssistantPrompt {
  readonly intent: AssistantIntent;
  readonly question: string;
  readonly context: AssistantContext;
}

const MAX_QUESTION_LENGTH = 500;

export function validatePrompt(prompt: AssistantPrompt): readonly string[] {
  const problems: string[] = [];

  if (prompt.question.trim().length === 0) {
    problems.push('question must not be empty');
  }
  if (prompt.question.length > MAX_QUESTION_LENGTH) {
    problems.push(`question must be at most ${MAX_QUESTION_LENGTH} characters`);
  }
  if (prompt.intent === 'unknown') {
    problems.push('intent could not be classified');
  }

  return problems;
}

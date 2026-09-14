import type { AssistantReply } from '../../services/aiService';
import type { AssistantIntent } from '../../modules/ai/promptSchema';

export type PanelState =
  | { readonly kind: 'idle' }
  | { readonly kind: 'asking'; readonly question: string }
  | { readonly kind: 'answered'; readonly reply: AssistantReply }
  | { readonly kind: 'failed'; readonly message: string };

const SUGGESTED: readonly { intent: AssistantIntent; label: string }[] = [
  { intent: 'menu-suggestion', label: 'What should I push tonight?' },
  { intent: 'sales-question', label: 'How did last weekend compare?' },
  { intent: 'order-lookup', label: 'Where is order #412?' },
];

function renderBody(state: PanelState): string {
  switch (state.kind) {
    case 'idle':
      return `<ul class="assistant__suggestions">${SUGGESTED.map(
        (s) => `<li><button data-intent="${s.intent}">${s.label}</button></li>`,
      ).join('')}</ul>`;
    case 'asking':
      return `<p class="assistant__pending" aria-busy="true">${state.question}</p>`;
    case 'answered':
      return `<p class="assistant__answer">${state.reply.text}</p>`;
    case 'failed':
      return `<p class="assistant__error" role="alert">${state.message}</p>`;
  }
}

export function renderAssistantPanel(state: PanelState): string {
  return `
    <aside class="assistant surface surface--overlay" aria-label="Assistant">
      <h2 class="assistant__title">Assistant</h2>
      ${renderBody(state)}
    </aside>`;
}

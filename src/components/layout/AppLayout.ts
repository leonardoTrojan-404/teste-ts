import { renderStack } from './Stack';
import { renderSurface } from './Surface';

export interface LayoutProps {
  readonly mountPoint: string;
  readonly title: string;
  readonly slots?: {
    readonly sidebar?: string;
    readonly content?: string;
  };
}

export function renderLayout(props: LayoutProps): string {
  const header = renderSurface({
    elevation: 'raised',
    padding: 'compact',
    children: `<h1 class="app-header__title">${props.title}</h1>`,
  });

  const body = renderStack({
    direction: 'row',
    gap: 'regular',
    children: [
      props.slots?.sidebar ? `<nav class="app-sidebar">${props.slots.sidebar}</nav>` : '',
      `<section class="app-content">${props.slots?.content ?? ''}</section>`,
    ],
  });

  return `<main id="${props.mountPoint}" class="app-layout">${header}${body}</main>`;
}

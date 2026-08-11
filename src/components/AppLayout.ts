export interface LayoutProps {
  readonly mountPoint: string;
  readonly title: string;
}

export function renderLayout(props: LayoutProps): string {
  return [
    `<main id="${props.mountPoint}">`,
    `  <header class="app-header"><h1>${props.title}</h1></header>`,
    `  <section class="app-content"></section>`,
    `</main>`,
  ].join('\n');
}

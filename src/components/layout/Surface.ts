export type SurfaceElevation = 'flat' | 'raised' | 'overlay';

export interface SurfaceProps {
  readonly elevation: SurfaceElevation;
  readonly padding: 'none' | 'compact' | 'comfortable';
  readonly children: string;
}

export function renderSurface(props: SurfaceProps): string {
  return `<div class="surface surface--${props.elevation} surface--pad-${props.padding}">${props.children}</div>`;
}

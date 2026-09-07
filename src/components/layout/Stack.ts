export interface StackProps {
  readonly direction: 'row' | 'column';
  readonly gap: 'tight' | 'regular' | 'loose';
  readonly children: readonly string[];
}

export function renderStack(props: StackProps): string {
  return `<div class="stack stack--${props.direction} stack--gap-${props.gap}">${props.children.join('')}</div>`;
}

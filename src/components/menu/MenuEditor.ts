import type { MenuCategory, MenuItem } from '../../modules/menu/menuCategory';
import { sortCategories } from '../../modules/menu/menuCategory';

export interface MenuEditorProps {
  readonly categories: readonly MenuCategory[];
  readonly onEditItem: (sku: string) => void;
}

function renderItem(item: MenuItem): string {
  return `
    <li class="menu-item" data-sku="${item.sku}">
      <span class="menu-item__name">${item.name}</span>
      <span class="menu-item__price">${item.priceCents / 100}</span>
      <button class="menu-item__edit" data-sku="${item.sku}">Edit</button>
    </li>`;
}

export function renderMenuEditor(props: MenuEditorProps): string {
  const sections = sortCategories(props.categories).map(
    (category) => `
    <section class="menu-category" data-id="${category.id}">
      <h3>${category.name}</h3>
      <ul>${category.items.map(renderItem).join('')}</ul>
    </section>`,
  );

  return `<div class="menu-editor">${sections.join('')}</div>`;
}

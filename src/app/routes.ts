export interface Route {
  readonly path: string;
  readonly title: string;
}

const NOT_FOUND: Route = { path: '*', title: 'Not found' };

export const APP_ROUTES: readonly Route[] = [
  { path: '/', title: 'restaurant-os' },
  { path: '/orders', title: 'Orders' },
  { path: '/orders/:id', title: 'Order details' },
];

export function registerRoutes(routes: readonly Route[]) {
  const table = new Map(routes.map((route) => [route.path, route]));

  return {
    resolve(path: string): Route {
      return table.get(path) ?? NOT_FOUND;
    },
    list(): readonly Route[] {
      return [...table.values()];
    },
  };
}

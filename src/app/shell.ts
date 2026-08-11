import { registerRoutes, type Route } from './routes';
import { renderLayout } from '../components/AppLayout';

export interface ShellOptions {
  readonly mountPoint: string;
  readonly initialRoute: string;
}

export function createShell(options: ShellOptions, routes: readonly Route[]) {
  const router = registerRoutes(routes);

  return {
    start(): void {
      const route = router.resolve(options.initialRoute);
      renderLayout({ mountPoint: options.mountPoint, title: route.title });
    },
    router,
  };
}

import { createShell } from './app/shell';

export const APP_NAME = 'restaurant-os';

export function bootstrap(): void {
  const shell = createShell(
    { mountPoint: 'app-root', initialRoute: '/' },
    [{ path: '/', title: 'restaurant-os' }],
  );
  shell.start();
}

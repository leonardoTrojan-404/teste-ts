export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions {
  readonly method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly query?: Readonly<Record<string, string>>;
  readonly body?: unknown;
  readonly timeoutMs?: number;
}

const BASE_URL = '/api';

export const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * The payment provider routinely takes 20s+ to settle a card transaction. With
 * no timeout at all the request simply hung, and the order stayed in `received`
 * with the customer already charged. A bounded, deliberately generous window is
 * safer than no window.
 */
export const PAYMENT_TIMEOUT_MS = 45_000;

const PAYMENT_PATH_PREFIX = '/payments';

export function timeoutFor(path: string, override?: number): number {
  if (override !== undefined) {
    return override;
  }
  return path.startsWith(PAYMENT_PATH_PREFIX) ? PAYMENT_TIMEOUT_MS : DEFAULT_TIMEOUT_MS;
}

function buildUrl(path: string, query?: Readonly<Record<string, string>>): string {
  const url = `${BASE_URL}${path}`;
  if (!query) {
    return url;
  }
  return `${url}?${new URLSearchParams(query).toString()}`;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutFor(path, options.timeoutMs));

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers: options.body ? { 'content-type': 'application/json' } : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (cause) {
    if (controller.signal.aborted) {
      throw new ApiError(408, path, `request to ${path} timed out`);
    }
    throw cause;
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new ApiError(response.status, path, `request to ${path} failed with ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

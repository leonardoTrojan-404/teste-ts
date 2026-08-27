import { afterEach, describe, expect, test, vi } from 'vitest';
import { ApiError, request } from '../src/services/apiClient';

function mockFetch(status: number, payload: unknown = {}) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiClient', () => {
  test('appends query parameters to the request url', async () => {
    const fetchMock = mockFetch(200, []);
    vi.stubGlobal('fetch', fetchMock);

    await request('/orders', { query: { restaurantId: 'r1' } });

    expect(fetchMock).toHaveBeenCalledWith('/api/orders?restaurantId=r1', expect.anything());
  });

  test('throws ApiError carrying the status and path', async () => {
    vi.stubGlobal('fetch', mockFetch(503));

    await expect(request('/metrics')).rejects.toMatchObject({
      name: 'ApiError',
      status: 503,
      path: '/metrics',
    });
  });

  test('returns undefined for 204 responses instead of parsing a body', async () => {
    vi.stubGlobal('fetch', mockFetch(204));

    await expect(request('/orders/1/status', { method: 'PATCH' })).resolves.toBeUndefined();
  });

  test('ApiError is an Error subclass so it survives rethrowing', () => {
    expect(new ApiError(500, '/x', 'boom')).toBeInstanceOf(Error);
  });
});

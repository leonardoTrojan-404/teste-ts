import type { CustomerProfile } from '../modules/insights/segment';
import { request } from './apiClient';

export function loadProfiles(restaurantId: string): Promise<readonly CustomerProfile[]> {
  return request<CustomerProfile[]>('/insights/customers', { query: { restaurantId } });
}

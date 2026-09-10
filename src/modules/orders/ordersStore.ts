import { createStore, type Store } from '../../lib/store';
import type { OrderStatus, TrackedOrder } from './orderStatus';
import { filterActive, transition } from './orderStatus';

export interface OrdersState {
  readonly orders: readonly TrackedOrder[];
  readonly selectedId: string | undefined;
  readonly loadState: 'idle' | 'loading' | 'ready' | 'error';
}

const INITIAL: OrdersState = { orders: [], selectedId: undefined, loadState: 'idle' };

export function createOrdersStore(initial: Partial<OrdersState> = {}): Store<OrdersState> {
  return createStore<OrdersState>({ ...INITIAL, ...initial });
}

export function selectActiveOrders(state: OrdersState): readonly TrackedOrder[] {
  return filterActive(state.orders);
}

export function selectSelectedOrder(state: OrdersState): TrackedOrder | undefined {
  return state.orders.find((order) => order.id === state.selectedId);
}

export function moveOrder(store: Store<OrdersState>, id: string, to: OrderStatus): void {
  store.update((state) => ({
    ...state,
    orders: state.orders.map((order) => (order.id === id ? transition(order, to) : order)),
  }));
}

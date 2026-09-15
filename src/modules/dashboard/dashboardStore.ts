import { createStore, type Store } from '../../lib/store';
import type { DashboardSnapshot, DashboardWindow, LoadState } from './dashboard';
import { EMPTY_SNAPSHOT, isStale, nextLoadState } from './dashboard';

const STALE_AFTER_MS = 60_000;

export interface DashboardState {
  readonly snapshot: DashboardSnapshot;
  readonly window: DashboardWindow;
  readonly loadState: LoadState;
}

const INITIAL: DashboardState = {
  snapshot: EMPTY_SNAPSHOT,
  window: { from: '', to: '' },
  loadState: 'idle',
};

export function createDashboardStore(initial: Partial<DashboardState> = {}): Store<DashboardState> {
  return createStore<DashboardState>({ ...INITIAL, ...initial });
}

export function markFetching(store: Store<DashboardState>): void {
  store.update((state) => ({ ...state, loadState: nextLoadState(state.loadState, 'fetch') }));
}

export function resolveSnapshot(store: Store<DashboardState>, snapshot: DashboardSnapshot): void {
  store.update((state) => ({
    ...state,
    snapshot,
    window: snapshot.window,
    loadState: nextLoadState(state.loadState, 'resolve'),
  }));
}

export function selectIsStale(state: DashboardState, now: Date): boolean {
  return isStale(state.snapshot, now, STALE_AFTER_MS);
}

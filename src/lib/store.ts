export type Selector<S, T> = (state: S) => T;
export type Updater<S> = (state: S) => S;

export interface Store<S> {
  getState(): S;
  update(updater: Updater<S>): void;
  subscribe<T>(selector: Selector<S, T>, listener: (value: T) => void): () => void;
}

/**
 * Deliberately tiny. Modules currently keep state in module-level `let`
 * bindings, which makes two restaurants open in two tabs share a cache. A store
 * per module instance removes that class of bug without pulling in a framework.
 */
export function createStore<S>(initialState: S): Store<S> {
  let state = initialState;
  const subscriptions = new Set<{ selector: Selector<S, unknown>; listener: (value: never) => void; last: unknown }>();

  return {
    getState: () => state,

    update(updater) {
      const next = updater(state);
      if (Object.is(next, state)) {
        return;
      }
      state = next;

      for (const subscription of subscriptions) {
        const value = subscription.selector(state);
        if (!Object.is(value, subscription.last)) {
          subscription.last = value;
          (subscription.listener as (v: unknown) => void)(value);
        }
      }
    },

    subscribe(selector, listener) {
      const subscription = {
        selector: selector as Selector<S, unknown>,
        listener: listener as (value: never) => void,
        last: selector(state) as unknown,
      };
      subscriptions.add(subscription);
      return () => {
        subscriptions.delete(subscription);
      };
    },
  };
}

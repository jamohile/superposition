/** A subscription listens for broadcasts from a subscription manager. */
export type Subscription<T> = (value: T) => void;

/** Cancels a subscription. */
export type Unsubscriber = () => void;

/** Manages a pool of subscriptions, and allows them to be notified.  */
export class Subscribable<T> {
  private subscriptions = new Map<number, Subscription<T>>();

  /** Next ID to use for subscriptions. */
  private NEXT_ID = 0;

  private LAST_VALUE: T;

  constructor(initial: T) {
    this.LAST_VALUE = initial;
  }

  /** Listen for changes to this shared object.
   */
  public subscribe(subscription: Subscription<T>): Unsubscriber {
    const id = this.NEXT_ID;
    this.NEXT_ID += 1;

    this.subscriptions.set(id, subscription);
    return () => this.subscriptions.delete(id);
  }

  /**  Get the last value broadcasted. */
  public get(): T {
    return this.LAST_VALUE;
  }

  /** Broadcasts a value to all subscribers. */
  protected notify(value: T) {
    this.LAST_VALUE = value;
    this.subscriptions.forEach((subscription) => subscription(value));
  }
}

/** Takes a record of subscribables and combines them into a single subscription.
 *  handler will be called with all values when any one changes.
 */
export function collate<
  S extends Record<string, Subscribable<any>>,
  V extends Record<string, any>
>(sources: S, handler: (values: V) => void) {
  // Set up a subscription for each source.
  for (const source of Object.values(sources)) {
    source.subscribe(() => {
      const values = getAll(sources) as V;
      handler(values);
    });
  }
}

/** Combine values from all sources by key. */
export function getAll<
  S extends Record<string, Subscribable<any>>,
  V extends Record<string, any>
>(sources: S): V {
  const values: V = {} as V;

  for (const [k, s] of Object.entries(sources)) {
    // @ts-ignore
    (values as V)[k] = s.get();
  }
  return values;
}

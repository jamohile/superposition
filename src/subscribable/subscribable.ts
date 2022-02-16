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

/** Wraps a number of subscribables so we can operate on their values together. */
export class SubscribableCollection<
  /** Subscribables, as shared objects.*/
  D extends Record<string, Subscribable<any>>,
  /** Subscribables' values. TODO: encode this in D */
  V extends Record<string, any>
> extends Subscribable<V> {
  private subscribables: D;

  constructor(subscribables: D) {
    super(SubscribableCollection.getAll(subscribables));
    this.subscribables = subscribables;

    // Combine all subscribables into a single subscription.
    // Set up a subscription for each source.
    for (const source of Object.values(subscribables)) {
      source.subscribe(() => {
        const values = SubscribableCollection.getAll(this.subscribables) as V;
        this.notify(values);
      });
    }
  }

  /** Get combined values of all subscribables. */
  static getAll<
    /** Subscribables, as shared objects.*/
    D extends Record<string, Subscribable<any>>,
    /** Subscribables' values. TODO: encode this in D */
    V extends Record<string, any>
  >(subscribables: D): V {
    const values = {} as V;
    for (const [k, s] of Object.entries(subscribables)) {
      // @ts-ignore
      values[k] = s.get();
    }
    return values;
  }
}

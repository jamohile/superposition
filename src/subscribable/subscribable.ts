/** A subscription listens for broadcasts from a subscription manager. */
export type Subscription<T> = (value: T) => void;

/** Cancels a subscription. */
export type Unsubscriber = () => void;

/** Subscribable is an object that allows others to subscribe to it.
 *  Whenever it is changed, this change will be broadcasted to all subscribers.
 *
 *  Subscribable also maintains state, keeping track of the last value emitted.
 */
export class Subscribable<T> {
  private subscriptions = new Map<number, Subscription<T>>();

  /** Next ID to use for subscriptions.
   *  This lets us uniquely identify (and therefore unsub from) each subscription.
   */
  private NEXT_ID = 0;

  private LAST_VALUE: T;

  constructor(initial: T) {
    this.LAST_VALUE = initial;
  }

  /** Listen for changes to this shared object. */
  public subscribe(
    /** A callback for whenever this value changes. */
    subscription: Subscription<T>
  ): Unsubscriber {
    const id = this.getNextId();
    this.subscriptions.set(id, subscription);

    /** A callback to cancel this subscription. */
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

  /** Get the next ID to use (and increment) */
  private getNextId() {
    const id = this.NEXT_ID;
    this.NEXT_ID += 1;
    return id;
  }
}



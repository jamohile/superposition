/** A subscription listens for broadcasts from a subscription manager. */
export type Subscription<T> = (value: T) => void;

/** Cancels a subscription. */
export type Unsubscriber = () => void;

/** Manages a pool of subscriptions, and allows them to be notified.  */
export class SubscriptionManager<T> {
  private subscriptions = new Map<number, Subscription<T>>();

  /** Next ID to use for subscriptions. */
  private NEXT_ID = 0;

  /** Listen for changes to this shared object.
   */
  subscribe(subscription: Subscription<T>): Unsubscriber {
    const id = this.NEXT_ID;
    this.NEXT_ID += 1;

    this.subscriptions.set(id, subscription);
    return () => this.subscriptions.delete(id);
  }

  /** Broadcasts a value to all subscribers. */
  notify(value: T) {
    this.subscriptions.forEach((subscription) => subscription(value));
  }
}

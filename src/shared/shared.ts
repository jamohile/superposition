/** A subscription listens for changes to a shared object. */
export type Subscription<T> = (value: T) => void;

/** A manager is invoked by a shared object on creation,
 *  and is used to manage any necessary background work in a singleton way.
 */
export type Manager<T> = (s: Shared<T>) => void;

/**
 * Shared lets us share data between multiple contexts.
 * They can all subscribe to changes in it.
 */
export class Shared<T> {
  /** Current value of this object. */
  private value: T;

  /** Next ID to use for subscriptions. */
  private NEXT_ID = 0;

  /** Subscriptions to this object. */
  private subcriptions = new Map<number, Subscription<T>>();

  constructor(initial: T, manager?: Manager<T>) {
    this.value = initial;

    // Start the manager. It will run for whole lifetime of obj.
    if (manager) manager(this);
  }

  /** Listen for changes to this shared object.
   * @return - A callback to delete the subscription.
   */
  subscribe(subscription: Subscription<T>): () => void {
    const id = this.NEXT_ID;
    this.NEXT_ID += 1;

    this.subcriptions.set(id, subscription);
    return () => this.subcriptions.delete(id);
  }

  /** Set value of this shared object.
   */
  set(value: T) {
    this.value = value;
    this.notify();
  }

  /** Get current value of this shared object. */
  get(): T {
    return this.value;
  }

  /**
   * Update value of this shared object.
   * */
  async update(updator: (value: T) => T | Promise<T>) {
    const newVal = await updator(this.value);
    this.set(newVal);
  }

  /** Notify all subcriptions of a change. */
  notify() {
    this.subcriptions.forEach((subscription) => subscription(this.value));
  }
}

import { Subscription, Subscribable } from "../subscribable/subscribable";

/** A manager is invoked by a shared object on creation,
 *  and is used to manage any necessary background work in a singleton way.
 */
export type Manager<T> = (s: Shared<T>) => void;

/**
 * Shared lets us share data between multiple contexts.
 * They can all subscribe to changes in it.
 */

export const DEFAULT_MANAGER = () => {};
export class Shared<T> extends Subscribable<T> {
  constructor(initial: T, manager: Manager<T> = DEFAULT_MANAGER) {
    super(initial);

    // Start the manager. It will run for whole lifetime of obj.
    if (manager) manager(this);
  }

  /** Set value of this shared object.
   */
  set(value: T) {
    this.notify(value);
  }

  /**
   * Update value of this shared object.
   * */
  async update(updator: (value: T) => T | Promise<T>) {
    const newVal = await updator(this.get());
    this.set(newVal);
  }
}

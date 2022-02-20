import { Subscribable } from "./subscribable";

/**
 * SubscribableCollection wraps several Subscribables as a single combined Subscribable.
 * Whenever one of them changes, this higher level object will change.
 */
export class SubscribableCollection<
  /** Underlying subscribables, as a dictionary by name. */
  D extends Record<string, Subscribable<any>>,
  /** The actual values of the subscribables in D.
   * This information should already be incoded in D, TS doesn't expose it.*/
  V extends Record<string, any>
> extends Subscribable<V> {
  /** The underlying dependencies. */
  private subscribables: D;

  constructor(subscribables: D) {
    /** The initial value of this object is based on the initial values of all dependencies. */
    super(SubscribableCollection.getAll(subscribables));
    this.subscribables = subscribables;

    /** Subscribe to each dependency, and tie its changes to a combined subscription handler. */
    for (const source of Object.values(subscribables)) {
      source.subscribe(() => this.notify());
    }
  }

  /**
   * Combine values of all subscribables into a single object (by name).
   * Types are as above, and this method is static simply to allow use in the constructor.
   */
  static getAll<
    D extends Record<string, Subscribable<any>>,
    V extends Record<string, any>
  >(subscribables: D): V {
    const values = {} as V;

    // Go through each dependency and set value sbased on its current value.
    for (const [k, s] of Object.entries(subscribables)) {
      // @ts-ignore
      values[k] = s.get();
    }
    return values;
  }

  /** Notify subscribers of an update to dependencies. */
  protected notify() {
    /** Get combined dependency values. */
    const values = SubscribableCollection.getAll(this.subscribables) as V;
    super.notify(values);
  }
}

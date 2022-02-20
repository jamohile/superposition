import { Subscribable } from "../subscribable/subscribable";

/**
 * SharedMap is a higher-order version of shared.
 * There are many contexts when we'd like to maintain a collection of SharedObject objects,
 * But do not know how many there will be.
 *
 * For example, we may want to keep a SharedMap of ID-able objects.
 * Each of those can be individually set, listened, etc, so they are also versions of SharedObject.
 */

export abstract class SubscribableMap<
  T,
  O extends Subscribable<T>
> extends Subscribable<Record<string, O>> {
  constructor(
    /** Initialize the map based on an object. */
    initialElements: Record<string, O> = {}
  ) {
    super(initialElements);
    Object.values(initialElements).forEach((e) => this.subscribeToElement(e));
  }

  abstract makeElement(key: string): O;

  /** Access the child SharedObject object at given key.
   *  If it doesn't exist yet, it will be created (with initial) and managed.
   */
  public at(key: string): O {
    const elements = this.get();

    // Create the element if it doesn't exist.
    if (!(key in elements)) {
      const element = this.makeElement(key);
      this.subscribeToElement(element);
      elements[key] = element;
    }
    return elements[key];
  }

  private subscribeToElement(element: O) {
    return element.subscribe(() => this.notify(this.get()));
  }
}

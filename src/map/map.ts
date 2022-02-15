import { Manager, Shared } from "../shared/shared";

/**
 * SharedMap is a higher-order version of shared.
 * There are many contexts when we'd like to maintain a collection of Shared objects,
 * But do not know how many there will be.
 *
 * For example, we may want to keep a SharedMap of ID-able objects.
 * Each of those can be individually set, listened, etc, so they are also versions of Shared.
 */
export class SharedMap<T> extends Shared<Map<string, Shared<T>>> {
  private elementManager?: (key: string) => Manager<T>;

  constructor(
    /** Returns a manager for each element based on the key. */
    elementManager?: (key: string) => Manager<T>,
    /** Manages this SharedMap object. */
    manager?: Manager<Map<string, Shared<T>>>
  ) {
    super(new Map(), manager);
    this.elementManager = elementManager;
  }

  /** Access the child Shared object at given key.
   *  If it doesn't exist yet, it will be created (with initial) and managed.
   *
   */
  at(key: string, initial?: T): Shared<T> {
    const map = this.get();

    // Create the element if it doesn't exist.
    if (!map.has(key)) {
      const newElement = new Shared(
        initial as unknown as T,
        this.elementManager && this.elementManager(key)
      );
      // We'd like to be able to respond to events from this child.
      newElement.subscribe(() => this.notify());
      map.set(key, newElement);
    }
    return map.get(key) as Shared<T>;
  }
}

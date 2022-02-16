import { DEFAULT_MANAGER, Manager, SharedObject } from "../object/object";
import { Subscribable, Subscription } from "../subscribable/subscribable";

/**
 * SharedMap is a higher-order version of shared.
 * There are many contexts when we'd like to maintain a collection of SharedObject objects,
 * But do not know how many there will be.
 *
 * For example, we may want to keep a SharedMap of ID-able objects.
 * Each of those can be individually set, listened, etc, so they are also versions of SharedObject.
 */

export const DEFAULT_ELEMENT_MANAGER = (key: string) => DEFAULT_MANAGER;
export class SharedMap<T> extends SharedObject<Record<string, SharedObject<T>>> {
  private elementManager: (key: string) => Manager<T>;

  constructor(
    /** Initialize the map based on an object. */
    initialElements: Record<string, SharedObject<T>> = {},
    /** Returns a manager for each element based on the key. */
    elementManager: (key: string) => Manager<T> = DEFAULT_ELEMENT_MANAGER,
    /** Manages this SharedMap object. */
    manager: Manager<Record<string, SharedObject<T>>> = DEFAULT_MANAGER
  ) {
    super(initialElements, manager);
    Object.values(initialElements).forEach((e) => this.subscribeToElement(e));

    this.elementManager = elementManager;
  }

  /** Access the child SharedObject object at given key.
   *  If it doesn't exist yet, it will be created (with initial) and managed.
   */
  at(key: string, initial: T): SharedObject<T> {
    const elements = this.get();

    // Create the element if it doesn't exist.
    if (!(key in elements)) {
      const newElement = new SharedObject(
        initial,
        this.elementManager && this.elementManager(key)
      );
      this.subscribeToElement(newElement);
      elements[key] = newElement;
    }
    return elements[key];
  }

  private subscribeToElement(element: SharedObject<T>) {
    return element.subscribe(() => this.notify(this.get()));
  }
}

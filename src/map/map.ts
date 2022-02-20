import { DEFAULT_MANAGER, Manager, SharedObject } from "../object/object";
import { Subscribable, Subscription } from "../subscribable/subscribable";
import { SubscribableMap } from "../subscribable/subscribable-map";

/**
 * SharedMap is a higher-order version of shared.
 * There are many contexts when we'd like to maintain a collection of SharedObject objects,
 * But do not know how many there will be.
 *
 * For example, we may want to keep a SharedMap of ID-able objects.
 * Each of those can be individually set, listened, etc, so they are also versions of SharedObject.
 */

export const DEFAULT_ELEMENT_MANAGER = (key: string) => DEFAULT_MANAGER;
export class SharedMap<T> extends SubscribableMap<T, SharedObject<T>> {
  private elementManager: (key: string) => Manager<T>;
  private initialElementValue: T;

  constructor(
    /** Initialize the map based on an object. */
    initialElements: Record<string, SharedObject<T>> = {},
    /** Returns a manager for each element based on the key. */
    elementManager: (key: string) => Manager<T> = DEFAULT_ELEMENT_MANAGER,
    /** Manages this SharedMap object. */
    manager: Manager<Record<string, SharedObject<T>>> = DEFAULT_MANAGER,
    initialElementValue: T = undefined as unknown as T
  ) {
    super(initialElements);

    this.elementManager = elementManager;
    this.initialElementValue = initialElementValue;

    if (manager) manager(this);
  }

  makeElement(key: string): SharedObject<T> {
    return new SharedObject(
      this.initialElementValue,
      this.elementManager && this.elementManager(key)
    );
  }
}

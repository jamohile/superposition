import { Subscribable } from "../subscribable/subscribable";

/**
 * SubscribableMap is a higher-order version of Subscribable.
 * It allows us to maintain a keyed set of Subscribables, that can be dynamically added.
 */

export abstract class SubscribableMap<
  /** The underlying data-type that will be stored *within* each element. */
  T,
  /** The data-type *of* each element. */
  O extends Subscribable<T>
>
  /** The map is itself implemented as a subscribable. */
  extends Subscribable<Record<string, O>>
{
  constructor(
    /** Initialize the map based on an object of initial values. */
    initialElements: Record<string, O> = {}
  ) {
    super(initialElements);

    /** React to changes to these initial values. */
    Object.values(initialElements).forEach((e) => this.subscribeToElement(e));
  }

  /** When requested, make a new element to be added to the map. */
  abstract makeElement(key: string): O;

  /** Access the child SharedObject object at given key.
   *  If it doesn't exist yet, it will be created (with initial) and managed.
   */
  public at(key: string): O {
    // Create the element if it doesn't exist.
    if (!this.hasElement(key)) {
      this.addElement(key);
    }
    return this.getElement(key);
  }

  /** Add a new element to the map. */
  private addElement(key: string) {
    const element = this.makeElement(key);
    this.subscribeToElement(element);

    this.get()[key] = element;
  }

  /** Get an element from the map. */
  private getElement(key: string): O {
    return this.get()[key];
  }

  /** Whether a given key is contained in the map. */
  private hasElement(key: string): boolean {
    return key in this.get();
  }

  /** Forward changes in an underlying element to this one. */
  private subscribeToElement(element: O) {
    return element.subscribe(() => this.notify());
  }

  /** Broadcast changes to anything in this map. */
  protected notify() {
    super.notify(this.get());
  }
}

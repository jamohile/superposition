import { SharedMap } from "../map/map";
import { Shared } from "../shared/shared";
import {
  collate,
  Subscribable,
  Subscription,
} from "../subscribable/subscribable";

/** Derived maintains a list of dependencies on other Shared objects,
 *  while computing its own shared values.
 *
 * There is a bit of redundancy in these typings, since we maintain separate generics for
 * dependencies' shared and their values. Really, the values are a function of the shared.
 * But I don't believe typescript has a good way to encode that.
 */
export class Derived<
  T,
  /** Dependencies, as shared objects.*/
  D extends Record<string, Subscribable<any>>,
  /** Dependencies' values. TODO: encode this in D */
  V extends Record<string, any>
> extends Subscribable<T> {
  private dependencies: D;

  constructor(
    /* Compute updated value based on dependencies.
     */
    handler: (values: V) => T | Promise<T>,
    /** Shared objects that this object will pull data from. */
    dependencies: D,
    /** Initial value for the value. */
    initial: T
  ) {
    super(initial);
    this.dependencies = dependencies;

    collate(this.dependencies, async (dependencyValues) => {
      const derivedValue = await handler(dependencyValues as V);
      this.notify(derivedValue);
    });
  }
}

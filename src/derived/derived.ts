import { SharedMap } from "../map/map";
import { Shared, Subscription } from "../shared/shared";

/** Derived maintains a list of dependencies on other Shared objects,
 *  while computing its own shared values.
 */
export class Derived<T> {
  private dependencies: SharedMap<any>;
  private value: Shared<T>;

  constructor(
    /* Compute updated value based on dependencies.
     * It is the caller's repsonsibility to get data from those objects.
     * TODO: handle race conditions...typescript makes this hard to type.
     */
    handler: () => T | Promise<T>,
    /** Shared objects that this object will pull data from. */
    dependencies: Record<string, Shared<any>>,
    /** Initial value for the value. */
    initial: T
  ) {
    this.dependencies = new SharedMap(dependencies);
    this.value = new Shared(initial);

    this.dependencies.subscribe(async () => {
      this.value.set(await handler());
    });
  }

  subscribe(subscription: Subscription<T>) {
    return this.value.subscribe(subscription);
  }

  get() {
    return this.value.get();
  }
}

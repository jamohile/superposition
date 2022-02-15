import { Manager, Shared } from "../shared/shared";

export class SharedMap<T> extends Shared<Map<string, Shared<T>>> {
  private elementManager?: Manager<T>;

  constructor(
    elementManager?: Manager<T>,
    manager?: Manager<Map<string, Shared<T>>>
  ) {
    super(new Map(), manager);

    this.elementManager = elementManager;
  }

  at(key: string, initial?: T): Shared<T> {
    const map = this.get();

    if (!map.has(key)) {
      const newElement = new Shared(
        initial as unknown as T,
        this.elementManager
      );
      newElement.subscribe(() => this.notify());
      map.set(key, newElement);
    }
    return map.get(key) as Shared<T>;
  }
}

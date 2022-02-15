import { Manager, Shared } from "../shared/shared";

class SharedMap<T> extends Shared<Map<string, Shared<T>>> {
  private elementManager?: Manager<T>;

  constructor(
    elementManager?: Manager<T>,
    manager?: Manager<Map<string, Shared<T>>>
  ) {
    super(new Map(), manager);

    this.elementManager = elementManager;
  }

  at(key: string, initial?: T) {
    const map = this.get();

    if (!map.has(key)) {
      map.set(key, new Shared(initial as unknown as T, this.elementManager));
    }
    return map.get(key);
  }
}

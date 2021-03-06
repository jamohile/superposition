import { SharedObject } from "../shared/object/shared-object";
import { DerivedObject } from "./derived-object";

it("updates based on dependencies.", (done) => {
  const dep1 = new SharedObject(0);
  const dep2 = new SharedObject(0);

  const d = new DerivedObject(
    (deps) => {
      return deps.x * deps.y ** 2;
    },
    { x: dep1, y: dep2 },
    0
  );

  expect(d.get()).toEqual(0);

  // Set dependencies.
  dep1.set(2);
  dep2.set(5);

  // TODO: race conditions...
  setTimeout(() => {
    expect(d.get()).toBe(2 * 5 ** 2);
    done();
  }, 100);
});

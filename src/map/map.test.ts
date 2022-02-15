import { Shared } from "../shared/shared";
import { SharedMap } from "./map";

it("lets us access arbitrary elements.", () => {
  const sm = new SharedMap();

  // Get shared objects for two separate elements.
  const s1 = sm.at("0");
  const s2 = sm.at("1");

  // Make sure they are shared objects,
  // and not the same one.
  expect(s1).toBeInstanceOf(Shared);
  expect(s2).toBeInstanceOf(Shared);

  expect(s1).not.toBe(s2);
});

it("creates managers for elements it creates.", () => {
  const manager1 = jest.fn();
  const manager2 = jest.fn();

  // In addition to its own manager, maps use a higher order one.
  // The first is a normal manager, the second generates a manager per element. 
  const mapManager = jest.fn();
  const elementManager = jest.fn().mockImplementation((key) => {
    if (key === "0") return manager1;
    if (key === "1") return manager2;
  });

  const sm = new SharedMap(elementManager, mapManager);

  // Create shared objects for two separate elements.
  const s1 = sm.at("0");
  const s2 = sm.at("1");

  // The map's own manager should be called once.
  expect(mapManager).toHaveBeenCalledTimes(1);

  // The element manager should have been called twice, once per key.
  expect(elementManager).toHaveBeenCalledTimes(2);
  expect(elementManager).toHaveBeenNthCalledWith(1, "0");
  expect(elementManager).toHaveBeenNthCalledWith(2, "1");

  // Each manager should also have been called once.
  expect(manager1).toHaveBeenCalledTimes(1);
  expect(manager2).toHaveBeenCalledTimes(1);
});

it("returns the same element after multiple accesses.", () => {
  const sm = new SharedMap();

  // Get shared objects multiple times.
  const s1 = sm.at("0");
  const s2 = sm.at("0");
  const s3 = sm.at("0");

  // Should all be equal.
  expect(s2).toBe(s1);
  expect(s3).toBe(s1);
});

it("notifies subscribers when children change.", () => {
  const sm = new SharedMap<number>();

  const map_subscription = jest.fn();
  sm.subscribe(map_subscription);

  const s1 = sm.at("0");
  const s2 = sm.at("1");

  // Fire updates against children.
  s1.set(0);
  s1.set(1);

  // Make sure that the map fired two events.
  expect(map_subscription).toHaveBeenCalledTimes(2);
});

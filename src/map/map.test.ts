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

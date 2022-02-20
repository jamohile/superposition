import { SharedObject } from "./shared-object";

it("can return initial value.", () => {
  const s = new SharedObject("foo");
  expect(s.get()).toEqual("foo");
});

it("can set value.", () => {
  const s = new SharedObject("foo");
  s.set("bar");
  expect(s.get()).toEqual("bar");
});

it("notifies subscribers on change.", () => {
  const s = new SharedObject("foo");

  // Set up subscriptions.
  const sub1 = jest.fn();
  const sub2 = jest.fn();
  s.subscribe(sub1);
  s.subscribe(sub2);

  // Update value, and expect value to propagate.
  s.set("bar");
  expect(sub1).toHaveBeenCalledTimes(1);
  expect(sub2).toHaveBeenCalledTimes(1);
  expect(sub1).toHaveBeenCalledWith("bar");
  expect(sub2).toHaveBeenCalledWith("bar");
});

it("notifies subscribers multiple times.", () => {
  const s = new SharedObject("foo");

  // Set up subscription.
  const sub1 = jest.fn();
  s.subscribe(sub1);

  // Update value, and expect value to propagate.
  s.set("bar");
  s.set("bar2");
  s.set("bar3");
  s.set("bar4");

  expect(sub1).toHaveBeenCalledTimes(4);
  expect(sub1).toHaveBeenNthCalledWith(1, "bar");
  expect(sub1).toHaveBeenNthCalledWith(2, "bar2");
  expect(sub1).toHaveBeenNthCalledWith(3, "bar3");
  expect(sub1).toHaveBeenNthCalledWith(4, "bar4");
});

it("can update value.", async () => {
  const s = new SharedObject("foo");
  s.set("bar");

  // Perform an update rather than set.
  await s.update((val) => val + "123");
  expect(s.get()).toEqual("bar123");
});

it("notifies on update.", async () => {
  const s = new SharedObject("foo");
  const sub = jest.fn();

  s.subscribe(sub);

  await s.update((val) => val + "123");

  expect(sub).toHaveBeenCalledTimes(1);
  expect(sub).toHaveBeenCalledWith("foo123");
});

it("runs manager precisely once.", () => {
  const manager = jest.fn();
  const s = new SharedObject(0, manager);

  s.set(1);
  s.set(2);
  s.set(3);

  expect(manager).toHaveBeenCalledTimes(1);
});

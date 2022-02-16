# Superposition

Superposition is a state-manager designed for flexibility and simplicity.

Its purpose is to manage storing data that must be consumed across an application, and providing a set of tools to express dependencies in that data.

## Shared Objects

The basis of superposition is the `SharedObject`. We can create one out of any value as follows.

```ts
// Create a shared object with a default value of 0.
const s = new SharedObject(0);
```

Now, we can get/set this value from across the app.

```ts
s.set(1);
s.get(); // returns 1
```

So far, this isn't terribly interesting. But, that's about to change. Across the app, we can listen for changes to this object and react accordingly.

```ts
s.subscribe((value) => {
  // Do something in response to this change.
});
```

This is a bit cooler! We can now react to changes across our application. However, the real power of superposition is realized when we consider how to use its other classes.

## Derived
Often times, we'd like to compute some data based on one or more other pieces of data.

To use a contrived example, imagine we have a set of numbers X. We'd like to compute its average A.

Now, A must be recomputed whenever X is changed (reloaded, updated, etc). However, it would be wasteful to recompute it in every place it is needed. Really, we'd like to compute it only one time whenever X is changed. For this, we can use `Derived`.

```ts
const x = new SharedObject([0, 1, 2, 3]);

const avg = new Derived((vals) => {
  return sum(vals) / x.length;
}, {x});
```

There! Now we can subscribe to `avg` just like we would for `x`. Whenever `x` is changed, `avg` will be too - and its subscribers will be notified.

This lets us better separate up our dependencies, and prevent repeated work and code. A couple other notes:

- We can use an `async` function in `Derived`, and perform any arbitrary computation.

- We can have any number of dependencies in `Derived`. It will respond to any of them changing.

## DOCS ARE WIP
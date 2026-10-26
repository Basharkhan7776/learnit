// meta1.js
function createObservable(target, onChange) {
  // TODO: Return a Proxy intercepting set operations and notifying onChange
  return target;
}

test("notifies listener on property changes via Proxy", () => {
  const changes = [];
  const state = createObservable({ count: 0 }, (prop, next, prev) => {
    changes.push({ prop, next, prev });
  });

  state.count = 1;
  state.count = 5;

  expect(state.count).toBe(5);
  expect(changes).toEqual([
    { prop: "count", next: 1, prev: 0 },
    { prop: "count", next: 5, prev: 1 }
  ]);
});

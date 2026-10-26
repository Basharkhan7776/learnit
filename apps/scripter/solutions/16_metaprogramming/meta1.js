// meta1.js solution
function createObservable(target, onChange) {
  return new Proxy(target, {
    set(obj, prop, value) {
      const prev = obj[prop];
      obj[prop] = value;
      onChange(prop, value, prev);
      return true;
    }
  });
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

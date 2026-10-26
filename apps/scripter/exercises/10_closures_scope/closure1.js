// closure1.js
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    // TODO: Return cached value if args seen before, otherwise compute and cache
    return fn(...args);
  };
}

test("caches results and prevents redundant function executions", () => {
  let callCount = 0;
  const expensiveAdd = (a, b) => {
    callCount++;
    return a + b;
  };

  const memoized = memoize(expensiveAdd);

  expect(memoized(2, 3)).toBe(5);
  expect(memoized(2, 3)).toBe(5);
  expect(callCount).toBe(1); // Only called once!

  expect(memoized(4, 5)).toBe(9);
  expect(callCount).toBe(2);
});

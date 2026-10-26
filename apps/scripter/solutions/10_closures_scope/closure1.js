// closure1.js solution
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
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
  expect(callCount).toBe(1);

  expect(memoized(4, 5)).toBe(9);
  expect(callCount).toBe(2);
});

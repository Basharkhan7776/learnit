// closure2.js
function curry(fn) {
  // TODO: Return a curried version of fn
  return fn;
}

test("curries function until all arguments provided", () => {
  const sum3 = (a, b, c) => a + b + c;
  const curriedSum = curry(sum3);

  expect(curriedSum(1)(2)(3)).toBe(6);
  expect(curriedSum(1, 2)(3)).toBe(6);
  expect(curriedSum(1)(2, 3)).toBe(6);
});

// closure2.js solution
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
}

test("curries function until all arguments provided", () => {
  const sum3 = (a, b, c) => a + b + c;
  const curriedSum = curry(sum3);

  expect(curriedSum(1)(2)(3)).toBe(6);
  expect(curriedSum(1, 2)(3)).toBe(6);
  expect(curriedSum(1)(2, 3)).toBe(6);
});

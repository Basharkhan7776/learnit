// iter1.js
function* range(start, end, step = 1) {
  // TODO: Yield numbers from start to end
}

test("yields sequence of numbers in range", () => {
  const nums = [...range(0, 5)];
  expect(nums).toEqual([0, 1, 2, 3, 4]);

  const evens = [...range(2, 10, 2)];
  expect(evens).toEqual([2, 4, 6, 8]);
});

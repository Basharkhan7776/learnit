// narrow2.ts
// TODO: Define custom type predicate isError
function isError(val: unknown): val is Error {
  return false;
}

test("narrows unknown types via user-defined predicate", () => {
  const err = new TypeError("Invalid input");
  const plainObj = { message: "Something failed" };
  const str = "Just a string";

  expect(isError(err)).toBe(true);
  expect(isError(plainObj)).toBe(true);
  expect(isError(str)).toBe(false);
});

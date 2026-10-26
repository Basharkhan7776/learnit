// narrow2.ts solution
function isError(val: unknown): val is Error {
  if (val instanceof Error) return true;
  if (typeof val === 'object' && val !== null && 'message' in val) {
    return typeof (val as any).message === 'string';
  }
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

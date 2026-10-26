// types1.js solution
function getExactType(val) {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val;
}

test("accurately identifies primitive and object types", () => {
  expect(getExactType("scripter")).toBe("string");
  expect(getExactType(42)).toBe("number");
  expect(getExactType(true)).toBe("boolean");
  expect(getExactType(undefined)).toBe("undefined");
  expect(getExactType(null)).toBe("null");
  expect(getExactType([1, 2, 3])).toBe("array");
  expect(getExactType({ a: 1 })).toBe("object");
});

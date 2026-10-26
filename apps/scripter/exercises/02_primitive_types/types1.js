// types1.js
function getExactType(val) {
  // TODO: Return 'null' if val is null, 'array' if Array, else typeof val
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

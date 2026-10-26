// str1.js
function highlight(strings, ...values) {
  // TODO: Build and return string wrapping each interpolated value in <mark></mark>
  return "";
}

test("formats interpolated values with mark tags", () => {
  const user = "Alice";
  const points = 100;
  const result = highlight`User ${user} has ${points} points!`;
  expect(result).toBe("User <mark>Alice</mark> has <mark>100</mark> points!");
});

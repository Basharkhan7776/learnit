// str1.js solution
function highlight(strings, ...values) {
  let result = "";
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += `<mark>${values[i]}</mark>`;
    }
  }
  return result;
}

test("formats interpolated values with mark tags", () => {
  const user = "Alice";
  const points = 100;
  const result = highlight`User ${user} has ${points} points!`;
  expect(result).toBe("User <mark>Alice</mark> has <mark>100</mark> points!");
});

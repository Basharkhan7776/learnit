// var2.js solution
function computeScopedValues() {
  let score = 10;
  let innerScore = 0;

  if (true) {
    let score = 50; // Shadows outer score
    innerScore = score;
  }

  return { outer: score, inner: innerScore };
}

test("demonstrates block scoping and variable shadowing", () => {
  const result = computeScopedValues();
  expect(result.outer).toBe(10);
  expect(result.inner).toBe(50);
});

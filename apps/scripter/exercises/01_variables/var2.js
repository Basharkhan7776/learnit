// var2.js
function computeScopedValues() {
  let score = 10;
  let innerScore = 0;

  if (true) {
    // TODO: Shadow score inside this block by giving it value 50
    // and assign innerScore to that shadowed value.
    score = 50; 
  }

  return { outer: score, inner: innerScore };
}

test("demonstrates block scoping and variable shadowing", () => {
  const result = computeScopedValues();
  expect(result.outer).toBe(10);
  expect(result.inner).toBe(50);
});

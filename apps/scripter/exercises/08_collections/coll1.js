// coll1.js
function intersectSets(setA, setB) {
  // TODO: Return a Set with common elements
  return new Set();
}

function unionSets(setA, setB) {
  // TODO: Return a Set with union of elements
  return new Set();
}

test("computes set intersections and unions", () => {
  const a = new Set([1, 2, 3, 4]);
  const b = new Set([3, 4, 5, 6]);

  const intersection = intersectSets(a, b);
  expect([...intersection].sort()).toEqual([3, 4]);

  const union = unionSets(a, b);
  expect([...union].sort()).toEqual([1, 2, 3, 4, 5, 6]);
});

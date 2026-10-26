// coll1.js solution
function intersectSets(setA, setB) {
  return new Set([...setA].filter(x => setB.has(x)));
}

function unionSets(setA, setB) {
  return new Set([...setA, ...setB]);
}

test("computes set intersections and unions", () => {
  const a = new Set([1, 2, 3, 4]);
  const b = new Set([3, 4, 5, 6]);

  const intersection = intersectSets(a, b);
  expect([...intersection].sort()).toEqual([3, 4]);

  const union = unionSets(a, b);
  expect([...union].sort()).toEqual([1, 2, 3, 4, 5, 6]);
});

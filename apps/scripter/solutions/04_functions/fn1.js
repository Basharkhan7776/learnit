// fn1.js solution
function createPipeline(...fns) {
  return function(initialValue) {
    return fns.reduce((acc, fn) => fn(acc), initialValue);
  };
}

test("pipes value through multiple functions", () => {
  const double = x => x * 2;
  const addTen = x => x + 10;
  const square = x => x * x;

  const pipeline = createPipeline(double, addTen, square);
  expect(pipeline(5)).toBe(400);
});

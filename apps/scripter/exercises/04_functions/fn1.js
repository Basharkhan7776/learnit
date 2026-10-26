// fn1.js
function createPipeline(...fns) {
  return function(initialValue) {
    // TODO: Pipe initialValue through every function in fns
    return initialValue;
  };
}

test("pipes value through multiple functions", () => {
  const double = x => x * 2;
  const addTen = x => x + 10;
  const square = x => x * x;

  const pipeline = createPipeline(double, addTen, square);
  // (5 * 2) = 10 -> (10 + 10) = 20 -> (20 * 20) = 400
  expect(pipeline(5)).toBe(400);
});

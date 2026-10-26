// control1.js solution
function sumEvenNumbers(numbers) {
  let sum = 0;
  for (const n of numbers) {
    if (n % 2 === 0) {
      sum += n;
    }
  }
  return sum;
}

test("sums only even numbers in an array", () => {
  expect(sumEvenNumbers([1, 2, 3, 4, 5, 6])).toBe(12);
  expect(sumEvenNumbers([1, 3, 5])).toBe(0);
  expect(sumEvenNumbers([10, 20])).toBe(30);
});

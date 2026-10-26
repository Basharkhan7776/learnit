// err1.js solution
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function validateAge(age) {
  if (typeof age !== 'number' || age < 0) {
    throw new ValidationError("Age must be a positive number", "age");
  }
  return true;
}

test("throws and identifies custom ValidationError", () => {
  expect(() => validateAge(-5)).toThrow("Age must be a positive number");

  try {
    validateAge(-5);
  } catch (err) {
    expect(err instanceof ValidationError).toBe(true);
    expect(err instanceof Error).toBe(true);
    expect(err.name).toBe("ValidationError");
    expect(err.field).toBe("age");
  }
});

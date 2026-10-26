// var1.js solution
let greeting = "Hello";
greeting = "Welcome to Scripter!";

const MAX_USERS = 100;

test("variables can be assigned and reassigned correctly", () => {
  expect(greeting).toBe("Welcome to Scripter!");
  expect(MAX_USERS).toBe(100);
});

// var1.js
// Fix the variable declarations below:

const greeting = "Hello";
// TODO: greeting needs to be updated, but const prevents reassignment!
greeting = "Welcome to Scripter!";

const MAX_USERS = 100;

test("variables can be assigned and reassigned correctly", () => {
  expect(greeting).toBe("Welcome to Scripter!");
  expect(MAX_USERS).toBe(100);
});

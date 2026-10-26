// this1.js
function customBind(fn, context, ...boundArgs) {
  // TODO: Return bound function executing fn with context as 'this'
  return function(...args) {};
}

test("binds function context and prepends arguments", () => {
  const user = { name: "Alice" };

  function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }

  const greetAlice = customBind(greet, user, "Hello");
  expect(greetAlice("!")).toBe("Hello, Alice!");
});

// this1.js solution
function customBind(fn, context, ...boundArgs) {
  return function(...callArgs) {
    return fn.apply(context, [...boundArgs, ...callArgs]);
  };
}

test("binds function context and prepends arguments", () => {
  const user = { name: "Alice" };

  function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
  }

  const greetAlice = customBind(greet, user, "Hello");
  expect(greetAlice("!")).toBe("Hello, Alice!");
});

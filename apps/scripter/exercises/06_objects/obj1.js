// obj1.js
function deepFreeze(obj) {
  // TODO: Freeze obj and all its nested objects recursively
  return obj;
}

test("deeply freezes nested objects", () => {
  const config = {
    app: {
      name: "Scripter",
      meta: { version: "1.0" }
    }
  };

  deepFreeze(config);

  expect(Object.isFrozen(config)).toBe(true);
  expect(Object.isFrozen(config.app)).toBe(true);
  expect(Object.isFrozen(config.app.meta)).toBe(true);
});

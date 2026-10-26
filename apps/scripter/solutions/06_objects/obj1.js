// obj1.js solution
function deepFreeze(obj) {
  Object.freeze(obj);
  for (const val of Object.values(obj)) {
    if (val && typeof val === 'object' && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  }
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

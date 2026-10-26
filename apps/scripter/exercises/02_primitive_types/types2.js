// types2.js
function getUserSettings(config) {
  // BUG: Using || overrides valid values like 0 and false!
  const score = config.score || 100;
  const darkTheme = config.darkTheme || true;
  const username = config.username || "Guest";

  return { score, darkTheme, username };
}

test("preserves valid 0 and false values with nullish coalescing", () => {
  const result = getUserSettings({ score: 0, darkTheme: false, username: "" });
  expect(result.score).toBe(0);
  expect(result.darkTheme).toBe(false);
  expect(result.username).toBe("");
});

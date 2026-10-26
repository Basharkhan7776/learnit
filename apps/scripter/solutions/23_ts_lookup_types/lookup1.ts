// lookup1.ts solution
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

test("plucks typed property from list of objects", () => {
  const users = [
    { id: 1, name: "Alice", active: true },
    { id: 2, name: "Bob", active: false },
  ];

  const names = pluck(users, "name");
  expect(names).toEqual(["Alice", "Bob"]);

  const ids = pluck(users, "id");
  expect(ids).toEqual([1, 2]);
});

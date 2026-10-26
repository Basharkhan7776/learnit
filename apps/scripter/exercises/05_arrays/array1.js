// array1.js
function groupBy(arr, keySelector) {
  // TODO: Use arr.reduce to group items into an object of arrays
  return {};
}

test("groups items by key selector", () => {
  const users = [
    { name: "Alice", role: "admin" },
    { name: "Bob", role: "user" },
    { name: "Charlie", role: "admin" },
  ];

  const grouped = groupBy(users, u => u.role);
  expect(grouped.admin).toHaveLength(2);
  expect(grouped.user).toHaveLength(1);
  expect(grouped.admin[0].name).toBe("Alice");
});

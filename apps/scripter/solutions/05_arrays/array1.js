// array1.js solution
function groupBy(arr, keySelector) {
  return arr.reduce((acc, item) => {
    const key = keySelector(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
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

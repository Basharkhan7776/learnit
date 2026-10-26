// fn1.ts
function formatDate(timestamp: number): string;
function formatDate(date: Date): string;
function formatDate(val: number | Date): string {
  // TODO: Return val as ISO string
  return "";
}

test("handles overloaded date formats", () => {
  const d = new Date("2026-01-01T00:00:00.000Z");
  expect(formatDate(d)).toBe("2026-01-01T00:00:00.000Z");
  expect(formatDate(d.getTime())).toBe("2026-01-01T00:00:00.000Z");
});

// record_map.ts solution
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};

function recordToMap<V>(record: Record<string, V>): Map<string, V> {
  return new Map(Object.entries(record));
}

function mapToRecord<V>(map: Map<string, V>): Record<string, V> {
  return Object.fromEntries(map.entries());
}

test("converts between Record dictionary and Map", () => {
  const userScores: MyRecord<string, number> = {
    alice: 95,
    bob: 88,
    charlie: 92,
  };

  const map = recordToMap(userScores);
  expect(map instanceof Map).toBe(true);
  expect(map.get("alice")).toBe(95);
  expect(map.size).toBe(3);

  const backToRecord = mapToRecord(map);
  expect(backToRecord).toEqual(userScores);
});

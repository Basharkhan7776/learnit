// gen2.ts
interface Identifiable {
  id: string | number;
}

function mergeEntities<T extends Identifiable, U extends Identifiable>(a: T, b: U): T & U {
  // TODO: Merge and return { ...a, ...b }
  return {} as T & U;
}

class DataStore<T extends Identifiable> {
  private items = new Map<string | number, T>();

  add(item: T): void {
    // TODO: Store item by id
  }

  get(id: string | number): T | undefined {
    // TODO: Retrieve item by id
    return undefined;
  }

  get count(): number {
    return this.items.size;
  }
}

test("enforces generic constraints on objects with id", () => {
  const user = { id: 1, name: "Alice" };
  const details = { id: 1, email: "alice@example.com" };

  const merged = mergeEntities(user, details);
  expect(merged.id).toBe(1);
  expect(merged.name).toBe("Alice");
  expect(merged.email).toBe("alice@example.com");

  const store = new DataStore<typeof merged>();
  store.add(merged);
  expect(store.count).toBe(1);
  expect(store.get(1)?.name).toBe("Alice");
});

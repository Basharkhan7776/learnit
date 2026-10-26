// class1.ts
class Product {
  // TODO: Use constructor parameter properties for id (readonly), title, and price (private)
  constructor(id: string, title: string, price: number) {}

  getPrice(): number {
    return 0;
  }
}

test("instantiates class with parameter properties", () => {
  const p = new Product("prod-1", "Mechanical Keyboard", 120);
  expect(p.id).toBe("prod-1");
  expect(p.title).toBe("Mechanical Keyboard");
  expect(p.getPrice()).toBe(120);
});

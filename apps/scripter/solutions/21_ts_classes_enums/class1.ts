// class1.ts solution
class Product {
  constructor(
    public readonly id: string,
    public title: string,
    private price: number
  ) {}

  getPrice(): number {
    return this.price;
  }
}

test("instantiates class with parameter properties", () => {
  const p = new Product("prod-1", "Mechanical Keyboard", 120);
  expect(p.id).toBe("prod-1");
  expect(p.title).toBe("Mechanical Keyboard");
  expect(p.getPrice()).toBe(120);
});

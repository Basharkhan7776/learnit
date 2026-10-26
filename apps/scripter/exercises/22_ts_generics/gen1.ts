// gen1.ts
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    // TODO: Add item to stack
  }

  pop(): T | undefined {
    // TODO: Remove and return top item
    return undefined;
  }

  peek(): T | undefined {
    // TODO: Return top item without removing
    return undefined;
  }

  get size(): number {
    return this.items.length;
  }
}

test("maintains generic stack operations and LIFO order", () => {
  const numStack = new Stack<number>();
  numStack.push(10);
  numStack.push(20);

  expect(numStack.size).toBe(2);
  expect(numStack.peek()).toBe(20);
  expect(numStack.pop()).toBe(20);
  expect(numStack.pop()).toBe(10);
  expect(numStack.pop()).toBeUndefined();
});

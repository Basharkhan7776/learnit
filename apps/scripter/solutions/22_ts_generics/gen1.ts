// gen1.ts solution
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
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

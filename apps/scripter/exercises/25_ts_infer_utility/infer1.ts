// infer1.ts
// TODO: Implement UnwrapPromise<T> with infer
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;

async function fetchUserName(): Promise<string> {
  return "Alice";
}

test("unwraps promise type correctly", async () => {
  type ResultType = UnwrapPromise<ReturnType<typeof fetchUserName>>;
  const name: ResultType = await fetchUserName();
  expect(name).toBe("Alice");
});

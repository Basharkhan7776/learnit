// partial.ts solution
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

interface ServerConfig {
  host: string;
  port: number;
  timeout: number;
}

function updateEntity<T extends object>(original: T, patch: MyPartial<T>): T {
  return { ...original, ...patch };
}

test("applies partial updates to entity", () => {
  const config: ServerConfig = {
    host: "localhost",
    port: 3000,
    timeout: 5000,
  };

  const updated = updateEntity(config, { port: 8080 });
  expect(updated.port).toBe(8080);
  expect(updated.host).toBe("localhost");
  expect(updated.timeout).toBe(5000);
});

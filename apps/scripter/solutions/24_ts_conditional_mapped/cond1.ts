// cond1.ts solution
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

function freezeConfig<T extends object>(config: T): DeepReadonly<T> {
  Object.freeze(config);
  return config as DeepReadonly<T>;
}

test("freezes configuration with recursive type safety", () => {
  const config = freezeConfig({
    db: {
      host: "localhost",
      port: 5432
    }
  });

  expect(config.db.port).toBe(5432);
});

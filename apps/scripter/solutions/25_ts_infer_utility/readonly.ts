// readonly.ts solution
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface UserState {
  username: string;
  score: number;
}

function makeImmutable<T extends object>(obj: T): MyReadonly<T> {
  return Object.freeze({ ...obj }) as MyReadonly<T>;
}

test("enforces immutability via Readonly", () => {
  const state: UserState = { username: "gamer1", score: 100 };
  const locked = makeImmutable(state);

  expect(locked.username).toBe("gamer1");
  expect(locked.score).toBe(100);
  expect(Object.isFrozen(locked)).toBe(true);
});

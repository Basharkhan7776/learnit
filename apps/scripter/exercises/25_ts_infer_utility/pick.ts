// pick.ts
// TODO: Implement MyPick<T, K> from scratch
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
}

function pickProperties<T extends object, K extends keyof T>(obj: T, ...keys: K[]): MyPick<T, K> {
  // TODO: Create and return object containing only specified keys
  const result = {} as MyPick<T, K>;
  return result;
}

test("picks specific properties using custom MyPick", () => {
  const profile: UserProfile = {
    id: "usr-1",
    name: "Alex",
    email: "alex@example.com",
    age: 28,
  };

  const contactOnly = pickProperties(profile, "name", "email");
  expect(contactOnly).toEqual({ name: "Alex", email: "alex@example.com" });
  expect((contactOnly as any).age).toBeUndefined();
});

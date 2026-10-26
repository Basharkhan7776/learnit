// zod_basics.ts
import { z } from 'zod';

// TODO: Define UserSchema and infer User type
const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'user']).default('user'),
  age: z.number().int().positive().optional(),
});

type User = z.infer<typeof UserSchema>;

function validateAndCreateUser(data: unknown): User {
  // TODO: Parse and return validated user
  return UserSchema.parse(data);
}

test("validates user payload and infers static TypeScript types", () => {
  const validData = {
    id: "usr_123",
    name: "Bashar",
    email: "bashar@example.com",
    age: 25,
  };

  const user = validateAndCreateUser(validData);
  expect(user.id).toBe("usr_123");
  expect(user.role).toBe("user"); // default applied!

  // Invalid email throws validation error
  expect(() => validateAndCreateUser({
    id: "usr_123",
    name: "B",
    email: "not-an-email"
  })).toThrow();
});

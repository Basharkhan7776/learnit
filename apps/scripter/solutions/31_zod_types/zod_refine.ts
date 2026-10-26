// zod_refine.ts solution
import { z } from 'zod';

const PasswordResetSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type PasswordReset = z.infer<typeof PasswordResetSchema>;

function safeResetPassword(input: unknown) {
  const res = PasswordResetSchema.safeParse(input);
  if (res.success) {
    return { success: true, data: res.data };
  }
  return { success: false, error: res.error.issues[0]?.message || "Validation failed" };
}

test("validates cross-field constraints with Zod refine and safeParse", () => {
  const ok = safeResetPassword({
    password: "SuperSecret123!",
    confirmPassword: "SuperSecret123!",
  });
  expect(ok.success).toBe(true);

  const mismatch = safeResetPassword({
    password: "SuperSecret123!",
    confirmPassword: "DifferentPassword123!",
  });
  expect(mismatch.success).toBe(false);
  expect(mismatch.error).toBe("Passwords must match");
});

// mongoose1.ts
import mongoose from 'mongoose';

export function createUserModel() {
  const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    role: { type: String, default: "user" }
  });

  // TODO: Add pre-save hook converting email to lowercase
  // TODO: Add virtual 'isMaster' checking if role === "admin"

  return mongoose.model("User", UserSchema);
}

test("executes Mongoose hooks and virtual getters", async () => {
  const User = createUserModel();

  const user = await User.create({
    email: "JOHN.DOE@EXAMPLE.COM",
    role: "admin"
  });

  expect(user.email).toBe("john.doe@example.com");
  expect(user.isMaster).toBe(true);
});

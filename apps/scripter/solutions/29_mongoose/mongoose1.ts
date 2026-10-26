// mongoose1.ts solution
import mongoose from 'mongoose';

export function createUserModel() {
  const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    role: { type: String, default: "user" }
  });

  UserSchema.pre('save', function(next: any) {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
    if (next) next();
  });

  UserSchema.virtual('isMaster').get(function(this: any) {
    return this.role === 'admin';
  });

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

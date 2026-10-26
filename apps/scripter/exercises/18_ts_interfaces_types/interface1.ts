// interface1.ts
interface User {
  id: string;
  name: string;
}

// TODO: Create AdminUser extending User with permissions: string[]
interface AdminUser extends User {
  permissions: string[];
}

function hasPermission(admin: AdminUser, perm: string): boolean {
  // TODO: Check if admin has the requested permission
  return false;
}

test("validates user interface extension", () => {
  const admin: AdminUser = {
    id: "u1",
    name: "Bashar",
    permissions: ["READ", "WRITE", "DELETE"]
  };

  expect(hasPermission(admin, "WRITE")).toBe(true);
  expect(hasPermission(admin, "DEPLOY")).toBe(false);
});

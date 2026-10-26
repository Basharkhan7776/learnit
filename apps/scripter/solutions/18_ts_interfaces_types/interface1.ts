// interface1.ts solution
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}

function hasPermission(admin: AdminUser, perm: string): boolean {
  return admin.permissions.includes(perm);
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

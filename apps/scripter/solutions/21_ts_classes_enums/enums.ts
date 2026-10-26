// enums.ts solution
enum HttpStatus {
  OK = 'OK',
  BadRequest = 'BAD_REQUEST',
  NotFound = 'NOT_FOUND',
}

enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
}

const Roles = {
  Admin: 'ADMIN',
  User: 'USER',
} as const;

type Role = typeof Roles[keyof typeof Roles];

function isSuccess(status: HttpStatus): boolean {
  return status === HttpStatus.OK;
}

test("evaluates enums and const assertions", () => {
  expect(HttpStatus.OK).toBe("OK");
  expect(HttpStatus.NotFound).toBe("NOT_FOUND");
  expect(isSuccess(HttpStatus.OK)).toBe(true);
  expect(isSuccess(HttpStatus.BadRequest)).toBe(false);

  expect(Direction[0]).toBe("Up");
  expect(Direction.Right).toBe(3);

  expect(Roles.Admin).toBe("ADMIN");
});

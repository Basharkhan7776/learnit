// narrow1.ts
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Circle | Rectangle;

function computeArea(shape: Shape): number {
  // TODO: Use shape.kind to calculate and return exact area
  return 0;
}

test("computes area with discriminated union narrowing", () => {
  const circle: Shape = { kind: 'circle', radius: 10 };
  const rect: Shape = { kind: 'rectangle', width: 5, height: 4 };

  expect(Math.round(computeArea(circle))).toBe(314);
  expect(computeArea(rect)).toBe(20);
});

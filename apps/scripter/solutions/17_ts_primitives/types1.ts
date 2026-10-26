// types1.ts solution
type Coordinate = [number, number];

function formatCoordinate(coord: Coordinate): string {
  return `Lat: ${coord[0]}, Lng: ${coord[1]}`;
}

test("formats typed 2D coordinates", () => {
  const tokyo: Coordinate = [35.6762, 139.6503];
  expect(formatCoordinate(tokyo)).toBe("Lat: 35.6762, Lng: 139.6503");
});

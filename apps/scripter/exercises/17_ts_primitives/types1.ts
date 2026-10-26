// types1.ts
// TODO: Define Coordinate as a tuple [latitude: number, longitude: number]
type Coordinate = [number, number];

function formatCoordinate(coord: Coordinate): string {
  // TODO: Return "Lat: X, Lng: Y"
  return "";
}

test("formats typed 2D coordinates", () => {
  const tokyo: Coordinate = [35.6762, 139.6503];
  expect(formatCoordinate(tokyo)).toBe("Lat: 35.6762, Lng: 139.6503");
});

// exclude.ts solution
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;

type EventType = 'click' | 'hover' | 'scroll' | 'keydown' | 'keyup';
type MouseEvent = MyExtract<EventType, 'click' | 'hover' | 'scroll'>;
type NonScrollEvent = MyExclude<EventType, 'scroll'>;

function isMouseEvent(ev: string): boolean {
  return ev === 'click' || ev === 'hover';
}

test("distributes over unions with Exclude and Extract", () => {
  expect(isMouseEvent("click")).toBe(true);
  expect(isMouseEvent("keydown")).toBe(false);

  type NullableString = string | null | undefined;
  type NonNullString = MyExclude<NullableString, null | undefined>;
  const val: NonNullString = "hello";
  expect(typeof val).toBe("string");
});

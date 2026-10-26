// eventloop1.js
function debounce(fn, delay) {
  let timerId = null;

  function debounced(...args) {
    // TODO: Reset timer and schedule fn call
  }

  debounced.cancel = function() {
    // TODO: Clear active timer
  };

  return debounced;
}

test("debounces calls and allows cancellation", async () => {
  let counter = 0;
  const inc = () => counter++;
  const debouncedInc = debounce(inc, 50);

  debouncedInc();
  debouncedInc();
  debouncedInc();

  // Active timer will be cancelled
  debouncedInc.cancel();

  await new Promise(r => setTimeout(r, 60));
  expect(counter).toBe(0); // cancelled, never ran
});

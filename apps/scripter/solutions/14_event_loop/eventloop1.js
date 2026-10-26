// eventloop1.js solution
function debounce(fn, delay) {
  let timerId = null;

  function debounced(...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  }

  debounced.cancel = function() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
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

  debouncedInc.cancel();

  await new Promise(r => setTimeout(r, 60));
  expect(counter).toBe(0);
});

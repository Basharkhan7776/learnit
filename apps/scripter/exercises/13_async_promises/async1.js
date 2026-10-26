// async1.js
async function retryAsync(fn, maxRetries = 3) {
  // TODO: Retry calling fn up to maxRetries times on failure
  return await fn();
}

test("retries failing operations until success", async () => {
  let attempts = 0;
  const unstableTask = async () => {
    attempts++;
    if (attempts < 3) throw new Error("Temporary network glitch");
    return "SUCCESS";
  };

  const result = await retryAsync(unstableTask, 4);
  expect(result).toBe("SUCCESS");
  expect(attempts).toBe(3);
});

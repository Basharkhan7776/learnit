// async1.js solution
async function retryAsync(fn, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
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

// async2.js solution
function safeAllSettled(promises) {
  return Promise.all(
    promises.map(p =>
      Promise.resolve(p).then(
        value => ({ status: 'fulfilled', value }),
        reason => ({ status: 'rejected', reason })
      )
    )
  );
}

test("settles all promises without aborting on failure", async () => {
  const p1 = Promise.resolve(42);
  const p2 = Promise.reject(new Error("Fail"));
  const p3 = Promise.resolve("Scripter");

  const results = await safeAllSettled([p1, p2, p3]);

  expect(results[0]).toEqual({ status: "fulfilled", value: 42 });
  expect(results[1].status).toBe("rejected");
  expect(results[1].reason.message).toBe("Fail");
  expect(results[2]).toEqual({ status: "fulfilled", value: "Scripter" });
});

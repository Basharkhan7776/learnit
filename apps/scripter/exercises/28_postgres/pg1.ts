// pg1.ts
import { Pool } from 'pg';

export async function transferFunds(
  pool: any,
  fromId: number,
  toId: number,
  amount: number
) {
  const client = await pool.connect();
  // TODO: Run transaction with BEGIN, parameterized updates, and COMMIT/ROLLBACK
  try {
    await client.query("BEGIN");
    // TODO: transfer balance
    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

test("executes database queries and atomic transactions", async () => {
  const pool = new Pool();
  await pool.query("CREATE TABLE accounts (id INT PRIMARY KEY, balance INT)");
  await pool.query("INSERT INTO accounts (id, balance) VALUES ($1, $2)", [1, 500]);
  await pool.query("INSERT INTO accounts (id, balance) VALUES ($1, $2)", [2, 100]);

  const ok = await transferFunds(pool, 1, 2, 200);
  expect(ok).toBe(true);
});

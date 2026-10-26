// proto1.js
class BankAccount {
  #balance = 0;

  constructor(initialBalance = 0) {
    this.#balance = initialBalance;
  }

  get balance() {
    return this.#balance;
  }

  deposit(amount) {
    this.#balance += amount;
  }
}

// TODO: Create SavingsAccount extending BankAccount
class SavingsAccount extends BankAccount {
  applyInterest(rate) {
    // TODO: Add interest to balance (interest = this.balance * rate)
  }
}

test("implements class inheritance and methods", () => {
  const account = new SavingsAccount(100);
  account.deposit(50);
  expect(account.balance).toBe(150);

  account.applyInterest(0.1); // 10% on 150 = 15 -> 165
  expect(account.balance).toBe(165);
});

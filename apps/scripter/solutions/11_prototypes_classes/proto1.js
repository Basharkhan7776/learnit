// proto1.js solution
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

class SavingsAccount extends BankAccount {
  applyInterest(rate) {
    this.deposit(this.balance * rate);
  }
}

test("implements class inheritance and methods", () => {
  const account = new SavingsAccount(100);
  account.deposit(50);
  expect(account.balance).toBe(150);

  account.applyInterest(0.1);
  expect(account.balance).toBe(165);
});

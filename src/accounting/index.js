const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')({ sigint: true });

const BALANCE_FILE = path.join(__dirname, 'balance.json');
const INITIAL_BALANCE = 1000.0;

function ensureBalanceStore() {
  if (!fs.existsSync(BALANCE_FILE)) {
    fs.writeFileSync(BALANCE_FILE, JSON.stringify({ balance: INITIAL_BALANCE }, null, 2));
  }
}

function readBalance() {
  ensureBalanceStore();
  const data = fs.readFileSync(BALANCE_FILE, 'utf8');
  const parsed = JSON.parse(data);
  return Number(parsed.balance);
}

function writeBalance(value) {
  fs.writeFileSync(BALANCE_FILE, JSON.stringify({ balance: Number(value).toFixed(2) }, null, 2));
}

function displayBalance() {
  const balance = readBalance();
  console.log(`\nCurrent balance: ${balance.toFixed(2)}\n`);
}

function creditAccount(prompt) {
  const raw = prompt('Enter credit amount: ');
  const amount = Number(raw);
  if (Number.isNaN(amount) || amount <= 0) {
    console.log('Invalid amount. Please enter a positive number.');
    return;
  }

  const current = readBalance();
  const updated = current + amount;
  writeBalance(updated);
  console.log(`Amount credited. New balance: ${updated.toFixed(2)}\n`);
}

function debitAccount(prompt) {
  const raw = prompt('Enter debit amount: ');
  const amount = Number(raw);
  if (Number.isNaN(amount) || amount <= 0) {
    console.log('Invalid amount. Please enter a positive number.');
    return;
  }

  const current = readBalance();
  if (current >= amount) {
    const updated = current - amount;
    writeBalance(updated);
    console.log(`Amount debited. New balance: ${updated.toFixed(2)}\n`);
  } else {
    console.log('Insufficient funds for this debit.');
  }
}

function main() {
  console.log('Account Management System (Node.js)');

  const prompt = require('prompt-sync')({ sigint: true });

  let keepRunning = true;
  while (keepRunning) {
    console.log('--------------------------------');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');

    const choice = prompt('Enter your choice (1-4): ');

    switch (choice.trim()) {
      case '1':
        displayBalance();
        break;
      case '2':
        creditAccount(prompt);
        break;
      case '3':
        debitAccount(prompt);
        break;
      case '4':
        keepRunning = false;
        console.log('\nExiting the program. Goodbye!');
        break;
      default:
        console.log('Invalid choice, please select 1-4.\n');
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  ensureBalanceStore,
  readBalance,
  writeBalance,
  displayBalance,
  creditAccount,
  debitAccount
};

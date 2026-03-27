const fs = require('fs');
const path = require('path');
const { ensureBalanceStore, readBalance, writeBalance, displayBalance, creditAccount, debitAccount } = require('./index');

const BALANCE_FILE = path.join(__dirname, 'balance.json');

// Mock fs
jest.mock('fs');

const mockPrompt = jest.fn();

describe('Account Management System Tests', () => {
  beforeEach(() => {
    // Reset mocks
    mockPrompt.mockReset();
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReset();
    fs.writeFileSync.mockReset();
  });

  afterEach(() => {
    // Clean up
    if (fs.existsSync(BALANCE_FILE)) {
      fs.unlinkSync(BALANCE_FILE);
    }
  });

  test('TC001: View Initial Balance', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.readFileSync.mockReturnValue(JSON.stringify({ balance: '1000.00' }));

    displayBalance();

    expect(consoleSpy).toHaveBeenCalledWith('\nCurrent balance: 1000.00\n');
    consoleSpy.mockRestore();
  });

  test('TC002: Credit Account', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.readFileSync.mockReturnValue(JSON.stringify({ balance: '1000.00' }));
    mockPrompt.mockReturnValue('50.00');

    creditAccount(mockPrompt);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      BALANCE_FILE,
      JSON.stringify({ balance: '1050.00' }, null, 2)
    );
    expect(consoleSpy).toHaveBeenCalledWith('Amount credited. New balance: 1050.00\n');
    consoleSpy.mockRestore();
  });

  test('TC003: Debit Account with Sufficient Funds', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.readFileSync.mockReturnValue(JSON.stringify({ balance: '1050.00' }));
    mockPrompt.mockReturnValue('25.00');

    debitAccount(mockPrompt);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      BALANCE_FILE,
      JSON.stringify({ balance: '1025.00' }, null, 2)
    );
    expect(consoleSpy).toHaveBeenCalledWith('Amount debited. New balance: 1025.00\n');
    consoleSpy.mockRestore();
  });

  test('TC004: Debit Account with Insufficient Funds', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.readFileSync.mockReturnValue(JSON.stringify({ balance: '1025.00' }));
    mockPrompt.mockReturnValue('2000.00');

    debitAccount(mockPrompt);

    expect(fs.writeFileSync).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Insufficient funds for this debit.');
    consoleSpy.mockRestore();
  });

  test('TC005: Multiple Operations Persistence', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    let balance = '1025.00';

    // View balance
    fs.readFileSync.mockReturnValue(JSON.stringify({ balance }));
    displayBalance();
    expect(consoleSpy).toHaveBeenCalledWith('\nCurrent balance: 1025.00\n');

    // Credit 100.00
    mockPrompt.mockReturnValue('100.00');
    fs.readFileSync.mockReturnValue(JSON.stringify({ balance }));
    creditAccount(mockPrompt);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      BALANCE_FILE,
      JSON.stringify({ balance: '1125.00' }, null, 2)
    );

    // View balance
    balance = '1125.00';
    fs.readFileSync.mockReturnValue(JSON.stringify({ balance }));
    displayBalance();
    expect(consoleSpy).toHaveBeenCalledWith('\nCurrent balance: 1125.00\n');

    // Debit 50.00
    mockPrompt.mockReturnValue('50.00');
    fs.readFileSync.mockReturnValue(JSON.stringify({ balance }));
    debitAccount(mockPrompt);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      BALANCE_FILE,
      JSON.stringify({ balance: '1075.00' }, null, 2)
    );

    // View balance
    balance = '1075.00';
    fs.readFileSync.mockReturnValue(JSON.stringify({ balance }));
    displayBalance();
    expect(consoleSpy).toHaveBeenCalledWith('\nCurrent balance: 1075.00\n');

    consoleSpy.mockRestore();
  });

  test('Invalid credit amount', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.readFileSync.mockReturnValue(JSON.stringify({ balance: '1000.00' }));
    mockPrompt.mockReturnValue('invalid');

    creditAccount(mockPrompt);

    expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('Invalid debit amount', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fs.readFileSync.mockReturnValue(JSON.stringify({ balance: '1000.00' }));
    mockPrompt.mockReturnValue('-10');

    debitAccount(mockPrompt);

    expect(consoleSpy).toHaveBeenCalledWith('Invalid amount. Please enter a positive number.');
    expect(fs.writeFileSync).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
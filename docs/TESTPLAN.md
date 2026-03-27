# Test Plan for COBOL Account Management System

This test plan covers the business logic of the COBOL application for managing student account balances. It includes test cases for viewing balance, crediting, and debiting accounts, including validation for insufficient funds. The plan is designed to validate functionality before and during transformation to a Node.js application.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|--------------|-----------------------|----------------|------------|----------------|---------------|--------|----------|
| TC001 | View Initial Balance | Application is compiled and running. Initial balance is 1000.00. | 1. Start the application.<br>2. Select option 1 (View Balance). | Displays "Current balance: 001000.00" |  |  |  |
| TC002 | Credit Account | Application is running. Current balance is 1000.00. | 1. Select option 2 (Credit Account).<br>2. Enter credit amount: 50.00 | Displays "Amount credited. New balance: 001050.00" |  |  |  |
| TC003 | Debit Account with Sufficient Funds | Application is running. Current balance is 1050.00 (after TC002). | 1. Select option 3 (Debit Account).<br>2. Enter debit amount: 25.00 | Displays "Amount debited. New balance: 001025.00" |  |  |  |
| TC004 | Debit Account with Insufficient Funds | Application is running. Current balance is 1025.00 (after TC003). | 1. Select option 3 (Debit Account).<br>2. Enter debit amount: 2000.00 | Displays "Insufficient funds for this debit." Balance remains 001025.00 |  |  |  |
| TC005 | Multiple Operations Persistence | Application is running. Perform sequence of operations. | 1. View balance (should be 1025.00).<br>2. Credit 100.00.<br>3. View balance (should be 1125.00).<br>4. Debit 50.00.<br>5. View balance (should be 1075.00). | Balances update correctly after each operation. |  |  | Ensures data persistence across operations. |
| TC006 | Exit Application | Application is running. | 1. Select option 4 (Exit). | Displays "Exiting the program. Goodbye!" and terminates. |  |  |  |
| TC007 | Invalid Menu Choice | Application is running. | 1. Enter invalid choice (e.g., 5). | Displays "Invalid choice, please select 1-4." and redisplays menu. |  |  |  |
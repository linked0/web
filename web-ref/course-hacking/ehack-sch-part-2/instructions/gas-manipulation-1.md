# Gas Manipulation Exercise 1

## Intro

In this exercise we examine a special type of exchange that uses two-step order execution to avoid front-running exploits.

However, the two-step execution approach leaves the exchange vulnerable! 

## Tasks

### Task 1
Implement and deploy your `AttackContract` that will be used to exploit the exchange.

### Task 2
Create a malicious order on the Exchange.

### Task 3
Execute the exploit on the two-step exchange with your malicious order!

### Task 4
Bonus challenge: Can you find a way to pull off the same gas griefing attack when the `CALLBACK_GAS_LIMIT` is only `100,000`?

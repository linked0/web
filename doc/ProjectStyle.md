# Project Style

This document defines the naming rules for files, variables, etc. It also includes the principles related to all aspects of projects.

## Coding Style

### String Quoting

In our project, we use **template literals (backticks \`\`)** when string interpolation (using `${}`) or multi-line strings are needed.

**Example**:  
```javascript
const name = 'John';
const age = 30;
const greeting = `Hello, my name is ${name} and I am ${age} years old.`;  // String interpolation
const message = `
  Hello, ${name}.
  Welcome to our website!
`;  // Multi-line string
```

For simple, static strings, we prefer single quotes (') as they are cleaner and avoid escaping double quotes.

**Example**:
```javascript
const greeting = 'Hello, World!';
const name = 'John';

const quote = "It's a great day!";  // Contains single quotes
const jsonString = "{\"name\": \"John\", \"age\": 30}"; // JSON-style string using double quotes
```

Double quotes (") are used only when the string contains single quotes (to avoid escaping) or when working with JSON or HTML attributes, which conventionally use double quotes.

**Example**:
```javascript
const quote = "It's a great day!";  // Contains single quotes
const jsonString = "{\"name\": \"John\", \"age\": 30}"; // JSON-style string using double quotes
```

Consistency is key, so we aim to follow these conventions throughout the codebase: use template literals where applicable, prefer single quotes for simple strings, and use double quotes only when necessary.


### Solidity lint in VS Code

- Install plugins
  ```
  - Search for "Solidity" and install:
    Solidity by Juan Blanco
  - Search for "Prettier" and install:
    Prettier - Code formatter
  ```
- Open VS Code settings (Ctrl+Shift+P → "Preferences: Open Settings (JSON)")
- Add
   ```
    "[solidity]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode",
      "editor.formatOnSave": true,
      "editor.tabSize": 2,
      "editor.insertSpaces": true
    },
    "solidity.formatter": "prettier"

   ```
- Restart VS Code

### Column Limit

As of their latest coding standards, OpenZeppelin typically follows a **100-character limit per line** for Solidity code.
So, we use a **100-character limit per line**.

### File Name

- Solidity: PascalCase (or UpperCamelCase) naming convention
  - BaseAccount.sol
  - JaySmartAccount.sol
- TypeScript: Kebab-case naming convention, all letters are typically lowercase and words are separated by hyphens.
  - deploy-contract.ts
  - check-receiver.ts

## Project Policy
### Folder Structure 
We follow the contract development structure used in the Ondo Finance project. Our contracts are organized into separate folders rather than having a single main contract file in the root directory.

Maintaining multiple repositories for different types of contracts can be cumbersome. Instead, we keep all contracts in one repository and categorize them into subfolders as follows:

```
contracts
├── external
└── lending
```
### Solidity dependencies

- The OpenZeppelin library code is included in the files to prevent unexpected version conflicts
  
  > OpenZeppelin is a well-known library in the Ethereum and Solidity ecosystem, providing secure, reusable smart contract templates for ERC-20, ERC-721, access control, upgradability, and more.
  
  > Including the library code directly in project files instead of relying on external dependencies is a common practice in Solidity development due to:

  > - Version Conflicts – Different package versions may cause unexpected issues if OpenZeppelin updates its API.
  > - Security & Auditing – Keeping a stable version ensures that no unintended updates affect security.
  > - Deployment Consistency – If a smart contract is audited with a specific version, keeping the exact code prevents changes in later deployments.
  
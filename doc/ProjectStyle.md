# Project Style
This document defines the naming rules for files, variables, etc. It also includes the principles related to all aspects of projects.

## Coding Style
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

### File Name
- Solidity: PascalCase (or UpperCamelCase) naming convention
  - BaseAccount.sol
  - JaySmartAccount.sol
- TypeScript: Kebab-case naming convention, all letters are typically lowercase and words are separated by hyphens.
  - deploy-contract.ts
  - check-receiver.ts

## Project Policy
### Solidity dependencies
- The OpenZeppelin library code is included in the files to prevent unexpected version conflicts
  
  > OpenZeppelin is a well-known library in the Ethereum and Solidity ecosystem, providing secure, reusable smart contract templates for ERC-20, ERC-721, access control, upgradability, and more.
  
  > Including the library code directly in project files instead of relying on external dependencies is a common practice in Solidity development due to:

  > - Version Conflicts – Different package versions may cause unexpected issues if OpenZeppelin updates its API.
  > - Security & Auditing – Keeping a stable version ensures that no unintended updates affect security.
  > - Deployment Consistency – If a smart contract is audited with a specific version, keeping the exact code prevents changes in later deployments.
  
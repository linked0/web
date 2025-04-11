import { ethers } from 'hardhat';

import { JaySmartAccount } from '../../typechain-types'; 

async function main() {
  const jsaAddress = process.env.JAY_SMART_ACCOUNT_CONTRACT;
  if (!jsaAddress) {
    throw new Error("JAY_SMART_ACCOUNT_CONTRACT environment variable not set.");
  }

  const JSAFactory = await ethers.getContractFactory('JaySmartAccount');
  const jaySmartAccount = JSAFactory.attach(jsaAddress) as JaySmartAccount;

  // Call the getStore function on the deployed contract
  const result = await jaySmartAccount.getStore();
  console.log(`getStore: ${result}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }
);

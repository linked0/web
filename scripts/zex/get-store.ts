import { ethers } from 'hardhat';

import { JaySmartAccount } from '../../typechain-types'; 

async function main() {
    const [deployer, user] = await ethers.getSigners();
  
    const proxyAddress = process.env.JSA_PROXY_CONTRACT;
    if (!proxyAddress) {
      throw new Error("✋ Missing JSA_PROXY_CONTRACT in your .env");
    }
  
    const accountUser = await ethers.getContractAt(
      "JaySmartAccount",      // name of your logic contract
      proxyAddress,           // proxy’s address
      user                    // signer
    );
  
    // Call the getStore function on the deployed contract
    const result = await accountUser.getStore();
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

import { ethers } from "hardhat";

async function main() {
  // Replace this with your deployed contract's address
  const diamondAddress: string = "0x7469843a2b39e0De83B7e6b78134D6725AB2E49B";

  // Attach to the deployed contract
  const diamond = await await ethers.getContractAt(
    "contracts/diamond/Diamond.sol:Diamond",
    diamondAddress);

  // Call the `DIAMOND_NAME` variable
  const name = await diamond.name();
  console.log("Diamond name:", name);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
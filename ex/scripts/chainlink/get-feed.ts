import { ethers } from "hardhat";

async function main() {
  // get chain id from current network
  const chainId = await ethers.provider
    .getNetwork()
    .then((network) => network.chainId);
  let feedAddress = "";

  if (chainId === 11155111) {
    console.log("FEED_ADDRESS:", process.env.SEPOLIA_FEED_ADDRESS);
    feedAddress = process.env.SEPOLIA_FEED_ADDRESS ?? "";
  } else {
    console.log(
      "Chain ID is not 11155111. Please run this script on a hardhat network."
    );
    process.exit(1);
  }

  // Deploy the PriceFeed contract
  const PriceFeed = await ethers.getContractFactory("PriceFeed");
  const priceFeed = await PriceFeed.deploy(feedAddress);
  console.log("PriceFeed deployed to:", priceFeed.address);

  await priceFeed.deployed();
  console.log("getEthUsdPrice:", await priceFeed.getEthUsdPrice());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

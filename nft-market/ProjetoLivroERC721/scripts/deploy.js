const { ethers } = require("hardhat");

async function main() {

  const SplashWorld = await ethers.getContractFactory("Splash");
  const splashWorld = await SplashWorld.deploy("SplashWorldJT", "SPWD");
  await splashWorld.deployed();
  console.log("Success! Contract was deployed to: ", splashWorld.address);
  await splashWorld.mint("https://ipfs.io/ipfs/QmXeKHxP9C6Er3pSUGRoErU2dSTZxXRcBeaRP5NWYbk9Pa")
  console.log("NFT successfully minted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});

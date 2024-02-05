import { ethers } from "hardhat";

async function main() {
    const create2Factory = await ethers.getContractAt("Create2Factory", process.env.CREATE2FACTORY_ADDRESS);
    // print transaction of factory deployment
    console.log("Create2Factory deployed to:", create2Factory.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
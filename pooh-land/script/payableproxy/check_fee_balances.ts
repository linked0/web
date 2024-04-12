import { ethers } from "hardhat";
const { orderType } = require("../../eip-712-types/order");

const { parseEther, keccak256 } = ethers.utils;
const provider = ethers.provider;

async function main() {
    const WBOAFactory = await ethers.getContractFactory("WETH");

    const provider = ethers.provider;
    const proxyAddress = process.env.PAYABLE_PROXY_ADDRESS;
    const feeWithdrawAddress = process.env.FEE_WITHDRAW_ADDRESS;
    const wboaContract = await WBOAFactory.attach(process.env.WBOA_ADDRESS);

    console.log("====== PayableProxy Balances (%s)", proxyAddress);
    console.log("BOA\t:", (await provider.getBalance(proxyAddress)).toString());
    console.log("WBOA\t:", (await wboaContract.balanceOf(proxyAddress)).toString());

    console.log("====== Fee Withdraw Address Balances (%s)", feeWithdrawAddress);
    console.log("BOA\t:", (await provider.getBalance(feeWithdrawAddress)).toString());
    console.log("WBOA\t:", (await wboaContract.balanceOf(feeWithdrawAddress)).toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

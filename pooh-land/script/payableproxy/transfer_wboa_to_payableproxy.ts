import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../../utils/GasPriceManager";

async function main() {
    const provider = ethers.provider;
    const testUser = new Wallet(process.env.FEE_TEST_TRANSFER_KEY || "");
    const testUserSigner = new NonceManager(new GasPriceManager(provider.getSigner(testUser.address)));
    const proxyAddress = process.env.PAYABLE_PROXY_ADDRESS || "";

    const WBOAFactory = await ethers.getContractFactory("WETH");
    const wboaContract = await WBOAFactory.attach(process.env.WBOA_ADDRESS || "");

    // send WBOA from testUser to PayableProxy
    const amount = "100";
    await wboaContract
        .connect(testUserSigner)
        .transferFrom(testUser.address, proxyAddress, ethers.utils.parseEther(amount));

    console.log("%s WBOAs transferred to PayableProxy(%s)", amount, proxyAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

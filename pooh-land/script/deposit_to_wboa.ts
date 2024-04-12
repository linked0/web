import { NonceManager } from "@ethersproject/experimental";
import { BigNumber, Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../utils/GasPriceManager";
import { WETH } from "../typechain-types";
import { delay } from "@nomiclabs/hardhat-etherscan/dist/src/etherscan/EtherscanService";

async function main() {
    const WBOAFactory = await ethers.getContractFactory("WETH");
    const provider = ethers.provider;

    const depositer = new Wallet(process.env.WBOA_DEPOSITER || "");
    const depositAmount = ethers.utils.parseEther(process.env.WBOA_DEPOSIT_AMOUNT || "0");
    const depositSigner = new NonceManager(new GasPriceManager(provider.getSigner(depositer.address)));

    const wboaToken = await WBOAFactory.attach(process.env.WBOA_ADDRESS);
    await wboaToken.connect(depositSigner).deposit({ value: depositAmount });

    console.log("%d BOAs of %s deposited", depositAmount, depositer.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

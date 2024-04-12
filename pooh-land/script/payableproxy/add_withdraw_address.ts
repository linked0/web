import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../../utils/GasPriceManager";

async function main() {
    const provider = ethers.provider;
    const feeOwner = new Wallet(process.env.FEE_COLLECTOR_OWNER_KEY || "");
    const feeOwnerSigner = new NonceManager(new GasPriceManager(provider.getSigner(feeOwner.address)));
    const feeWithdrawAddress = process.env.FEE_WITHDRAW_ADDRESS;

    const ProxyFactory = await ethers.getContractFactory("PayableProxy");
    const proxyContract = await ProxyFactory.attach(process.env.PAYABLE_PROXY_ADDRESS);

    const CollectorFactory = await ethers.getContractFactory("BoaFeeCollector");
    const collectorContract = await CollectorFactory.attach(process.env.FEE_COLLECTOR_ADDRESS);

    // add wallet to withdraw the accumulated fees
    const encodedData = collectorContract.interface.encodeFunctionData("addWithdrawAddress", [feeWithdrawAddress]);
    await feeOwnerSigner.sendTransaction({
        to: proxyContract.address,
        data: encodedData,
    });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

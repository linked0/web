import { NonceManager } from "@ethersproject/experimental";
import { Wallet } from "ethers";
import { ethers } from "hardhat";
import { GasPriceManager } from "../../utils/GasPriceManager";

async function main() {
    const provider = ethers.provider;
    const feeOwner = new Wallet(process.env.FEE_COLLECTOR_OWNER_KEY || "");
    const feeOwnerSigner = new NonceManager(new GasPriceManager(provider.getSigner(feeOwner.address)));
    const feeWithdrawAddress = process.env.FEE_WITHDRAW_ADDRESS || "";

    const wboaFactory = await ethers.getContractFactory("WETH");
    const wboaContractAddress = process.env.WBOA_ADDRESS || "";

    const proxyContractAddress = process.env.PAYABLE_PROXY_ADDRESS || "";

    const CollectorFactory = await ethers.getContractFactory("BoaFeeCollector");
    const collectorContract = await CollectorFactory.attach(process.env.FEE_COLLECTOR_ADDRESS || "");

    // withdraw fees to the designated address
    const amount = "10";
    const encodedData = collectorContract.interface.encodeFunctionData("unwrapAndWithdraw", [
        feeWithdrawAddress,
        wboaContractAddress,
        ethers.utils.parseEther(amount),
    ]);
    await feeOwnerSigner.sendTransaction({
        to: proxyContractAddress,
        data: encodedData,
    });

    console.log("%s WBOAs unwrapped and transferred to the withdraw address(%s)", amount, feeWithdrawAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

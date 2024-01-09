import {NonceManager} from "@ethersproject/experimental";
import {Wallet} from "ethers";
import {ethers} from "hardhat";
import {GasPriceManager} from "../utils/GasPriceManager";

async function main() {
    const commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");
    const voteraVoteFactory = await ethers.getContractFactory("VoteraVote");

    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const commonsBudget = await commonsBudgetFactory.attach(process.env.COMMONS_BUDGET_CONTRACT || "");

    const voteManager = new Wallet(process.env.VOTE_KEY || "");
    const voteManagerSigner = new NonceManager(new GasPriceManager(provider.getSigner(voteManager.address)));
    const voteraVote = await voteraVoteFactory.attach(process.env.VOTERA_VOTE_CONTRACT || "");

    await commonsBudget.connect(adminSigner).changeVoteParam(voteManager.address, voteraVote.address);
    await voteraVote.connect(voteManagerSigner).changeCommonBudgetContract(commonsBudget.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

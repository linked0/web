import {NonceManager} from "@ethersproject/experimental";
import {Wallet} from "ethers";
import {ethers} from "hardhat";
import {GasPriceManager} from "../utils/GasPriceManager";

async function main() {
    const commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");
    const voteraVoteFactory = await ethers.getContractFactory("VoteraVote");

    const provider = ethers.provider;

    const voteManager = new Wallet(process.env.VOTE_KEY || "");
    const voteManagerSigner = new NonceManager(new GasPriceManager(provider.getSigner(voteManager.address)));
    const voteraVote = await voteraVoteFactory.connect(voteManagerSigner).deploy();
    await voteraVote.deployed();

    console.log("voteraVote - deployed to:", voteraVote.address);
    if (!process.env.VOTE_KEY) {
        console.log("voteraVote.manager - privateKey:", voteManager.privateKey);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

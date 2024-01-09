import chai, { expect } from "chai";
import crypto from "crypto";
import { solidity } from "ethereum-waffle";
import { BigNumber, BigNumberish, BytesLike, utils, Wallet } from "ethers";
import { ethers, network, waffle } from "hardhat";
import {
    CommonsBudget,
    CommonsBudget__factory as CommonsBudgetFactory,
    CommonsStorage,
    CommonsStorage__factory as CommonsStorageFactory,
    VoteraVote,
    VoteraVote__factory as VoteraVoteFactory,
} from "../typechain-types";
import {
    assessProposal,
    countVoteResult,
    createFundProposal,
    createSystemProposal,
    makeCommitment,
    processVote,
    setEnvironment,
} from "./VoteHelper";

import * as assert from "assert";

const AddressZero = "0x0000000000000000000000000000000000000000";
const InvalidProposal = "0x43d26d775ef3a282483394ce041a2757fbf700c9cf86accc6f0ce410accf123f";
const DocHash = "0x9f18669085971c1306dd0096ec531e71ad2732fd0e783068f2a3aba628613231";

chai.use(solidity);

function toSystemInput(title: string, start: number, end: number, docHash: BytesLike) {
    return { start, end, startAssess: 0, endAssess: 0, docHash, amount: 0, title };
}

function toFundInput(
    title: string,
    start: number,
    end: number,
    startAssess: number,
    endAssess: number,
    docHash: BytesLike,
    amount: BigNumberish
) {
    return { start, end, startAssess, endAssess, docHash, amount, title };
}

function getNewProposal() {
    for (;;) {
        const proposal = `0x${crypto.randomBytes(32).toString("hex")}`;
        if (proposal !== InvalidProposal) {
            return proposal;
        }
    }
}

describe("Test of Fund Withdrawal with not enough fund", () => {
    let commonsBudget: CommonsBudget;
    let commonsStorage: CommonsStorage;
    let voteraVote: VoteraVote;

    const { provider } = waffle;
    const [admin, voteManager, ...validators] = provider.getWallets();
    const adminSigner = provider.getSigner(admin.address);
    const basicFee = ethers.utils.parseEther("100.0");
    const fundAmount = ethers.utils.parseEther("10000.0");

    let proposalID: string;
    const proposer: Wallet = validators[0];

    before(async () => {
        // deploy CommonsBudget
        const commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");
        commonsBudget = await commonsBudgetFactory.connect(admin).deploy();
        await commonsBudget.deployed();

        const storageAddress = await commonsBudget.getStorageContractAddress();
        const storageFactory = await ethers.getContractFactory("CommonsStorage");
        commonsStorage = await storageFactory.attach(storageAddress);

        // deploy VoteraVote
        const voteraVoteFactory = await ethers.getContractFactory("VoteraVote");
        voteraVote = await voteraVoteFactory.connect(voteManager).deploy();
        await voteraVote.deployed();

        await voteraVote.changeCommonBudgetContract(commonsBudget.address);
        const changeParamTx = await commonsBudget.changeVoteParam(voteManager.address, voteraVote.address);
        await changeParamTx.wait();

        // set information about network, contract, and validators in helper module
        await setEnvironment(provider, commonsBudget, voteraVote, admin, voteManager, validators);

        // send only as much BOA as the fund amount to CommonsBudget contract
        await provider.getSigner(validators[0].address).sendTransaction({
            to: commonsBudget.address,
            value: fundAmount,
        });
    });

    beforeEach(() => {
        // generate random proposal id (which is address type)
        proposalID = getNewProposal();
    });

    it("Withdrawal: Unable to withdraw due to W10", async () => {
        const proposerBudget = CommonsBudgetFactory.connect(commonsBudget.address, validators[0]);
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);

        // Set too much voter fee for insufficient funds
        const voterFee = ethers.utils.parseEther("100.0");
        await commonsStorage.setVoterFee(voterFee);
        await assessProposal(proposalID, true);

        // Vote counting finished with approval
        await countVoteResult(proposalID, true);

        // 24 hours passed
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        // "W10" : There is not enough balance in the Commons Budget
        const [stateCode, _] = await proposerBudget.checkWithdrawState(proposalID);
        expect(stateCode).equals("W10");
    });
});

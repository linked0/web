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
    createFundProposal,
    createSystemProposal,
    makeCommitment,
    processVote,
    setEnvironment,
    signCommitment,
} from "./VoteHelper";

const AddressZero = "0x0000000000000000000000000000000000000000";
const InvalidProposal = "0x43d26d775ef3a282483394ce041a2757fbf700c9cf86accc6f0ce410accf123f";
const DocHash = "0x9f18669085971c1306dd0096ec531e71ad2732fd0e783068f2a3aba628613231";

chai.use(solidity);

function toSystemInput(title: string, start: number, end: number, docHash: BytesLike) {
    return { start, end, startAssess: 0, endAssess: 0, docHash, amount: 0, title };
}

function getNewProposal() {
    for (;;) {
        const proposal = `0x${crypto.randomBytes(32).toString("hex")}`;
        if (proposal !== InvalidProposal) {
            return proposal;
        }
    }
}

async function displayBalance(address: string, message: string) {
    const balance = await ethers.provider.getBalance(address);
    console.log(`${message}_balance = ${balance.toString()}`);
}

describe("Test of Vote Decision", () => {
    let commonsBudget: CommonsBudget;
    let commonsStorage: CommonsStorage;
    let voteraVote: VoteraVote;

    const { provider } = waffle;
    const [admin, voteManager, ...richValidators] = provider.getWallets();
    const adminSigner = provider.getSigner(admin.address);
    const basicFee = ethers.utils.parseEther("100.0");
    const fundAmount = ethers.utils.parseEther("10000.0");

    let proposalID: string;

    // create more validators and have 100 validators in total
    let validators: Wallet[] = [];
    validators = validators.concat(richValidators);
    for (let i = validators.length; i < 100; i += 1) {
        validators = validators.concat(provider.createEmptyWallet());
    }

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

        // send 1 million BOA to CommonsBudget contract
        const commonsFund = BigNumber.from(10).pow(18).mul(500000);
        for (let i = 0; i < 2; i++) {
            await provider.getSigner(richValidators[i].address).sendTransaction({
                to: commonsBudget.address,
                value: commonsFund,
            });
        }
    });

    beforeEach(() => {
        // generate random proposal id (which is address type)
        proposalID = getNewProposal();
    });

    it("finishVote: Proposal is approved", async () => {
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);

        const blockLatest = await ethers.provider.getBlock("latest");
        await processVote(proposalID, 50, 0, 0);

        const proposalData = await commonsBudget.getProposalData(proposalID);
        expect(proposalData.state).equal(4); // FINISHED
        expect(proposalData.proposalResult).equal(1); // APPROVED
        expect(Number(proposalData.countingFinishTime)).greaterThan(blockLatest.timestamp);
    });

    // Total validator: 100
    // Positive: 20
    // Negative: 10
    // Abstention(기권): 3
    // Voting is approved with a quorum of one-third of validators.
    it("finishVote: System proposal approved with a proper quorum", async () => {
        await createSystemProposal(proposalID, proposer, DocHash, basicFee);
        await processVote(proposalID, 20, 10, 3);

        const voteBudget = CommonsBudgetFactory.connect(commonsBudget.address, voteManager);
        const proposalData = await voteBudget.getProposalData(proposalID);
        expect(proposalData.state).equal(4); // ProposalStates.FINISHED
        expect(proposalData.proposalResult).equal(1); // ProposalResult.APPROVED
    });

    // Total validator: 100
    // Positive: 20
    // Negative: 10
    // Abstention(기권): 2
    // Voting is rejected because the voting count(=32) is less than the quorum(=33).
    it("finishVote: Rejected due to lack of quorum", async () => {
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        await processVote(proposalID, 20, 10, 2);

        const voteBudget = CommonsBudgetFactory.connect(commonsBudget.address, voteManager);
        const proposalData = await voteBudget.getProposalData(proposalID);
        expect(proposalData.state).equal(4); // ProposalStates.FINISHED
        expect(proposalData.proposalResult).equal(3); // ProposalResult.INVALID_QUORUM
    });

    // Total validator: 100
    // Positive: 18
    // Negative: 15
    // Abstention(기권): 0
    // Voting is rejected because the ratio of difference between approval and rejection
    // to the quorum is less than 0.01.
    it("finishVote: Rejected due to insufficient approval votes", async () => {
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        await processVote(proposalID, 18, 15, 0);

        const voteBudget = CommonsBudgetFactory.connect(commonsBudget.address, voteManager);
        const proposalData = await voteBudget.getProposalData(proposalID);
        expect(proposalData.state).equal(4); // ProposalStates.FINISHED
        expect(proposalData.proposalResult).equal(2); // ProposalResult.REJECTED
    });

    // Total validator: 100
    // Positive: 33
    // Negative: 33
    // Abstention(기권): 14
    // Voting is rejected because the number of positive votes is the same as
    // the number of negative ones
    it("finishVote: Rejected with too many negative votes", async () => {
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        await processVote(proposalID, 33, 33, 14);

        const voteBudget = CommonsBudgetFactory.connect(commonsBudget.address, voteManager);
        const proposalData = await voteBudget.getProposalData(proposalID);
        expect(proposalData.state).equal(4); // ProposalStates.FINISHED
        expect(proposalData.proposalResult).equal(2); // ProposalResult.REJECTED
    });

    // Total validator: 100
    // Positive: 33
    // Negative: 34
    // Abstention(기권): 13
    // Voting is rejected because negative votes are more than positive ones
    it("finishVote: Rejected with too many negative votes", async () => {
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        await processVote(proposalID, 33, 34, 13);

        const voteBudget = CommonsBudgetFactory.connect(commonsBudget.address, voteManager);
        const proposalData = await voteBudget.getProposalData(proposalID);
        expect(proposalData.state).equal(4); // ProposalStates.FINISHED
        expect(proposalData.proposalResult).equal(2); // ProposalResult.REJECTED
    });

    // Total validator: 100
    // Positive: 42
    // Negative: 34
    // Abstention(기권): 4
    // Voting is approved because the ratio of the difference between positive votes
    // and negative votes to the quorum is more than 0.01.
    it("finishVote: Approved with approval votes with more than 10 percent", async () => {
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        await processVote(proposalID, 42, 34, 4);

        const voteBudget = CommonsBudgetFactory.connect(commonsBudget.address, voteManager);
        const proposalData = await voteBudget.getProposalData(proposalID);
        expect(proposalData.state).equal(4); // ProposalStates.FINISHED
        expect(proposalData.proposalResult).equal(1); // ProposalResult.APPROVED
    });
});

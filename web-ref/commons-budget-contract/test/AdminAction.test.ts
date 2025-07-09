/* eslint-disable no-await-in-loop */
import chai, { expect } from "chai";
import crypto from "crypto";
import { solidity, MockProvider } from "ethereum-waffle";
import { BigNumber, utils, Wallet } from "ethers";
import { ethers, network, waffle } from "hardhat";
import * as assert from "assert";
import {
    CommonsBudget,
    CommonsBudget__factory as CommonsBudgetFactory,
    CommonsStorage,
    CommonsStorage__factory as CommonsStorageFactory,
    VoteraVote,
    VoteraVote__factory as VoteraVoteFactory,
} from "../typechain-types";
import {
    createSystemProposal,
    makeCommitment,
    setEnvironment,
    signCommitment,
    signFundProposal,
    signSystemProposal,
} from "./VoteHelper";

const AddressZero = "0x0000000000000000000000000000000000000000";
const InvalidProposal = "0x43d26d775ef3a282483394ce041a2757fbf700c9cf86accc6f0ce410accf123f";
const DocHash = "0x9f18669085971c1306dd0096ec531e71ad2732fd0e783068f2a3aba628613231";

chai.use(solidity);

function getNewProposal() {
    for (;;) {
        const proposal = `0x${crypto.randomBytes(32).toString("hex")}`;
        if (proposal !== InvalidProposal) {
            return proposal;
        }
    }
}

describe("Test actions by contract owner", () => {
    let contract: CommonsBudget;
    let voteraVote: VoteraVote;
    let storageContract: CommonsStorage;

    const basicFee = ethers.utils.parseEther("100.0");
    const fundAmount = ethers.utils.parseEther("10000.0");

    const { provider } = waffle;
    const [admin, voteManager, ...validators] = provider.getWallets();
    const amount = BigNumber.from(10).pow(18);
    const adminSigner = provider.getSigner(admin.address);

    let proposalID: string;

    const proposer: Wallet = validators[0];

    before(async () => {
        const commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");
        contract = (await commonsBudgetFactory.deploy()) as CommonsBudget;
        await contract.deployed();

        const storageAddress = await contract.getStorageContractAddress();
        const storageFactory = await ethers.getContractFactory("CommonsStorage");
        storageContract = await storageFactory.attach(storageAddress);

        const voteraVoteFactory = await ethers.getContractFactory("VoteraVote");
        voteraVote = await voteraVoteFactory.connect(admin).deploy();
        await voteraVote.deployed();
        await voteraVote.changeCommonBudgetContract(contract.address);

        const voteAddress = voteraVote.address;
        const changeParamTx = await contract.changeVoteParam(voteManager.address, voteAddress);
        await changeParamTx.wait();

        // set information about network, contract, and validators in helper module
        await setEnvironment(provider, contract, voteraVote, admin, voteManager, validators);
    });

    beforeEach(() => {
        // generate random proposal id (which is address type)
        proposalID = getNewProposal();
    });

    it("Check if admin can distribute vote fees", async () => {
        await createSystemProposal(proposalID, proposer, DocHash, basicFee);
        const proposalData = await contract.getProposalData(proposalID);
        const startTime = proposalData.start;
        const endTime = proposalData.end;
        const openTime = endTime.add(30);

        // ready to start voting
        await voteraVote.setupVoteInfo(proposalID, startTime, endTime, openTime, "info");

        // add only half of validators
        const validators1 = validators.slice(0, validators.length / 2);
        const validators2 = validators.slice(validators1.length, validators.length);
        await voteraVote.addValidators(
            proposalID,
            validators1.map((v) => v.address),
            false
        );
        expect(await contract.connect(adminSigner).canDistributeVoteFees(proposalID)).equal(false);

        // add all the validators
        await voteraVote.addValidators(
            proposalID,
            validators2.map((v) => v.address),
            true
        );
        expect(await contract.connect(adminSigner).canDistributeVoteFees(proposalID)).equal(true);
    });

    it("Distribute fees to more than 500 validators", async () => {
        await createSystemProposal(proposalID, proposer, DocHash, basicFee);
        const proposalData = await contract.getProposalData(proposalID);
        const startTime = proposalData.start;
        const endTime = proposalData.end;
        const openTime = endTime.add(30);

        // create more validators and have 108 validators in total
        let manyValidators: Wallet[] = validators;
        const addCount = (await storageContract.voteFeeDistribCount()).toNumber();
        for (let i = 0; i < addCount; i += 1) {
            manyValidators = manyValidators.concat(provider.createEmptyWallet());
        }

        // ready to start voting
        const { voteAddress } = await contract.getProposalData(proposalID);
        await voteraVote.setupVoteInfo(proposalID, startTime, endTime, openTime, "info");
        const count = Math.floor(manyValidators.length / 100);
        for (let i = 0; i < count; i += 1) {
            const start = i * 100;
            await voteraVote.addValidators(
                proposalID,
                manyValidators.slice(start, start + 100).map((v) => v.address),
                false
            );
        }
        await voteraVote.addValidators(
            proposalID,
            manyValidators.slice(addCount, manyValidators.length).map((v) => v.address),
            true
        );

        // get validators' balances to be compared with their balances after paying fees
        const prevBalances = new Map<string, BigNumber>();
        const valAddresses: string[] = [];
        const validatorCount = await voteraVote.getValidatorCount(proposalID);
        const valAddressLength = validatorCount.toNumber();
        for (let i = 0; i < valAddressLength; i += 1) {
            valAddresses.push(await voteraVote.getValidatorAt(proposalID, i));
        }
        expect(valAddresses.length).equals(manyValidators.length);
        for (const address of valAddresses) {
            prevBalances.set(address, await provider.getBalance(address));
        }

        // distribute vote fess to validators
        const maxCountDist = (await storageContract.voteFeeDistribCount()).toNumber();
        // const maxCountDist = (await contract.connect(adminSigner).voteFeeDistribCount()).toNumber();
        const distCallCount = valAddresses.length / maxCountDist;
        for (let i = 0; i < distCallCount; i += 1) {
            const start = i * maxCountDist;
            await contract.distributeVoteFees(proposalID, start);
            await network.provider.send("evm_mine");
        }

        // compares voters' balances with previous balances
        // the specified fee should be added to all the voters' balances
        const voterFee = await storageContract.voterFee();
        await network.provider.send("evm_mine");
        for (const address of valAddresses) {
            const curBalance = await provider.getBalance(address);
            const prevBalance = prevBalances.get(address);
            expect(curBalance.sub(prevBalance ?? 0).toNumber()).equal(voterFee.toNumber());
        }

        // try to distribute vote fess to validators AGAIN
        for (let i = 0; i < distCallCount; i += 1) {
            const start = i * maxCountDist;
            await contract.distributeVoteFees(proposalID, start);
            await network.provider.send("evm_mine");
        }

        // there must be no change for validators' balances although
        // `admin` distributes vote fees again because the fees had
        // already been distributed.
        for (const address of valAddresses) {
            const curBalance = await provider.getBalance(address);
            const prevBalance = prevBalances.get(address);
            expect(curBalance.sub(prevBalance ?? 0).toNumber()).equal(voterFee.toNumber());
        }
    });
});

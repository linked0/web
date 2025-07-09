/* eslint-disable no-await-in-loop */
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
import { makeCommitment, signCommitment, signFundProposal, signSystemProposal } from "./VoteHelper";

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

async function displayBalance(address: string, message: string) {
    const balance = await ethers.provider.getBalance(address);
    console.log(`${message}_balance = ${balance.toString()}`);
}

function getNewProposal() {
    for (;;) {
        const proposal = `0x${crypto.randomBytes(32).toString("hex")}`;
        if (proposal !== InvalidProposal) {
            return proposal;
        }
    }
}

describe("VoteraVote", () => {
    let budget: CommonsBudget;

    const { provider } = waffle;
    const [deployer, budgetManager, voteManager, ...validators] = provider.getWallets();
    const basicFee = ethers.utils.parseEther("100.0");
    const fundAmount = ethers.utils.parseEther("10000.0");

    let proposal: string;
    let startTime: number;
    let endTime: number;
    let openTime: number;
    let voteAddress: string;

    let startAssess: number;
    let endAssess: number;

    let voteraVote: VoteraVote;
    let voteBudget: CommonsBudget;

    let invalidCaller: Wallet;
    let invalidSigner: Wallet;

    const createSystemVote = async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "SystemProposalTitle";
        startTime = blockLatest.timestamp + 86400; // 1 day
        endTime = startTime + 86400; // 1 day
        openTime = endTime + 30;
        const docHash = DocHash;
        const signProposal = await signSystemProposal(voteManager, proposal, title, startTime, endTime, docHash);

        const validatorBudget = CommonsBudgetFactory.connect(budget.address, validators[0]);
        const makeProposalTx = await validatorBudget.createSystemProposal(
            proposal,
            toSystemInput(title, startTime, endTime, docHash),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();
    };

    const createFundVote = async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";

        startAssess = blockLatest.timestamp;
        endAssess = startAssess + 15000;
        startTime = blockLatest.timestamp + 86400; // 1 day
        endTime = startTime + 86400; // 1 day
        openTime = endTime + 30;
        const docHash = DocHash;
        const proposer = validators[0].address;
        const signProposal = await signFundProposal(
            voteManager,
            proposal,
            title,
            startTime,
            endTime,
            startAssess,
            endAssess,
            docHash,
            fundAmount,
            proposer
        );

        const validatorBudget = CommonsBudgetFactory.connect(budget.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();
    };

    before(async () => {
        // deploy CommonsBudget
        const budgetFactory = await ethers.getContractFactory("CommonsBudget");
        budget = await budgetFactory.connect(budgetManager).deploy();
        await budget.deployed();

        // deploy VoteraVote
        const voteraVoteFactory = await ethers.getContractFactory("VoteraVote");
        voteraVote = await voteraVoteFactory.connect(voteManager).deploy();
        await voteraVote.deployed();
        voteAddress = voteraVote.address;

        // change parameter of voteraVote
        voteBudget = CommonsBudgetFactory.connect(budget.address, voteManager);

        await voteraVote.changeCommonBudgetContract(budget.address);

        // change parameter of budget
        await budget.changeVoteParam(voteManager.address, voteraVote.address);

        // send test eth to budget
        const transactionTx = await deployer.sendTransaction({
            to: budget.address,
            value: utils.parseEther("10.0"),
        });
        await transactionTx.wait();

        // sending amount to budget
        await provider.getSigner(deployer.address).sendTransaction({
            to: budget.address,
            value: fundAmount,
        });
    });

    beforeEach(() => {
        // generate random proposal id (which is address type)
        proposal = getNewProposal();
    });

    it("normal lifecycle - system vote", async () => {
        await createSystemVote();

        expect(await voteraVote.getManager()).to.be.equal(voteManager.address);
        let voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.commonsBudgetAddress).equal(budget.address);
        expect(voteInfo.state, "CREATED state").equal(1);

        await displayBalance(voteManager.address, "init - system");

        // Setup Vote Information
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.state, "SETTING state").equal(2);

        // Add Validator list for voter confirmation
        const addValidatorTx = await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );
        await addValidatorTx.wait();
        expect(await voteraVote.getValidatorCount(proposal)).equal(validators.length);

        voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.state, "RUNNING state").equal(4); // RUNNING

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        // prepare ballot
        const choices: number[] = [];
        const nonces: number[] = [];
        const expectVoteCounts: number[] = [0, 0, 0];
        const voterCount = validators.length - 1;

        for (let i = 0; i < voterCount; i += 1) {
            const c = i % 3;
            choices.push(c);
            nonces.push(i + 1);
            expectVoteCounts[c] += 1;
        }

        // submit ballot
        let submitBallotTx;
        for (let i = 0; i < voterCount; i += 1) {
            const commitment = await makeCommitment(
                voteAddress,
                proposal,
                validators[i].address,
                choices[i],
                nonces[i]
            );
            const signature = await signCommitment(voteManager, proposal, validators[i].address, commitment);

            const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            submitBallotTx = await ballotVote.submitBallot(proposal, commitment, signature);
        }

        expect(await voteraVote.getBallotCount(proposal)).equal(voterCount);

        if (submitBallotTx) {
            await submitBallotTx.wait();
        }

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        // check read ballot information
        for (let i = 0; i < voterCount; i += 1) {
            const ballotAddr = await voteraVote.getBallotAt(proposal, i);
            const ballot = await voteraVote.getBallot(proposal, ballotAddr);
            expect(ballot.key).equal(validators[i].address);
        }

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        // reveal ballot (by voteraServer)
        const keys1 = validators.map((v) => v.address).slice(0, 4);
        const choice1 = choices.slice(0, 4);
        const nonce1 = nonces.slice(0, 4);

        const revealTx1 = await voteraVote.revealBallot(proposal, keys1, choice1, nonce1);
        await revealTx1.wait();

        await expect(voteraVote.countVote(proposal)).to.be.revertedWith("E002");

        const keys2 = validators.map((v) => v.address).slice(4, voterCount);
        const choice2 = choices.slice(4, voterCount);
        const nonce2 = nonces.slice(4, voterCount);

        await voteraVote.revealBallot(proposal, keys2, choice2, nonce2);

        const registerTx = await voteraVote.countVote(proposal);
        await registerTx.wait();

        // check vote result
        const validatorCount = await voteraVote.getValidatorCount(proposal);
        const voteResult = await voteraVote.getVoteResult(proposal);
        for (let i = 0; i < 3; i += 1) {
            expect(voteResult[i]).equal(expectVoteCounts[i]);
        }

        await displayBalance(voteManager.address, "end_ - system");

        const proposalData = await voteBudget.getProposalData(proposal);
        expect(proposalData.validatorSize).equal(validatorCount);
        for (let i = 0; i < 3; i += 1) {
            expect(proposalData.voteResult[i]).equal(BigNumber.from(voteResult[i]));
        }
    });

    it("normal lifecycle - fund vote", async () => {
        await createFundVote();

        expect(await voteraVote.getManager()).to.be.equal(voteManager.address);
        let voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.commonsBudgetAddress).equal(budget.address);
        expect(voteInfo.state, "CREATED state").equal(1);

        await displayBalance(voteManager.address, "init - fund");

        // Setup Vote Information
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.state, "SETTING state").equal(2);

        // Add Validator list for voter confirmation
        const addValidatorTx = await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );
        await addValidatorTx.wait();
        expect(await voteraVote.getValidatorCount(proposal)).equal(validators.length);

        voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.state, "ASSESSING state").equal(3); // ASSESSING

        for (let i = 0; i < validators.length; i += 1) {
            const assessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await assessVote.submitAssess(proposal, [10, 10, 10, 10, 10]);
        }

        // wait until assessEnd
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.state, "RUNNING state").equal(4); // RUNNING
        const assessResult = await voteraVote.getAssessResult(proposal);
        expect(assessResult).to.eql([10, 10, 10, 10, 10].map((v) => BigNumber.from(v * validators.length)));

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400 - 15000]);
        await network.provider.send("evm_mine");

        // prepare ballot
        const choices: number[] = [];
        const nonces: number[] = [];
        const expectVoteCounts: number[] = [0, 0, 0];
        const voterCount = validators.length - 1;

        for (let i = 0; i < voterCount; i += 1) {
            const c = i % 3;
            choices.push(c);
            nonces.push(i + 1);
            expectVoteCounts[c] += 1;
        }

        // submit ballot
        let submitBallotTx;
        for (let i = 0; i < voterCount; i += 1) {
            const commitment = await makeCommitment(
                voteAddress,
                proposal,
                validators[i].address,
                choices[i],
                nonces[i]
            );
            const signature = await signCommitment(voteManager, proposal, validators[i].address, commitment);

            const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            submitBallotTx = await ballotVote.submitBallot(proposal, commitment, signature);
        }

        expect(await voteraVote.getBallotCount(proposal)).equal(voterCount);

        if (submitBallotTx) {
            await submitBallotTx.wait();
        }

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        // check read ballot information
        for (let i = 0; i < voterCount; i += 1) {
            const ballotAddr = await voteraVote.getBallotAt(proposal, i);
            const ballot = await voteraVote.getBallot(proposal, ballotAddr);
            expect(ballot.key).equal(validators[i].address);
        }

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        // reveal ballot (by voteraServer)
        const keys1 = validators.map((v) => v.address).slice(0, 4);
        const choice1 = choices.slice(0, 4);
        const nonce1 = nonces.slice(0, 4);

        const revealTx1 = await voteraVote.revealBallot(proposal, keys1, choice1, nonce1);
        await revealTx1.wait();

        await expect(voteraVote.countVote(proposal)).to.be.revertedWith("E002");

        const keys2 = validators.map((v) => v.address).slice(4, voterCount);
        const choice2 = choices.slice(4, voterCount);
        const nonce2 = nonces.slice(4, voterCount);

        await voteraVote.revealBallot(proposal, keys2, choice2, nonce2);

        const registerTx = await voteraVote.countVote(proposal);
        await registerTx.wait();

        // check vote result
        const validatorCount = await voteraVote.getValidatorCount(proposal);
        const voteResult = await voteraVote.getVoteResult(proposal);
        for (let i = 0; i < 3; i += 1) {
            expect(voteResult[i]).equal(expectVoteCounts[i]);
        }

        await displayBalance(voteManager.address, "end_ - fund");

        const proposalData = await voteBudget.getProposalData(proposal);
        expect(proposalData.validatorSize).equal(validatorCount);
        for (let i = 0; i < 3; i += 1) {
            expect(proposalData.voteResult[i]).equal(BigNumber.from(voteResult[i]));
        }
    });

    it("changeCommonBudgetContract", async () => {
        expect(await voteraVote.commonsBudgetAddress()).equal(budget.address);
    });

    it("changeCommonBudgetContract: Ownable: caller is not the owner", async () => {
        invalidCaller = deployer;
        const invalidCallerVote = VoteraVoteFactory.connect(voteAddress, invalidCaller);
        await expect(invalidCallerVote.changeCommonBudgetContract(deployer.address)).to.be.revertedWith(
            "Ownable: caller is not the owner"
        );
    });

    it("changeCommonBudgetContract: E001", async () => {
        const invalidValue = AddressZero;
        await expect(voteraVote.changeCommonBudgetContract(invalidValue)).to.be.revertedWith("E001");
    });

    it("init: E000", async () => {
        invalidCaller = deployer;
        const invalidCallerVote = VoteraVoteFactory.connect(voteAddress, invalidCaller);
        await expect(invalidCallerVote.init(proposal, false, startTime, endTime, 0, 0)).to.be.revertedWith("E000");
    });

    it("setupVoteInfo", async () => {
        await createSystemVote();

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");

        const voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.startVote).equals(startTime);
        expect(voteInfo.endVote).equals(endTime);
        expect(voteInfo.openVote).equals(openTime);
        expect(voteInfo.info).equals("info");
        expect(voteInfo.state, "SETTING state").equals(2); // SETTING
    });

    it("setupVoteInfo: Ownable: caller is not the owner", async () => {
        await createSystemVote();

        invalidCaller = budgetManager;
        const invalidCallerVote = VoteraVoteFactory.connect(voteAddress, invalidCaller);
        await expect(
            invalidCallerVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info")
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("setupVoteInfo: E001", async () => {
        await createSystemVote();

        // invalid proposal
        await expect(
            voteraVote.setupVoteInfo(InvalidProposal, startTime, endTime, openTime, "info")
        ).to.be.revertedWith("E001");

        // block.timestamp < _startVote
        const blockLatest = await ethers.provider.getBlock("latest");
        const invalidStartTime = blockLatest.timestamp - 100;
        await expect(
            voteraVote.setupVoteInfo(proposal, invalidStartTime, endTime, openTime, "info")
        ).to.be.revertedWith("E001");

        // _endVote < _openVote
        const invalidOpenTime = endTime - 100;
        await expect(
            voteraVote.setupVoteInfo(proposal, startTime, endTime, invalidOpenTime, "info")
        ).to.be.revertedWith("E001");
    });

    it("setupVoteInfo: E002 - call setupVote twice", async () => {
        await createSystemVote();

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");

        // call setupVoteInfo again
        await expect(voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info")).to.be.revertedWith(
            "E002"
        );
    });

    it("setupVoteInfo: E002 - invalid parameter", async () => {
        await createSystemVote();

        const wrongStartTime = startTime + 100;
        await expect(voteraVote.setupVoteInfo(proposal, wrongStartTime, endTime, openTime, "info")).to.be.revertedWith(
            "E002"
        );

        const wrongEndTime = endTime - 100;
        await expect(voteraVote.setupVoteInfo(proposal, startTime, wrongEndTime, openTime, "info")).to.be.revertedWith(
            "E002"
        );
    });

    it("addValidators - system", async () => {
        await createSystemVote();

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");

        await voteraVote.addValidators(
            proposal,
            validators.slice(0, 5).map((v) => v.address),
            false
        );
        expect(await voteraVote.getValidatorCount(proposal)).equal(BigNumber.from(5));
        for (let i = 0; i < 5; i += 1) {
            expect(await voteraVote.getValidatorAt(proposal, i)).equal(validators[i].address);
        }

        let voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.state, "SETTING state").equal(2); // CREATED

        await voteraVote.addValidators(
            proposal,
            validators.slice(3).map((v) => v.address),
            true
        );

        voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.state, "RUNNING state").equal(4); // RUNNING

        expect(await voteraVote.getValidatorCount(proposal)).equal(BigNumber.from(validators.length));
        for (let i = 0; i < validators.length; i += 1) {
            expect(await voteraVote.getValidatorAt(proposal, i)).equal(validators[i].address);
        }
    });

    it("addValidators - fund", async () => {
        await createFundVote();

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");

        await voteraVote.addValidators(
            proposal,
            validators.slice(0, 5).map((v) => v.address),
            false
        );
        expect(await voteraVote.getValidatorCount(proposal)).equal(BigNumber.from(5));
        for (let i = 0; i < 5; i += 1) {
            expect(await voteraVote.getValidatorAt(proposal, i)).equal(validators[i].address);
        }

        let voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.state, "SETTING state").equal(2); // CREATED

        await voteraVote.addValidators(
            proposal,
            validators.slice(3).map((v) => v.address),
            true
        );

        voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.state, "ASSESSING state").equal(3); // ASSESSING

        expect(await voteraVote.getValidatorCount(proposal)).equal(BigNumber.from(validators.length));
        for (let i = 0; i < validators.length; i += 1) {
            expect(await voteraVote.getValidatorAt(proposal, i)).equal(validators[i].address);
        }
    });

    it("addValidators: Ownable: caller is not the owner", async () => {
        invalidCaller = budgetManager;
        const invalidCallerVote = VoteraVoteFactory.connect(voteAddress, invalidCaller);
        await expect(
            invalidCallerVote.addValidators(
                proposal,
                validators.map((v) => v.address),
                true
            )
        ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("addValidators: E001", async () => {
        // call addValidators without init
        await expect(
            voteraVote.addValidators(
                InvalidProposal,
                validators.map((v) => v.address),
                true
            )
        ).to.be.revertedWith("E001");
    });

    it("addValidators: E002", async () => {
        await createSystemVote();

        // call addvalidators without calling setupVoteInfo
        await expect(
            voteraVote.addValidators(
                proposal,
                validators.map((v) => v.address),
                true
            )
        ).to.be.revertedWith("E002");
    });

    it("addValidators: E002 - add validator after finalize, system", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.slice(0, 5).map((v) => v.address),
            true
        );

        await expect(
            voteraVote.addValidators(
                proposal,
                validators.slice(5).map((v) => v.address),
                true
            )
        ).to.be.revertedWith("E002");
    });

    it("addValidators: E002 - add validator after finalize, fund", async () => {
        await createFundVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.slice(0, 5).map((v) => v.address),
            true
        );
        await expect(
            voteraVote.addValidators(
                proposal,
                validators.slice(5).map((v) => v.address),
                true
            )
        ).to.be.revertedWith("E002");
    });

    it("addValidators: E003", async () => {
        await createSystemVote();

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        // call addValidators after voteStart
        await expect(
            voteraVote.addValidators(
                proposal,
                validators.map((v) => v.address),
                true
            )
        ).to.be.revertedWith("E003");
    });

    it("submitAssess", async () => {
        await createFundVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );
        for (let i = 0; i < validators.length - 3; i += 1) {
            const assessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await assessVote.submitAssess(proposal, [10, 10, 10, 10, 10]);
        }
        for (let i = 3; i < validators.length; i += 1) {
            const assessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await assessVote.submitAssess(proposal, [9, 9, 9, 9, 9]);
        }
        const assessCount = await voteraVote.getAssessCount(proposal);
        expect(assessCount).equal(BigNumber.from(validators.length));
        for (let i = 0; i < validators.length; i += 1) {
            const assessAddr = await voteraVote.getAssessAt(proposal, i);
            expect(assessAddr).equal(validators[i].address);
        }
    });

    it("submitAssess: E001", async () => {
        await createFundVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        const assessVote = VoteraVoteFactory.connect(voteAddress, validators[0]);

        // invalid proposal
        await expect(assessVote.submitAssess(InvalidProposal, [10, 10, 10, 10, 10])).to.be.revertedWith("E001");

        // invalid parameter, _assess.length == 5
        const smallData = [10, 10, 10, 10];
        await expect(assessVote.submitAssess(proposal, smallData)).to.be.revertedWith("E001");

        const largeData = [10, 10, 10, 10, 10, 10];
        await expect(assessVote.submitAssess(proposal, largeData)).to.be.revertedWith("E001");

        // _assess[i] >= 1 && _assess[i] <= 10
        const minData = [10, 10, 0, 10, 10];
        await expect(assessVote.submitAssess(proposal, minData)).to.be.revertedWith("E001");

        const maxData = [10, 10, 11, 10, 10];
        await expect(assessVote.submitAssess(proposal, maxData)).to.be.revertedWith("E001");
    });

    it("submitAssess: E002", async () => {
        await createFundVote();

        const assessVote = VoteraVoteFactory.connect(voteAddress, validators[0]);

        // current state = CREATED
        await expect(assessVote.submitAssess(proposal, [10, 10, 10, 10, 10])).to.be.revertedWith("E002");

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        // current state = SETTING
        await expect(assessVote.submitAssess(proposal, [10, 10, 10, 10, 10])).to.be.revertedWith("E002");

        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            false
        );
        // current state = SETTING
        await expect(assessVote.submitAssess(proposal, [10, 10, 10, 10, 10])).to.be.revertedWith("E002");

        await voteraVote.addValidators(proposal, [], true);
        // current state = ASSESSING
        await assessVote.submitAssess(proposal, [10, 10, 10, 10, 10]);

        // wait until assessEnd
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        // current state = RUNNING
        await expect(assessVote.submitAssess(proposal, [10, 10, 10, 10, 10])).to.be.revertedWith("E002");
    });

    it("submitAssess: E000", async () => {
        await createFundVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.slice(1).map((v) => v.address),
            true
        );

        const wrongAssessVote = VoteraVoteFactory.connect(voteAddress, validators[0]);
        await expect(wrongAssessVote.submitAssess(proposal, [10, 10, 10, 10, 10])).to.be.revertedWith("E000");
    });

    it("submitAssess: E003", async () => {
        await createFundVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until assessEnd
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        const accessVote = VoteraVoteFactory.connect(voteAddress, validators[0]);
        await expect(accessVote.submitAssess(proposal, [10, 10, 10, 10, 10])).to.be.revertedWith("E003");
    });

    it("countAssess - pass", async () => {
        await createFundVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        const assessValue = [6, 7, 8, 9, 10];

        for (let i = 0; i < validators.length; i += 1) {
            const accessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await accessVote.submitAssess(proposal, assessValue);
        }

        // wait until assessEnd
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        const voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.state, "RUNNING").equal(4); // RUNNING
        const assessResult = await voteraVote.getAssessResult(proposal);
        expect(assessResult).to.eql(assessValue.map((v) => BigNumber.from(v * validators.length)));

        const proposalData = await budget.getProposalData(proposal);
        expect(proposalData.state, "ACCEPTED state").equal(3); // ACCEPTED
    });

    it("countAssess - reject", async () => {
        await createFundVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        const assessValue = [5, 5, 6, 6, 7];

        for (let i = 0; i < validators.length; i += 1) {
            const accessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await accessVote.submitAssess(proposal, assessValue);
        }

        // wait until assessEnd
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        const voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.state, "RUNNING").equal(4); // RUNNING
        const assessResult = await voteraVote.getAssessResult(proposal);
        expect(assessResult).to.eql(assessValue.map((v) => BigNumber.from(v * validators.length)));

        const proposalData = await budget.getProposalData(proposal);
        expect(proposalData.state, "REJECTED state").equal(2); // ACCEPTED
    });

    it("countAssess: Ownable: caller is not the owner", async () => {
        invalidCaller = deployer;
        const invalidCallerVote = VoteraVoteFactory.connect(voteAddress, invalidCaller);
        await expect(invalidCallerVote.countAssess(proposal)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("countAssess: E001", async () => {
        await expect(voteraVote.countAssess(InvalidProposal)).to.be.revertedWith("E001");
    });

    it("countAssess: E002", async () => {
        await createFundVote();

        // state = CREATED
        await expect(voteraVote.countAssess(proposal)).to.be.revertedWith("E002");

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");

        // state = SETTING
        await expect(voteraVote.countAssess(proposal)).to.be.revertedWith("E002");

        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        const assessValue = [6, 7, 8, 9, 10];

        for (let i = 0; i < validators.length; i += 1) {
            const accessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await accessVote.submitAssess(proposal, assessValue);
        }

        // wait until assessEnd
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        // state = RUNNING
        await expect(voteraVote.countAssess(proposal)).to.be.revertedWith("E002");
    });

    it("countAssess: E004", async () => {
        await createFundVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        const assessValue = [6, 7, 8, 9, 10];

        for (let i = 0; i < validators.length; i += 1) {
            const accessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await accessVote.submitAssess(proposal, assessValue);
        }

        await expect(voteraVote.countAssess(proposal)).to.be.revertedWith("E004");
    });

    it("getAssessResult: E001", async () => {
        await expect(voteraVote.getAssessResult(InvalidProposal)).to.be.revertedWith("E001");
    });

    it("getAssessResult: E002", async () => {
        await createFundVote();

        // state = CREATED
        await expect(voteraVote.getAssessResult(proposal)).to.be.revertedWith("E002");

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");

        // state = SETTING
        await expect(voteraVote.getAssessResult(proposal)).to.be.revertedWith("E002");

        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // state = ASSESSING
        await expect(voteraVote.getAssessResult(proposal)).to.be.revertedWith("E002");

        const assessValue = [6, 7, 8, 9, 10];

        for (let i = 0; i < validators.length; i += 1) {
            const accessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await accessVote.submitAssess(proposal, assessValue);
        }

        // wait until assessEnd
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        // state = RUNNING
        let assessResult = await voteraVote.getAssessResult(proposal);
        expect(assessResult).to.eql(assessValue.map((v) => BigNumber.from(v * validators.length)));

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400 - 15000]);
        await network.provider.send("evm_mine");

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        await voteraVote.countVote(proposal);

        assessResult = await voteraVote.getAssessResult(proposal);
        expect(assessResult).to.eql(assessValue.map((v) => BigNumber.from(v * validators.length)));
    });

    it("submitBallot", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        const choice = 1;
        const nonce = 1;

        // validator[0]
        const commitment = await makeCommitment(voteAddress, proposal, validators[0].address, choice, nonce);
        const signature = await signCommitment(voteManager, proposal, validators[0].address, commitment);

        const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[0]);
        await ballotVote.submitBallot(proposal, commitment, signature);

        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(1));

        // validator[1]
        const commitment1 = await makeCommitment(voteAddress, proposal, validators[1].address, choice, nonce);
        const signature1 = await signCommitment(voteManager, proposal, validators[1].address, commitment1);

        const ballotVote1 = VoteraVoteFactory.connect(voteAddress, validators[1]);
        await ballotVote1.submitBallot(proposal, commitment1, signature1);

        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(2));

        // overwrite by validator[0]
        const newChoice = 2;
        const newNonce = 2;
        const newCommitment = await makeCommitment(voteAddress, proposal, validators[0].address, newChoice, newNonce);
        const newSignature = await signCommitment(voteManager, proposal, validators[0].address, newCommitment);

        await ballotVote.submitBallot(proposal, newCommitment, newSignature);

        // confirm getBallotCount not changed
        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(2));

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        const ballot1 = await ballotVote1.getBallot(proposal, validators[1].address);
        expect(ballot1.key).equal(validators[1].address);
        expect(ballot1.choice).equal(BigNumber.from(0));
        expect(ballot1.nonce).equal(BigNumber.from(0));
        expect(ballot1.commitment).equal(commitment1);

        const ballotChanged = await ballotVote.getBallot(proposal, validators[0].address);
        expect(ballotChanged.key).equal(validators[0].address);
        expect(ballotChanged.choice).equal(BigNumber.from(0));
        expect(ballotChanged.nonce).equal(BigNumber.from(0));
        expect(ballotChanged.commitment).equal(newCommitment);
    });

    it("submitBallot: E001 - not found proposal", async () => {
        const choice = 1;
        const nonce = 1;

        // validator[0]
        const commitment = await makeCommitment(voteAddress, proposal, validators[0].address, choice, nonce);
        const signature = await signCommitment(voteManager, proposal, validators[0].address, commitment);

        const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[0]);
        await expect(ballotVote.submitBallot(InvalidProposal, commitment, signature)).to.be.revertedWith("E001"); // not found proposal
    });

    it("submitBallot: E002", async () => {
        await createFundVote();

        const choice = 1;
        const nonce = 1;

        // validator[0]
        const commitment = await makeCommitment(voteAddress, proposal, validators[0].address, choice, nonce);
        const signature = await signCommitment(voteManager, proposal, validators[0].address, commitment);

        const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[0]);
        // state = CREATED
        await expect(ballotVote.submitBallot(proposal, commitment, signature)).to.be.revertedWith("E002");

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        // state = SETTING
        await expect(ballotVote.submitBallot(proposal, commitment, signature)).to.be.revertedWith("E002");

        const addValidatorTx = await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );
        // state = ASSESSING
        await expect(ballotVote.submitBallot(proposal, commitment, signature)).to.be.revertedWith("E002");

        const assessValue = [6, 7, 8, 9, 10];

        for (let i = 0; i < validators.length; i += 1) {
            const accessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await accessVote.submitAssess(proposal, assessValue);
        }

        // wait until assessEnd
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400 - 15000]);
        await network.provider.send("evm_mine");

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        await voteraVote.countVote(proposal);

        // state = FINISHED
        await expect(ballotVote.submitBallot(proposal, commitment, signature)).to.be.revertedWith("E002");
    });

    it("submitBallot: E000", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        const choice = 1;
        const nonce = 1;

        // validator[0]
        const commitment = await makeCommitment(voteAddress, proposal, validators[0].address, choice, nonce);
        const signature = await signCommitment(voteManager, proposal, validators[0].address, commitment);

        const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[0]);
        await ballotVote.submitBallot(proposal, commitment, signature);

        invalidCaller = deployer;
        const commitmentOfInvalidCaller = await makeCommitment(
            voteAddress,
            proposal,
            invalidCaller.address,
            choice,
            nonce
        );
        const signatureOfInvalidCaller = await signCommitment(
            voteManager,
            proposal,
            invalidCaller.address,
            commitmentOfInvalidCaller
        );

        const invalidCallerVote = VoteraVoteFactory.connect(voteAddress, invalidCaller);
        await expect(
            invalidCallerVote.submitBallot(proposal, commitmentOfInvalidCaller, signatureOfInvalidCaller)
        ).to.be.revertedWith("E000");
    });

    it("submitBallot: E004", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        const choice = 1;
        const nonce = 1;

        // validator[0]
        const commitment = await makeCommitment(voteAddress, proposal, validators[0].address, choice, nonce);
        const signature = await signCommitment(voteManager, proposal, validators[0].address, commitment);

        const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[0]);
        await expect(ballotVote.submitBallot(proposal, commitment, signature)).to.be.revertedWith("E004");
    });

    it("submitBallot: E003", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        const choice = 1;
        const nonce = 1;

        // validator[0]
        const commitment = await makeCommitment(voteAddress, proposal, validators[0].address, choice, nonce);
        const signature = await signCommitment(voteManager, proposal, validators[0].address, commitment);

        const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[0]);
        await expect(ballotVote.submitBallot(proposal, commitment, signature)).to.be.revertedWith("E003");
    });

    it("submitBallot: E001 - verifyBallot failed", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        const choice = 1;
        const nonce = 1;

        // validator[0]
        const commitment = await makeCommitment(voteAddress, proposal, validators[0].address, choice, nonce);
        const signature = await signCommitment(voteManager, proposal, validators[0].address, commitment);

        const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[0]);

        [, invalidCaller] = validators;
        const invalidCallerVote = VoteraVoteFactory.connect(voteAddress, invalidCaller);
        await expect(invalidCallerVote.submitBallot(proposal, commitment, signature)).to.be.revertedWith("E001");

        invalidSigner = budgetManager;
        const invalidSignature = await signCommitment(invalidSigner, proposal, validators[0].address, commitment);
        await expect(ballotVote.submitBallot(proposal, commitment, invalidSignature)).to.be.revertedWith("E001");
    });

    it("getBallot", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        const commitments: string[] = [];
        const voteCount = 2;

        for (let i = 0; i < voteCount; i += 1) {
            const choice = i % 3;
            const nonce = i + 1;
            const commitment = await makeCommitment(voteAddress, proposal, validators[i].address, choice, nonce);
            const signature = await signCommitment(voteManager, proposal, validators[i].address, commitment);

            commitments.push(commitment);

            const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await ballotVote.submitBallot(proposal, commitment, signature);
        }

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(voteCount));

        for (let i = 0; i < voteCount; i += 1) {
            const ballotAddr = await voteraVote.getBallotAt(proposal, i);
            const ballot = await voteraVote.getBallot(proposal, ballotAddr);
            expect(ballot.key).equal(validators[i].address);
            expect(ballot.choice).equal(BigNumber.from(0));
            expect(ballot.nonce).equal(BigNumber.from(0));
            expect(ballot.commitment).equal(commitments[i]);
        }
    });

    it("getBallot: E001", async () => {
        await expect(voteraVote.getBallot(InvalidProposal, validators[0].address)).to.be.revertedWith("E001"); // not found proposal
    });

    it("getBallot: E004", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        await expect(voteraVote.getBallot(proposal, validators[0].address)).to.be.revertedWith("E004");
    });

    it("revealBallot", async () => {
        // prepare ballot
        const voterCount = 2;
        const keys: string[] = validators.slice(0, voterCount).map((v) => v.address);
        const choices: number[] = [];
        const nonces: number[] = [];
        const commitments: string[] = [];

        for (let i = 0; i < voterCount; i += 1) {
            const choice = i % 3;
            const nonce = i + 1;
            const commitment = await makeCommitment(voteAddress, proposal, validators[i].address, choice, nonce);

            choices.push(choice);
            nonces.push(nonce);
            commitments.push(commitment);
        }

        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        for (let i = 0; i < voterCount; i += 1) {
            const signature = await signCommitment(voteManager, proposal, validators[i].address, commitments[i]);
            const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await ballotVote.submitBallot(proposal, commitments[i], signature);
        }

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(voterCount));

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        await voteraVote.revealBallot(proposal, keys, choices, nonces);

        for (let i = 0; i < voterCount; i += 1) {
            const ballotAddr = await voteraVote.getBallotAt(proposal, i);
            const ballot = await voteraVote.getBallot(proposal, ballotAddr);
            expect(ballot.key).equal(validators[i].address);
            expect(ballot.choice).equal(BigNumber.from(choices[i]));
            expect(ballot.nonce).equal(BigNumber.from(nonces[i]));
            expect(ballot.commitment).equal(commitments[i]);
        }
    });

    it("revealBallot: Ownable: caller is not the owner", async () => {
        const keys = validators.map((v) => v.address);
        const choices = validators.map((v, i) => i % 3);
        const nonces = validators.map((v, i) => i + 1);

        invalidCaller = budgetManager;
        const invalidCallerVote = VoteraVoteFactory.connect(voteAddress, invalidCaller);
        await expect(invalidCallerVote.revealBallot(proposal, keys, choices, nonces)).to.be.revertedWith(
            "Ownable: caller is not the owner"
        );
    });

    it("revealBallot: E001", async () => {
        // prepare ballot
        const voterCount = 2;
        const keys: string[] = validators.slice(0, voterCount).map((v) => v.address);
        const choices: number[] = [];
        const nonces: number[] = [];
        const commitments: string[] = [];

        for (let i = 0; i < voterCount; i += 1) {
            const choice = i % 3;
            const nonce = i + 1;
            const commitment = await makeCommitment(voteAddress, proposal, validators[i].address, choice, nonce);

            choices.push(choice);
            nonces.push(nonce);
            commitments.push(commitment);
        }

        await expect(voteraVote.revealBallot(InvalidProposal, keys, choices, nonces)).to.be.revertedWith("E001"); // not found proposal

        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        for (let i = 0; i < voterCount; i += 1) {
            const signature = await signCommitment(voteManager, proposal, validators[i].address, commitments[i]);
            const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await ballotVote.submitBallot(proposal, commitments[i], signature);
        }

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(voterCount));

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        const invalidChoicesSize = choices.slice(1);
        await expect(voteraVote.revealBallot(proposal, keys, invalidChoicesSize, nonces)).to.be.revertedWith("E001");
        const invalidNoncesSize = nonces.slice(1);
        await expect(voteraVote.revealBallot(proposal, keys, choices, invalidNoncesSize)).to.be.revertedWith("E001");

        const invalidNoncesZero = nonces.map((o, i) => (i === 0 ? 0 : o));
        await expect(voteraVote.revealBallot(proposal, keys, choices, invalidNoncesZero)).to.be.revertedWith("E001");

        const invalidChoicesCommitment = choices.map((c, i) => (i === 1 ? c + 1 : c));
        await expect(voteraVote.revealBallot(proposal, keys, invalidChoicesCommitment, nonces)).to.be.revertedWith(
            "E001"
        );

        const invalidNoncesCommitment = nonces.map((o, i) => (i === 0 ? o + 1 : o));
        await expect(voteraVote.revealBallot(proposal, keys, choices, invalidNoncesCommitment)).to.be.revertedWith(
            "E001"
        );
    });

    it("revealBallot: E002", async () => {
        // prepare ballot
        const voterCount = 2;
        const keys: string[] = validators.slice(0, voterCount).map((v) => v.address);
        const choices: number[] = [];
        const nonces: number[] = [];
        const commitments: string[] = [];

        for (let i = 0; i < voterCount; i += 1) {
            const choice = i % 3;
            const nonce = i + 1;
            const commitment = await makeCommitment(voteAddress, proposal, validators[i].address, choice, nonce);

            choices.push(choice);
            nonces.push(nonce);
            commitments.push(commitment);
        }

        await createFundVote();
        // state = CREATED
        await expect(voteraVote.revealBallot(proposal, keys, choices, nonces)).to.be.revertedWith("E002"); // call without setupVoteInfo

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        // state = SETTING
        await expect(voteraVote.revealBallot(proposal, keys, choices, nonces)).to.be.revertedWith("E002"); // call without setupVoteInfo

        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );
        // state = ASSESSING
        await expect(voteraVote.revealBallot(proposal, keys, choices, nonces)).to.be.revertedWith("E002"); // call without setupVoteInfo

        for (let i = 0; i < validators.length; i += 1) {
            const assessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await assessVote.submitAssess(proposal, [10, 10, 10, 10, 10]);
        }

        // wait until startAssess
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400 - 15000]);
        await network.provider.send("evm_mine");

        for (let i = 0; i < voterCount; i += 1) {
            const signature = await signCommitment(voteManager, proposal, validators[i].address, commitments[i]);
            const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await ballotVote.submitBallot(proposal, commitments[i], signature);
        }

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(voterCount));

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        await voteraVote.revealBallot(proposal, keys, choices, nonces);

        await voteraVote.countVote(proposal);

        // state = FINISHED
        await expect(voteraVote.revealBallot(proposal, keys, choices, nonces)).to.be.revertedWith("E002");
    });

    it("revealBallot: E004", async () => {
        // prepare ballot
        const voterCount = 2;
        const keys: string[] = validators.slice(0, voterCount).map((v) => v.address);
        const choices: number[] = [];
        const nonces: number[] = [];
        const commitments: string[] = [];

        for (let i = 0; i < voterCount; i += 1) {
            const choice = i % 3;
            const nonce = i + 1;
            const commitment = await makeCommitment(voteAddress, proposal, validators[i].address, choice, nonce);

            choices.push(choice);
            nonces.push(nonce);
            commitments.push(commitment);
        }

        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        await expect(voteraVote.revealBallot(proposal, keys, choices, nonces)).to.be.revertedWith("E004");
    });

    it("countVote&getVoteResult", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        const voterCount = 5;
        const keys = validators.slice(0, voterCount).map((v) => v.address);
        const choices: number[] = [];
        const nonces: number[] = [];
        const commitments: string[] = [];
        const expectVoteCounts: number[] = [0, 0, 0];

        for (let i = 0; i < voterCount; i += 1) {
            const choice = i % 3;
            const nonce = i + 1;
            const commitment = await makeCommitment(voteAddress, proposal, validators[i].address, choice, nonce);
            const signature = await signCommitment(voteManager, proposal, validators[i].address, commitment);

            choices.push(choice);
            nonces.push(nonce);
            expectVoteCounts[choice] += 1;
            commitments.push(commitment);

            const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await ballotVote.submitBallot(proposal, commitment, signature);
        }

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(voterCount));

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        await voteraVote.revealBallot(proposal, keys, choices, nonces);

        await voteraVote.countVote(proposal);

        const voteResult = await voteraVote.getVoteResult(proposal);
        expect(voteResult.length).equal(3);
        for (let i = 0; i < 3; i += 1) {
            expect(voteResult[i]).equal(expectVoteCounts[i]);
        }
    });

    it("countVote&getVoteResult - no voter", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(0));

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        await voteraVote.countVote(proposal);

        const voteResult = await voteraVote.getVoteResult(proposal);
        expect(voteResult.length).equal(3);
        for (let i = 0; i < 3; i += 1) {
            expect(voteResult[i]).equal(BigNumber.from(0));
        }
    });

    it("countVote: Ownable: caller is not the owner", async () => {
        invalidCaller = budgetManager;
        const invalidCallerVote = VoteraVoteFactory.connect(voteAddress, invalidCaller);
        await expect(invalidCallerVote.countVote(proposal)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("countVote: E001", async () => {
        await expect(voteraVote.countVote(InvalidProposal)).to.be.revertedWith("E001");
    });

    it("countVote: E002 - not initialized && duplicated call", async () => {
        await createFundVote();
        // state = CREATED
        await expect(voteraVote.countVote(proposal)).to.be.revertedWith("E002"); // not initialized

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        // state = SETTING
        await expect(voteraVote.countVote(proposal)).to.be.revertedWith("E002"); // not initialized
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // state = ASSESSING
        await expect(voteraVote.countVote(proposal)).to.be.revertedWith("E002"); // not initialized

        for (let i = 0; i < validators.length; i += 1) {
            const assessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await assessVote.submitAssess(proposal, [10, 10, 10, 10, 10]);
        }

        // wait until startAssess
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400 - 15000]);
        await network.provider.send("evm_mine");

        const voterCount = 5;
        const keys = validators.slice(0, voterCount).map((v) => v.address);
        const choices: number[] = [];
        const nonces: number[] = [];
        const commitments: string[] = [];
        const expectVoteCounts: number[] = [0, 0, 0];

        for (let i = 0; i < voterCount; i += 1) {
            const choice = i % 3;
            const nonce = i + 1;
            const commitment = await makeCommitment(voteAddress, proposal, validators[i].address, choice, nonce);
            const signature = await signCommitment(voteManager, proposal, validators[i].address, commitment);

            choices.push(choice);
            nonces.push(nonce);
            expectVoteCounts[choice] += 1;
            commitments.push(commitment);

            const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await ballotVote.submitBallot(proposal, commitment, signature);
        }

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(voterCount));

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        await voteraVote.revealBallot(proposal, keys, choices, nonces);

        await voteraVote.countVote(proposal);

        // state = FINISHED
        await expect(voteraVote.countVote(proposal)).to.be.revertedWith("E002"); // duplicated call
    });

    it("countVote: E002 - not revealed", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        const voterCount = 5;
        const keys = validators.slice(0, voterCount).map((v) => v.address);
        const choices: number[] = [];
        const nonces: number[] = [];
        const commitments: string[] = [];
        const expectVoteCounts: number[] = [0, 0, 0];

        for (let i = 0; i < voterCount; i += 1) {
            const choice = i % 3;
            const nonce = i + 1;
            const commitment = await makeCommitment(voteAddress, proposal, validators[i].address, choice, nonce);
            const signature = await signCommitment(voteManager, proposal, validators[i].address, commitment);

            choices.push(choice);
            nonces.push(nonce);
            expectVoteCounts[choice] += 1;
            commitments.push(commitment);

            const ballotVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await ballotVote.submitBallot(proposal, commitment, signature);
        }

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(voterCount));

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        await expect(voteraVote.countVote(proposal)).to.be.revertedWith("E002");

        const notYetKeys = keys.slice(1);
        const notYetChoices = choices.slice(1);
        const notYetNonces = nonces.slice(1);

        await voteraVote.revealBallot(proposal, notYetKeys, notYetChoices, notYetNonces);

        await expect(voteraVote.countVote(proposal)).to.be.revertedWith("E002");
    });

    it("countVote: E004", async () => {
        await createSystemVote();
        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        await expect(voteraVote.countVote(proposal)).to.be.revertedWith("E004");
    });

    it("getVoteResult: E001", async () => {
        await expect(voteraVote.getVoteResult(InvalidProposal)).to.be.revertedWith("E001");
    });

    it("getVoteResult: E002", async () => {
        await createFundVote();
        // state = CREATED
        await expect(voteraVote.getVoteResult(proposal)).to.be.revertedWith("E002"); // call without setupVoteInfo

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        // state = SETTING
        await expect(voteraVote.getVoteResult(proposal)).to.be.revertedWith("E002"); // call without setupVoteInfo

        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );
        // state = ASSESSING
        await expect(voteraVote.getVoteResult(proposal)).to.be.revertedWith("E002"); // call without setupVoteInfo

        for (let i = 0; i < validators.length; i += 1) {
            const assessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await assessVote.submitAssess(proposal, [10, 10, 10, 10, 10]);
        }

        // wait until startAssess
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        // state = RUNNING
        await expect(voteraVote.getVoteResult(proposal)).to.be.revertedWith("E002");

        // wait until startTime
        await network.provider.send("evm_increaseTime", [86400 - 15000]);
        await network.provider.send("evm_mine");

        // wait until endTime
        await network.provider.send("evm_increaseTime", [86400]);
        await network.provider.send("evm_mine");

        expect(await voteraVote.getBallotCount(proposal)).equal(BigNumber.from(0));

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        await expect(voteraVote.getVoteResult(proposal)).to.be.revertedWith("E002"); // call without countVote

        await voteraVote.countVote(proposal);

        const voteResult = await voteraVote.getVoteResult(proposal);
        expect(voteResult).to.eql(Array(3).fill(BigNumber.from(0)));
    });
});

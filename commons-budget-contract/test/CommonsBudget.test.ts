/* eslint-disable no-await-in-loop */
import chai, { expect } from "chai";
import crypto from "crypto";
import { solidity } from "ethereum-waffle";
import { BigNumber, BigNumberish, BytesLike, Wallet } from "ethers";
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
import { makeCommitment, signCommitment, signFundProposal, signSystemProposal } from "./VoteHelper";

const AddressZero = "0x0000000000000000000000000000000000000000";
const AddressNormal = "0xcD958D25697A04B0e55BF13c5ADE051beE046354";
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

describe("Test of Commons Budget Contract", () => {
    let contract: CommonsBudget;
    let storageContract: CommonsStorage;
    let voteraVote: VoteraVote;

    const basicFee = ethers.utils.parseEther("100.0");
    const fundAmount = ethers.utils.parseEther("10000.0");

    const assessCount = 2;
    const passAssessResult = [7, 7, 7, 7, 7];
    const rejectedAssessResult = [6, 6, 6, 6, 6];

    const { provider } = waffle;
    const [admin, voteManager, ...validators] = provider.getWallets();
    // set 1 million BOA for CommonsBudget contract
    const commonsFund = BigNumber.from(10).pow(18).mul(1000000);
    const adminSigner = provider.getSigner(admin.address);

    let proposal: string;

    let wrongSigner: Wallet;

    before(async () => {
        const commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");
        contract = await commonsBudgetFactory.connect(admin).deploy();
        await contract.deployed();

        const storageAddress = await contract.getStorageContractAddress();
        const storageFactory = await ethers.getContractFactory("CommonsStorage");
        storageContract = await storageFactory.attach(storageAddress);

        const voteraVoteFactory = await ethers.getContractFactory("VoteraVote");
        voteraVote = await voteraVoteFactory.connect(voteManager).deploy();
        await voteraVote.deployed();
        await voteraVote.changeCommonBudgetContract(contract.address);

        const voteAddress = voteraVote.address;
        const changeParamTx = await contract.changeVoteParam(voteManager.address, voteAddress);
        await changeParamTx.wait();
    });

    beforeEach(() => {
        proposal = `0x${crypto.randomBytes(32).toString("hex")}`;
    });

    it("isOwner", async () => {
        expect(await contract.isOwner(admin.address)).equal(true);
        expect(await contract.isOwner(voteManager.address)).equal(false);
        expect(await contract.isOwner(validators[0].address)).equal(false);
    });

    it("Not Enough Commons Budget Fund", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        await expect(
            validatorBudget.createFundProposal(
                proposal,
                toFundInput(title, startTime, endTime, startAssess, endAssess, DocHash, fundAmount),
                signProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("NotEnoughBudget");
    });

    it("Send", async () => {
        await provider.getSigner(admin.address).sendTransaction({
            to: contract.address,
            value: commonsFund,
        });
    });

    it("Check", async () => {
        const balance = await provider.getBalance(contract.address);
        assert.deepStrictEqual(balance, commonsFund);
    });

    it("Check Proposal Fee", async () => {
        const fundProposalFee = await storageContract.fundProposalFeePermil();
        assert.deepStrictEqual(fundProposalFee.toString(), "10");
        const systemProposalFe = await storageContract.systemProposalFee();
        assert.deepStrictEqual(systemProposalFe.toString(), "100000000000000000000");
    });

    it("Set Proposal Fee", async () => {
        const originalFeePermil = await storageContract.fundProposalFeePermil();
        const originalProposalFee = await storageContract.systemProposalFee();

        await storageContract.connect(adminSigner).setFundProposalFeePermil(20);
        await storageContract
            .connect(adminSigner)
            .setSystemProposalFee(BigNumber.from(500).mul(BigNumber.from(10).pow(18)));

        const fundProposalFee = await storageContract.fundProposalFeePermil();
        assert.deepStrictEqual(fundProposalFee.toString(), "20");
        const systemProposalFe = await storageContract.systemProposalFee();
        assert.deepStrictEqual(systemProposalFe.toString(), "500000000000000000000");

        await storageContract.connect(adminSigner).setFundProposalFeePermil(originalFeePermil);
        await storageContract.connect(adminSigner).setSystemProposalFee(originalProposalFee);
    });

    it("Check Quorum Factor", async () => {
        const factor = await storageContract.voteQuorumFactor();
        assert.deepStrictEqual(factor, 333333);
    });

    it("Set Quorum Factor", async () => {
        await storageContract.connect(adminSigner).setVoteQuorumFactor(200000);
        const factor = await storageContract.voteQuorumFactor();
        assert.deepStrictEqual(factor, 200000);
    });

    it("Set Invalid Quorum Factor", async () => {
        await expect(storageContract.connect(adminSigner).setVoteQuorumFactor(3333333)).to.be.revertedWith(
            "InvalidInput"
        );
        await expect(storageContract.connect(adminSigner).setVoteQuorumFactor(0)).to.be.revertedWith("InvalidInput");
    });

    it("Set Voter Fee", async () => {
        await storageContract.connect(adminSigner).setVoterFee(300000000000000);
        const voterFee = await storageContract.voterFee();
        assert.deepStrictEqual(voterFee.toNumber(), 300000000000000);
    });

    it("changeVoteParam", async () => {
        const commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");
        const testContract = await commonsBudgetFactory.deploy();
        await testContract.deployed();

        const storageAddress = await testContract.getStorageContractAddress();
        const storageFactory = await ethers.getContractFactory("CommonsStorage");
        storageContract = await storageFactory.attach(storageAddress);

        await testContract.changeVoteParam(admin.address, contract.address);
        expect(await storageContract.voteManager()).equal(admin.address);
        expect(await storageContract.voteAddress()).equal(contract.address);
    });

    it("changeVoteParam: Ownable: caller is not the owner", async () => {
        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        await expect(voteBudget.changeVoteParam(validators[0].address, AddressNormal)).to.be.revertedWith(
            "Ownable: caller is not the owner"
        );
    });

    it("changeVoteParam: InvalidInput", async () => {
        await expect(contract.changeVoteParam(AddressZero, AddressNormal)).to.be.revertedWith("InvalidInput");
        await expect(contract.changeVoteParam(AddressNormal, AddressZero)).to.be.revertedWith("InvalidInput");
    });

    it("createSystemProposal", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "SystemProposalTitle";
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
        const docHash = DocHash;
        const signProposal = await signSystemProposal(voteManager, proposal, title, startTime, endTime, docHash);

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createSystemProposal(
            proposal,
            toSystemInput(title, startTime, endTime, docHash),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const proposalData = await contract.getProposalData(proposal);
        expect(proposalData.state, "CREATED state").equal(1); // CREATED state
        expect(proposalData.proposalType, "SYSTEM type").equal(0); // SYSTEM type
        expect(proposalData.title).equal("SystemProposalTitle");
        expect(proposalData.start).equal(startTime);
        expect(proposalData.end).equal(endTime);
        expect(proposalData.docHash).equal(docHash);
        expect(proposalData.fundAmount).equal(BigNumber.from(0));
        expect(proposalData.proposer).equal(validators[0].address);
        expect(proposalData.validatorSize).equal(BigNumber.from(0));

        expect(await contract.getProposalValues(proposal)).equal(basicFee);

        // make sure proposal is initialized in voteraVote
        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        const { voteAddress } = await voteBudget.getProposalData(proposal);
        expect(voteAddress).equal(voteraVote.address);

        const voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.commonsBudgetAddress).equal(contract.address);
    });

    it("createSystemProposal: InvalidFee", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "SystemProposalTitle";
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
        const docHash = DocHash;
        const signProposal = await signSystemProposal(voteManager, proposal, title, startTime, endTime, docHash);

        // call without fee
        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        await expect(
            validatorBudget.createSystemProposal(
                proposal,
                toSystemInput(title, startTime, endTime, docHash),
                signProposal
            )
        ).to.be.revertedWith("InvalidFee");
    });

    it("createSystemProposal: InvalidInput - (startTime, endTime)", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "SystemProposalTitle";
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
        const docHash = DocHash;
        const signProposal = await signSystemProposal(voteManager, proposal, title, startTime, endTime, docHash);

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const wrongStartTime = 0;
        await expect(
            validatorBudget.createSystemProposal(
                proposal,
                toSystemInput(title, wrongStartTime, endTime, docHash),
                signProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("InvalidInput");
        const wrongEndTime = startTime - 100;
        await expect(
            validatorBudget.createSystemProposal(
                proposal,
                toSystemInput(title, startTime, wrongEndTime, docHash),
                signProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("InvalidInput");
    });

    it("createSystemProposal: AlreadyExistProposal", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "SystemProposalTitle";
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
        const docHash = DocHash;
        const signProposal = await signSystemProposal(voteManager, proposal, title, startTime, endTime, docHash);

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        await validatorBudget.createSystemProposal(
            proposal,
            toSystemInput(title, startTime, endTime, docHash),
            signProposal,
            { value: basicFee }
        );

        // call again with same proposal
        await expect(
            validatorBudget.createSystemProposal(
                proposal,
                toSystemInput(title, startTime, endTime, docHash),
                signProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("AlreadyExistProposal");
    });

    it("createSystemProposal: InvalidInput - without initializing", async () => {
        const newFactory = await ethers.getContractFactory("CommonsBudget");
        const newContract = await newFactory.deploy();
        await newContract.deployed();

        const title = "SystemProposalTitle";
        const blockLatest = await ethers.provider.getBlock("latest");
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
        const docHash = DocHash;
        const signProposal = await signSystemProposal(voteManager, proposal, title, startTime, endTime, docHash);

        // call createSystemProposal without initializing changeVoteParam of contract
        const validatorBudget = CommonsBudgetFactory.connect(newContract.address, validators[0]);
        await expect(
            validatorBudget.createSystemProposal(
                proposal,
                toSystemInput(title, startTime, endTime, docHash),
                signProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("InvalidInput");
    });

    it("createSystemProposal: InvalidInput - invalid signature", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "SystemProposalTitle";
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
        const docHash = DocHash;
        const signProposal = await signSystemProposal(voteManager, proposal, title, startTime, endTime, docHash);

        const wrongTitle = "WrongProposalTitle";

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        await expect(
            validatorBudget.createSystemProposal(
                proposal,
                toSystemInput(wrongTitle, startTime, endTime, docHash),
                signProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("InvalidInput");

        wrongSigner = admin;
        const wrongSignProposal = await signSystemProposal(wrongSigner, proposal, title, startTime, endTime, docHash);
        await expect(
            validatorBudget.createSystemProposal(
                proposal,
                toSystemInput(title, startTime, endTime, docHash),
                wrongSignProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("InvalidInput");
    });

    it("createFundProposal", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const proposalData = await contract.getProposalData(proposal);
        expect(proposalData.state, "CREATE state").equal(1); // CREATE state
        expect(proposalData.proposalType, "FUND type").equal(1); // FUND type
        expect(proposalData.title).equal("FundProposalTitle");
        expect(proposalData.start).equal(startTime);
        expect(proposalData.end).equal(endTime);
        expect(proposalData.docHash).equal(docHash);
        expect(proposalData.fundAmount).equal(fundAmount);
        expect(proposalData.proposer).equal(proposer);
        expect(proposalData.validatorSize).equal(BigNumber.from(0));

        expect(await contract.getProposalValues(proposal)).equal(basicFee);

        // make sure proposal is initialized in voteraVote
        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);

        const { voteAddress } = await voteBudget.getProposalData(proposal);
        expect(voteAddress).equal(voteraVote.address);

        const voteInfo = await voteraVote.voteInfos(proposal);
        expect(voteInfo.commonsBudgetAddress).equal(contract.address);
    });

    it("createFundProposal: InvalidFee (NoFee)", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        // call without fee
        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        await expect(
            validatorBudget.createFundProposal(
                proposal,
                toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
                signProposal
            )
        ).to.be.revertedWith("InvalidFee");
    });

    it("createFundProposal: InvalidFee (SmallFee)", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
        const docHash = DocHash;
        const proposer = validators[0].address;
        const feePermil = await storageContract.fundProposalFeePermil();
        const wantedFee = fundAmount.mul(feePermil).div(1000);
        const wrongFee = wantedFee.div(2);
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

        // call without fee
        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        await expect(
            validatorBudget.createFundProposal(
                proposal,
                toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
                signProposal,
                { value: wrongFee }
            )
        ).to.be.revertedWith("InvalidFee");
    });

    it("createFundProposal: InvalidInput (invalid signer)", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
        const docHash = DocHash;
        const wrongProposer = validators[1].address;
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
            wrongProposer
        );

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        await expect(
            validatorBudget.createFundProposal(
                proposal,
                toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
                signProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("InvalidInput");
    });

    it("createFundProposal: InvalidInput", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
        const docHash = DocHash;
        const proposer = validators[0].address;

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const wrongStartTime = 0;
        const signWrongStartTime = await signFundProposal(
            voteManager,
            proposal,
            title,
            wrongStartTime,
            endTime,
            startAssess,
            endAssess,
            docHash,
            fundAmount,
            proposer
        );
        await expect(
            validatorBudget.createFundProposal(
                proposal,
                toFundInput(title, wrongStartTime, endTime, startAssess, endAssess, docHash, fundAmount),
                signWrongStartTime,
                { value: basicFee }
            )
        ).to.be.revertedWith("InvalidInput");
        const wrongEndTime = startTime - 100;
        const signWrongEndTime = await signFundProposal(
            voteManager,
            proposal,
            title,
            startTime,
            wrongEndTime,
            startAssess,
            endAssess,
            docHash,
            fundAmount,
            proposer
        );
        await expect(
            validatorBudget.createFundProposal(
                proposal,
                toFundInput(title, startTime, wrongEndTime, startAssess, endAssess, docHash, fundAmount),
                signWrongEndTime,
                { value: basicFee }
            )
        ).to.be.revertedWith("InvalidInput");
    });

    it("createFundProposal: AlreadyExistProposal", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );

        // call again with same proposal
        await expect(
            validatorBudget.createFundProposal(
                proposal,
                toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
                signProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("AlreadyExistProposal");
    });

    it("createFundProposal: InvalidInput - without initializing", async () => {
        const newFactory = await ethers.getContractFactory("CommonsBudget");
        const newContract = await newFactory.deploy();
        await newContract.deployed();

        // send 100,000 BOA from `admin` to the new CommonsBudget contract
        const newAmount = BigNumber.from(10).pow(18).mul(100000);
        await provider.getSigner(admin.address).sendTransaction({
            to: newContract.address,
            value: newAmount,
        });

        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        // call createFundProposal without initializing changeVoteParam of contract

        const validatorBudget = CommonsBudgetFactory.connect(newContract.address, validators[0]);
        await expect(
            validatorBudget.createFundProposal(
                proposal,
                toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
                signProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("InvalidInput");
    });

    it("createFundProposal: InvalidInput - invalid proposal signature", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const wrongTitle = "WrongProposalTitle";

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        await expect(
            validatorBudget.createFundProposal(
                proposal,
                toFundInput(wrongTitle, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
                signProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("InvalidInput");

        wrongSigner = admin;
        const wrongSignProposal = await signFundProposal(
            wrongSigner,
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
        await expect(
            validatorBudget.createFundProposal(
                proposal,
                toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
                wrongSignProposal,
                { value: basicFee }
            )
        ).to.be.revertedWith("InvalidInput");
    });

    const recordVote = async (voteAddress: string, countVote: boolean, passAssess?: boolean): Promise<number[]> => {
        const proposalData = await contract.getProposalData(proposal);
        const startTime = proposalData.start;
        const endTime = proposalData.end;
        const openTime = endTime.add(30);

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        if (passAssess !== undefined) {
            const assessResult = passAssess ? passAssessResult : rejectedAssessResult;
            for (let i = 0; i < assessCount; i += 1) {
                const assessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
                await assessVote.submitAssess(proposal, assessResult);
            }

            // wait unit assessEnd
            await network.provider.send("evm_increaseTime", [15000]);
            await network.provider.send("evm_mine");

            await voteraVote.countAssess(proposal);

            if (!passAssess) {
                return [];
            }

            // wait until startTime
            await network.provider.send("evm_increaseTime", [15000]);
            await network.provider.send("evm_mine");
        } else {
            // wait until startTime
            await network.provider.send("evm_increaseTime", [30000]);
            await network.provider.send("evm_mine");
        }

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

        if (!countVote) {
            return expectVoteCounts;
        }

        await network.provider.send("evm_increaseTime", [30000]);
        await network.provider.send("evm_mine");

        for (let i = 0; i < voterCount; i += 1) {
            const ballotAddr = await voteraVote.getBallotAt(proposal, i);
            const ballot = await voteraVote.getBallot(proposal, ballotAddr);
            expect(ballot.key).equal(validators[i].address);
        }

        // wait until openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        await voteraVote.revealBallot(
            proposal,
            validators.slice(0, voterCount).map((v) => v.address),
            choices,
            nonces
        );
        await voteraVote.countVote(proposal);

        return expectVoteCounts;
    };

    it("assessProposal: accepted", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const { voteAddress } = await contract.getProposalData(proposal);
        const expectVoteCounts = await recordVote(voteAddress, false, true);

        const proposalData = await contract.getProposalData(proposal);
        expect(proposalData.state, "ACCEPTED state").equal(3); // ACCEPTED
        expect(proposalData.assessParticipantSize).equal(BigNumber.from(assessCount));
        expect(proposalData.assessData).eql(passAssessResult.map((v) => BigNumber.from(v * assessCount)));
    });

    it("assessProposal: rejected by score - total averge 7", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const { voteAddress } = await contract.getProposalData(proposal);
        const expectVoteCounts = await recordVote(voteAddress, false, false);

        const proposalData = await contract.getProposalData(proposal);
        expect(proposalData.state, "REJECTED state").equal(2); // REJECTED
        expect(proposalData.assessParticipantSize).equal(BigNumber.from(assessCount));
        expect(proposalData.assessData).eql(rejectedAssessResult.map((v) => BigNumber.from(v * assessCount)));
    });

    it("assessProposal: rejected by score - average 5 for each", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );

        const { voteAddress } = await contract.getProposalData(proposal);

        const openTime = endTime + 30;

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        for (let i = 0; i < validators.length; i += 1) {
            const assessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await assessVote.submitAssess(proposal, [10, 10, 4, 10, 10]);
        }

        // wait until startTime
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        const proposalData = await contract.getProposalData(proposal);
        expect(proposalData.state, "REJECTED state").equal(2); // REJECTED
    });

    it("assessProposal: rejected - none assess", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, endTime + 30, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        // wait unit assessEnd
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await voteraVote.countAssess(proposal);

        const proposalData = await contract.getProposalData(proposal);
        expect(proposalData.state, "REJECTED state").equal(2); // REJECTED
        expect(proposalData.assessParticipantSize).equal(0);
        expect(proposalData.assessData).eql(Array(5).fill(BigNumber.from(0)));
    });

    it("assessProposal: NotFoundProposal", async () => {
        const assessParticipantSize = 10;
        const assessResult = Array<BigNumber>(5).fill(BigNumber.from(100));

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        await expect(
            voteBudget.assessProposal(proposal, assessParticipantSize, assessParticipantSize, assessResult)
        ).to.be.revertedWith("NotFoundProposal");
    });

    it("assessProposal: InvalidProposal - System proposal", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "SystemProposalTitle";
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
        const docHash = DocHash;
        const signProposal = await signSystemProposal(voteManager, proposal, title, startTime, endTime, docHash);

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        await validatorBudget.createSystemProposal(
            proposal,
            toSystemInput(title, startTime, endTime, docHash),
            signProposal,
            { value: basicFee }
        );

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        await expect(voteBudget.assessProposal(proposal, 1, 1, [10, 10, 10, 10, 10])).to.be.revertedWith(
            "InvalidProposal"
        );
    });

    it("assessProposal: AlreadyFinishedAssessment - FINISHED", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const { voteAddress } = await contract.getProposalData(proposal);
        const expectVoteCounts = await recordVote(voteAddress, true, true);

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        await expect(voteBudget.assessProposal(proposal, 1, 1, [10, 10, 10, 10, 10])).to.be.revertedWith(
            "AlreadyFinishedAssessment"
        );
    });

    it("assessProposal: AlreadyFinishedAssessment - REJECTED", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const { voteAddress } = await contract.getProposalData(proposal);
        const expectVoteCounts = await recordVote(voteAddress, false, false);

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        await expect(voteBudget.assessProposal(proposal, 1, 1, [10, 10, 10, 10, 10])).to.be.revertedWith(
            "AlreadyFinishedAssessment"
        );
    });

    it("assessProposal: AlreadyFinishedAssessment - ACCEPTED", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const { voteAddress } = await contract.getProposalData(proposal);
        const expectVoteCounts = await recordVote(voteAddress, false, true);

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        await expect(voteBudget.assessProposal(proposal, 1, 1, [10, 10, 10, 10, 10])).to.be.revertedWith(
            "AlreadyFinishedAssessment"
        );
    });

    it("assessProposal: TooLate - assessProposal after vote start", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        await voteraVote.setupVoteInfo(proposal, startTime, endTime, endTime + 30, "info");
        await voteraVote.addValidators(
            proposal,
            validators.map((v) => v.address),
            true
        );

        const { voteAddress } = await contract.getProposalData(proposal);

        const assessResult = [10, 10, 10, 10, 10];
        for (let i = 0; i < assessCount; i += 1) {
            const assessVote = VoteraVoteFactory.connect(voteAddress, validators[i]);
            await assessVote.submitAssess(proposal, assessResult);
        }

        // wait until startTime
        await network.provider.send("evm_increaseTime", [30000]);
        await network.provider.send("evm_mine");

        await expect(voteraVote.countAssess(proposal)).to.be.revertedWith("TooLate");
    });

    it("assessProposal: NotAuthorized", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        // wait unit assessEnd
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        await expect(voteBudget.assessProposal(proposal, 1, 1, [10, 10, 10, 10, 10])).to.be.revertedWith(
            "NotAuthorized"
        );
        await expect(contract.assessProposal(proposal, 1, 1, [10, 10, 10, 10, 10])).to.be.revertedWith("NotAuthorized");
        await expect(validatorBudget.assessProposal(proposal, 1, 1, [10, 10, 10, 10, 10])).to.be.revertedWith(
            "NotAuthorized"
        );
    });

    it("finishVote - system proposal", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "SystemProposalTitle";
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
        const docHash = DocHash;
        const signProposal = await signSystemProposal(voteManager, proposal, title, startTime, endTime, docHash);

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createSystemProposal(
            proposal,
            toSystemInput(title, startTime, endTime, docHash),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        const { voteAddress } = await voteBudget.getProposalData(proposal);

        const expectedCounts = await recordVote(voteAddress, true, undefined);

        const proposalData = await contract.getProposalData(proposal);
        expect(proposalData.state, "FINISHED state").equal(4); // FINISHED
        expect(proposalData.validatorSize).equal(BigNumber.from(validators.length));
        expect(proposalData.voteResult).to.eql(expectedCounts.map((v) => BigNumber.from(v)));
    });

    it("finishVote - fund proposal", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        const { voteAddress } = await voteBudget.getProposalData(proposal);

        const expectedCounts = await recordVote(voteAddress, true, true);

        const proposalData = await contract.getProposalData(proposal);
        expect(proposalData.state, "FINISHED state").equal(4); // FINISHED
        expect(proposalData.validatorSize).equal(BigNumber.from(validators.length));
        expect(proposalData.voteResult).to.eql(expectedCounts.map((v) => BigNumber.from(v)));
    });

    it("finishVote: NotFoundProposal", async () => {
        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        const validatorCount = 9;
        await expect(voteBudget.finishVote(proposal, validatorCount, [3, 3, 3])).to.be.revertedWith("NotFoundProposal");
    });

    it("finishVote: AlreadyFinishedProposal", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const { voteAddress } = await contract.getProposalData(proposal);
        const expectVoteCounts = await recordVote(voteAddress, true, true);

        const validatorCount = await voteraVote.getValidatorCount(proposal);
        const voteResult = await voteraVote.getVoteResult(proposal);

        for (let i = 0; i < 3; i += 1) {
            expect(voteResult[i]).equal(BigNumber.from(expectVoteCounts[i]));
        }

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        await expect(
            voteBudget.finishVote(proposal, validatorCount, [voteResult[0], voteResult[1], voteResult[2]])
        ).to.be.revertedWith("AlreadyFinishedProposal");
    });

    it("finishVote: RejectedProposal", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const { voteAddress } = await contract.getProposalData(proposal);
        await recordVote(voteAddress, true, false);

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);

        const validatorCount = 9;
        await expect(voteBudget.finishVote(proposal, validatorCount, [3, 3, 3])).to.be.revertedWith("RejectedProposal");
    });

    it("finishVote: NoAssessment", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);

        const validatorCount = 9;
        await expect(voteBudget.finishVote(proposal, validatorCount, [3, 3, 3])).to.be.revertedWith("NoAssessment");
    });

    it("finishVote: NotEndProposal", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const { voteAddress } = await contract.getProposalData(proposal);
        await recordVote(voteAddress, false, true);

        const voteBudget = CommonsBudgetFactory.connect(contract.address, voteManager);
        const validatorCount = 9;
        await expect(voteBudget.finishVote(proposal, validatorCount, [3, 3, 3])).to.be.revertedWith("NotEndProposal");
    });

    it("finishVote: NotAuthorized", async () => {
        const blockLatest = await ethers.provider.getBlock("latest");
        const title = "FundProposalTitle";
        const startAssess = blockLatest.timestamp;
        const endAssess = startAssess + 15000;
        const startTime = blockLatest.timestamp + 30000;
        const endTime = startTime + 30000;
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

        const validatorBudget = CommonsBudgetFactory.connect(contract.address, validators[0]);
        const makeProposalTx = await validatorBudget.createFundProposal(
            proposal,
            toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
            signProposal,
            { value: basicFee }
        );
        await makeProposalTx.wait();

        const { voteAddress } = await contract.getProposalData(proposal);
        const expectVoteCounts = await recordVote(voteAddress, false, true);

        // wait for endTime
        await network.provider.send("evm_increaseTime", [30000]);
        await network.provider.send("evm_mine");

        // wait for openTime
        await network.provider.send("evm_increaseTime", [30]);
        await network.provider.send("evm_mine");

        const validatorCount = await voteraVote.getValidatorCount(proposal);

        await expect(
            contract.finishVote(proposal, validatorCount, [
                expectVoteCounts[0],
                expectVoteCounts[1],
                expectVoteCounts[2],
            ])
        ).to.be.revertedWith("NotAuthorized");
        await expect(
            validatorBudget.finishVote(proposal, validatorCount, [
                expectVoteCounts[0],
                expectVoteCounts[1],
                expectVoteCounts[2],
            ])
        ).to.be.revertedWith("NotAuthorized");
    });
});

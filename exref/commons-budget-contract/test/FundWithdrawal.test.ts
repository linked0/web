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
    countVote,
    countVoteResult,
    createFundProposal,
    createSystemProposal,
    makeCommitment,
    setEnvironment,
    signCommitment,
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

async function displayBalance(address: string, message: string) {
    const balance = await ethers.provider.getBalance(address);
    console.log(`${message}_balance = ${balance.toString()}`);
}

describe("Test of Fund Withdrawal", () => {
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

        // send 1 million BOA to CommonsBudget contract
        const commonsFund = BigNumber.from(10).pow(18).mul(500000);
        for (let i = 0; i < 2; i++) {
            await provider.getSigner(validators[i].address).sendTransaction({
                to: commonsBudget.address,
                value: commonsFund,
            });
        }
    });

    beforeEach(() => {
        // generate random proposal id (which is address type)
        proposalID = getNewProposal();
    });

    it("Withdrawal: Unable to withdraw due to W02", async () => {
        await createSystemProposal(proposalID, proposer, DocHash, basicFee);

        // "W02" : The proposal is not a fund proposal
        const proposerBudget = CommonsBudgetFactory.connect(commonsBudget.address, validators[0]);
        const [stateCode, _] = await proposerBudget.checkWithdrawState(proposalID);
        expect(stateCode).equals("W02");
        await expect(proposerBudget.withdraw(proposalID)).to.revertedWith("W02");
    });

    it("Withdrawal: Unable to withdraw due to W01, W04, W05, W06", async () => {
        const proposerBudget = CommonsBudgetFactory.connect(commonsBudget.address, validators[0]);
        const fakeValidatorBudget = CommonsBudgetFactory.connect(commonsBudget.address, validators[1]);

        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        await assessProposal(proposalID, true);

        // "W01" : There's no proposal for the proposal ID
        let [stateCode, _] = await proposerBudget.checkWithdrawState(InvalidProposal);
        expect(stateCode).equals("W01");
        await expect(commonsBudget.withdraw(InvalidProposal)).to.revertedWith("W01");

        // "W04" : The vote counting is not yet complete
        [stateCode, _] = await proposerBudget.checkWithdrawState(proposalID);
        expect(stateCode).equals("W04");
        await expect(commonsBudget.withdraw(proposalID)).to.revertedWith("W04");

        // Vote counting finished with rejection
        await countVoteResult(proposalID, false);

        // "W05" : The requester of the funding is not the proposer
        [stateCode, _] = await fakeValidatorBudget.checkWithdrawState(proposalID);
        expect(stateCode).equals("W05");
        await expect(fakeValidatorBudget.withdraw(proposalID)).to.revertedWith("W05");

        // "W06" : The proposal has come to invalid or been rejected
        [stateCode, _] = await proposerBudget.checkWithdrawState(proposalID);
        expect(stateCode).equals("W06");
        await expect(proposerBudget.withdraw(proposalID)).to.revertedWith("W06");
    });

    it("Withdrawal: First unable to withdraw due to W07 but finally can do", async () => {
        const proposerBudget = CommonsBudgetFactory.connect(commonsBudget.address, validators[0]);
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        await assessProposal(proposalID, true);

        // Vote counting finished with approval
        await countVoteResult(proposalID, true);

        // "W07" : 24 hours has not passed after the voting finished
        let [stateCode, _] = await proposerBudget.checkWithdrawState(proposalID);
        expect(stateCode).equals("W07");
        await expect(proposerBudget.withdraw(proposalID)).to.revertedWith("W07");

        // 12 hours passed
        await network.provider.send("evm_increaseTime", [43200]);
        await network.provider.send("evm_mine");

        // "W07" again
        [stateCode, _] = await proposerBudget.checkWithdrawState(proposalID);
        expect(stateCode).equals("W07");
        await expect(proposerBudget.withdraw(proposalID)).to.revertedWith("W07");

        // 12 hours passed
        await network.provider.send("evm_increaseTime", [43200]);
        await network.provider.send("evm_mine");

        let prevBalance = await ethers.provider.getBalance(validators[0].address);
        prevBalance = prevBalance.div(BigNumber.from(10).pow(18));
        const requestedFund = fundAmount.div(BigNumber.from(10).pow(18));

        // Withdrawal success and check the proposer's balance
        await expect(proposerBudget.withdraw(proposalID)).to.emit(proposerBudget, "FundTransfer").withArgs(proposalID);

        let curBalance = await ethers.provider.getBalance(validators[0].address);
        curBalance = curBalance.div(BigNumber.from(10).pow(18));
        expect(curBalance.sub(prevBalance)).equal(requestedFund);

        // "W09" : The funds is already withdrawn
        [stateCode, _] = await proposerBudget.checkWithdrawState(proposalID);
        expect(stateCode).equals("W09");
        await expect(proposerBudget.withdraw(proposalID)).to.revertedWith("W09");
    });

    it("Withdrawal: Refuse funding with UNAUTHORIZED", async () => {
        const proposerBudget = CommonsBudgetFactory.connect(commonsBudget.address, validators[0]);
        await createSystemProposal(proposalID, proposer, DocHash, basicFee);
        await assessProposal(proposalID, true);

        // Vote counting finished with approval
        await countVoteResult(proposalID, true);

        // refuse funding
        await expect(proposerBudget.refuseFunding(proposalID)).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Withdrawal: Refuse funding for a system proposal", async () => {
        await createSystemProposal(proposalID, proposer, DocHash, basicFee);
        await assessProposal(proposalID, true);

        // Vote counting finished with approval
        await countVoteResult(proposalID, true);

        // refuse funding
        await expect(commonsBudget.refuseFunding(proposalID)).to.be.revertedWith("InvalidProposal");
    });

    it("Withdrawal: Refuse funding", async () => {
        const proposerBudget = CommonsBudgetFactory.connect(commonsBudget.address, validators[0]);
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        await assessProposal(proposalID, true);

        // Vote counting finished with approval
        await countVoteResult(proposalID, true);

        // 12 hours passed
        await network.provider.send("evm_increaseTime", [43200]);
        await network.provider.send("evm_mine");

        // refuse funding
        await commonsBudget.refuseFunding(proposalID);

        // 12 hours passed
        await network.provider.send("evm_increaseTime", [43200]);
        await network.provider.send("evm_mine");

        // funding refused with status of W08: The withdrawal of the funds was refused
        const [stateCode, _] = await proposerBudget.checkWithdrawState(proposalID);
        expect(stateCode).equals("W08");
    });

    it("Withdrawal: Allow funding after refusing and try to refuse again after funding", async () => {
        const proposerBudget = CommonsBudgetFactory.connect(commonsBudget.address, validators[0]);
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        await assessProposal(proposalID, true);

        // Vote counting finished with approval
        await countVoteResult(proposalID, true);

        // 12 hours passed
        await network.provider.send("evm_increaseTime", [43200]);
        await network.provider.send("evm_mine");

        // refuse funding
        await expect(commonsBudget.refuseFunding(proposalID))
            .to.emit(proposerBudget, "FundWithdrawRefuse")
            .withArgs(proposalID);

        // 6 hours passed
        await network.provider.send("evm_increaseTime", [21600]);
        await network.provider.send("evm_mine");

        // allow funding
        await expect(commonsBudget.allowFunding(proposalID))
            .to.emit(proposerBudget, "FundWithdrawAllow")
            .withArgs(proposalID);

        // 6 hours passed(= 24 hours passed after vote counting)
        await network.provider.send("evm_increaseTime", [21600]);
        await network.provider.send("evm_mine");

        // check status of W00: The fund can be withdrawn
        const [stateCode, _] = await proposerBudget.checkWithdrawState(proposalID);
        expect(stateCode).equals("W00");

        // 6 hours passed
        await network.provider.send("evm_increaseTime", [21600]);
        await network.provider.send("evm_mine");

        // refuse funding after 24 hours passed
        await expect(commonsBudget.refuseFunding(proposalID)).to.be.revertedWith("InvalidTime");

        // succeed to withdraw
        await expect(proposerBudget.withdraw(proposalID)).to.emit(proposerBudget, "FundTransfer").withArgs(proposalID);

        // refuse funding after withdrawn
        await expect(commonsBudget.refuseFunding(proposalID)).to.be.revertedWith("W09");
    });

    it("Withdrawal: Owner can allow funding anytime after refusing", async () => {
        const proposerBudget = CommonsBudgetFactory.connect(commonsBudget.address, validators[0]);
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        await assessProposal(proposalID, true);

        // Vote counting finished with approval
        await countVoteResult(proposalID, true);

        // 12 hours passed
        await network.provider.send("evm_increaseTime", [43200]);
        await network.provider.send("evm_mine");

        // refuse funding
        await commonsBudget.refuseFunding(proposalID);

        // 12 hours passed
        await network.provider.send("evm_increaseTime", [43200]);
        await network.provider.send("evm_mine");

        // check status of W08: The fund can NOT be withdrawn
        const [stateCode, _] = await proposerBudget.checkWithdrawState(proposalID);
        expect(stateCode).equals("W08");

        // 48 hours passed
        await network.provider.send("evm_increaseTime", [172800]);
        await network.provider.send("evm_mine");

        // Owner can allow funding any time
        await commonsBudget.allowFunding(proposalID);

        // succeed to withdraw
        await expect(proposerBudget.withdraw(proposalID)).to.emit(proposerBudget, "FundTransfer").withArgs(proposalID);
    });
});

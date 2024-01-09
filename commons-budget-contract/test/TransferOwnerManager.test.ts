import chai, { assert, expect } from "chai";
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

describe("Test for the change of the owner or the manager", () => {
    let commonsBudget: CommonsBudget;
    let commonsStorage: CommonsStorage;
    let voteraVote: VoteraVote;

    let commonsBudgetFactory: CommonsBudgetFactory;
    let storageFactory: CommonsStorageFactory;
    let voteraVoteFactory: VoteraVoteFactory;

    const { provider } = waffle;
    const [deployer, admin, manager, voteraManager, ...validators] = provider.getWallets();
    const basicFee = ethers.utils.parseEther("100.0");
    const fundAmount = ethers.utils.parseEther("10000.0");

    let proposalID: string;
    const proposer: Wallet = validators[0];

    before(async () => {
        // deploy CommonsBudget
        commonsBudgetFactory = await ethers.getContractFactory("CommonsBudget");
        commonsBudget = await commonsBudgetFactory.connect(deployer).deploy();
        await commonsBudget.deployed();

        storageFactory = await ethers.getContractFactory("CommonsStorage");
        const storageAddress = await commonsBudget.getStorageContractAddress();
        commonsStorage = await storageFactory.attach(storageAddress);

        // deploy VoteraVote
        voteraVoteFactory = await ethers.getContractFactory("VoteraVote");
        voteraVote = await voteraVoteFactory.connect(voteraManager).deploy();
        await voteraVote.deployed();

        await voteraVote.changeCommonBudgetContract(commonsBudget.address);
        const changeParamTx = await commonsBudget.changeVoteParam(voteraManager.address, voteraVote.address);
        await changeParamTx.wait();

        // set information about network, contract, and validators in helper module
        await setEnvironment(provider, commonsBudget, voteraVote, admin, voteraManager, validators);

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

    it("Only admin can set the policy variables with ownership transferred", async () => {
        await commonsBudget.transferOwnership(admin.address);

        await expect(commonsStorage.setFundProposalFeePermil(10)).to.be.revertedWith("NotAuthorized");
        await expect(commonsStorage.setSystemProposalFee(BigNumber.from(100))).to.be.revertedWith("NotAuthorized");
        await expect(commonsStorage.setVoteQuorumFactor(333333)).to.be.revertedWith("NotAuthorized");
        await expect(commonsStorage.setVoterFee(400000000000000)).to.be.revertedWith("NotAuthorized");

        await commonsStorage.connect(admin).setFundProposalFeePermil(10);
        await commonsStorage.connect(admin).setSystemProposalFee(BigNumber.from(100));
        await commonsStorage.connect(admin).setVoteQuorumFactor(333333);
        await commonsStorage.connect(admin).setVoterFee(400000000000000);

        // reset the ownership of the CommonsBudget to deployer for the next test
        await commonsBudget.connect(admin).transferOwnership(deployer.address);
    });

    it("Only admin can refuse funding with ownership transferred", async () => {
        // create proposal
        const proposerBudget = CommonsBudgetFactory.connect(commonsBudget.address, validators[0]);
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        await assessProposal(proposalID, true);

        // Vote counting finished with approval
        await countVoteResult(proposalID, true);

        // Transfer the ownership to admin
        await commonsBudget.transferOwnership(admin.address);

        // 12 hours passed
        await network.provider.send("evm_increaseTime", [43200]);
        await network.provider.send("evm_mine");

        // refuse funding
        await expect(commonsBudget.refuseFunding(proposalID)).to.revertedWith("Ownable: caller is not the owner");
        await commonsBudget.connect(admin).refuseFunding(proposalID);

        // allow funding
        await expect(commonsBudget.allowFunding(proposalID)).to.revertedWith("Ownable: caller is not the owner");
        await commonsBudget.connect(admin).refuseFunding(proposalID);

        // reset the ownership of the CommonsBudget to deployer for the next test
        await commonsBudget.connect(admin).transferOwnership(deployer.address);
    });

    it("Change the manager of the CommonsBudget", async () => {
        const oldManager = await commonsBudget.manager();
        await commonsBudget.setManager(manager.address);
        const storedManager = await commonsBudget.manager();
        assert.deepStrictEqual(storedManager, manager.address);

        // transfer the ownership to admin
        await commonsBudget.transferOwnership(admin.address);

        // set new manager
        await commonsBudget.connect(admin).setManager(validators[0].address);
        expect(await commonsBudget.manager()).to.equal(validators[0].address);
        expect(await commonsBudget.isManager(validators[0].address)).equal(true);
        expect(await commonsBudget.isManager(oldManager)).equal(false);

        // reset the ownership of the CommonsBudget to deployer for the next test
        await commonsBudget.connect(admin).transferOwnership(deployer.address);
    });

    it("Distribute vote fees by new manager", async () => {
        await createFundProposal(proposalID, proposer, DocHash, basicFee, fundAmount);
        const proposalData = await commonsBudget.getProposalData(proposalID);
        const startTime = proposalData.start;
        const endTime = proposalData.end;
        const openTime = endTime.add(30);

        await voteraVote.setupVoteInfo(proposalID, startTime, endTime, openTime, "info");
        await voteraVote.addValidators(
            proposalID,
            validators.map((v) => v.address),
            true
        );

        // change the manager
        await commonsBudget.setManager(manager.address);

        // fail: distribute vote fess to validators with the deployer address
        const adminSigner = provider.getSigner(admin.address);
        const maxCountDist = (await commonsStorage.voteFeeDistribCount()).toNumber();
        const distCallCount = validators.length / maxCountDist;
        for (let i = 0; i < distCallCount; i += 1) {
            const start = i * maxCountDist;
            await expect(commonsBudget.distributeVoteFees(proposalID, start)).to.be.revertedWith("NotAuthorized");
        }

        // fail: distribute vote fess to validators with the admin address
        for (let i = 0; i < distCallCount; i += 1) {
            const start = i * maxCountDist;
            await expect(commonsBudget.connect(admin).distributeVoteFees(proposalID, start)).to.be.revertedWith(
                "NotAuthorized"
            );
            await network.provider.send("evm_mine");
        }

        // succeed: distribute vote fess to validators with the manager address
        for (let i = 0; i < distCallCount; i += 1) {
            const start = i * maxCountDist;
            await commonsBudget.connect(manager).distributeVoteFees(proposalID, start);
            await network.provider.send("evm_mine");
        }
    });
});

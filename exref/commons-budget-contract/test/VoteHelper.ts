/* eslint-disable no-underscore-dangle */
import { expect } from "chai";
import crypto from "crypto";
import { MockProvider } from "ethereum-waffle";
import { BigNumber, BigNumberish, BytesLike, Wallet } from "ethers";
import { ethers, network } from "hardhat";
import {
    CommonsBudget,
    CommonsBudget__factory as CommonsBudgetFactory,
    CommonsStorage,
    CommonsStorage__factory as CommonsStorageFactory,
    VoteraVote,
    VoteraVote__factory as VoteraVoteFactory,
} from "../typechain-types";

function toSystemInput(title: string, start: number, end: number, docHash: BytesLike) {
    return { start, end, startAssess: 0, endAssess: 0, docHash, amount: 0, title };
}

let provider: MockProvider;
let commonsBudget: CommonsBudget;
let commonsStorage: CommonsStorage;
let voteraVote: VoteraVote;
let commonsAddress: string;
let admin: Wallet;
let voteManager: Wallet;
let validators: Wallet[];

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

export function getHash(body: string): string {
    const hash = crypto.createHash("sha256");
    hash.update(Buffer.from(body, "utf8"));
    return ethers.utils.hexZeroPad(`0x${hash.digest("hex")}`, 32);
}

export function makeCommitment(
    vote: string,
    proposalID: string,
    sender: string,
    choice: number,
    nonce: BigNumberish
): Promise<string> {
    const encodedResult = ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "address", "uint8", "uint256"],
        [proposalID, sender, choice, nonce]
    );
    return Promise.resolve(ethers.utils.keccak256(encodedResult));
}

export function signSystemProposal(
    signer: Wallet,
    proposalID: string,
    title: string,
    start: BigNumberish,
    end: BigNumberish,
    docHash: string
): Promise<string> {
    const encodedResult = ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "string", "uint64", "uint64", "bytes32"],
        [proposalID, title, start, end, docHash]
    );
    const sig = signer._signingKey().signDigest(ethers.utils.keccak256(encodedResult));
    return Promise.resolve(ethers.utils.joinSignature(sig));
}

export function signFundProposal(
    signer: Wallet,
    proposalID: string,
    title: string,
    start: BigNumberish,
    end: BigNumberish,
    startAssess: BigNumberish,
    endAssess: BigNumberish,
    docHash: string,
    amount: BigNumberish,
    proposer: string
): Promise<string> {
    const encodedResult = ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "string", "uint64", "uint64", "uint64", "uint64", "bytes32", "uint256", "address"],
        [proposalID, title, start, end, startAssess, endAssess, docHash, amount, proposer]
    );
    const sig = signer._signingKey().signDigest(ethers.utils.keccak256(encodedResult));
    return Promise.resolve(ethers.utils.joinSignature(sig));
}

export function signCommitment(
    signer: Wallet,
    proposalID: string,
    sender: string,
    commitment: string
): Promise<string> {
    const encodedResult = ethers.utils.defaultAbiCoder.encode(
        ["bytes32", "address", "bytes32"],
        [proposalID, sender, commitment]
    );
    const sig = signer._signingKey().signDigest(ethers.utils.keccak256(encodedResult));
    return Promise.resolve(ethers.utils.joinSignature(sig));
}

export async function displayBalance(address: string, message: string) {
    const balance = await ethers.provider.getBalance(address);
    console.log(`${message}_balance = ${balance.toString()}`);
}

export async function setEnvironment(
    _provider: MockProvider,
    _commonsBudget: CommonsBudget,
    _voteraVote: VoteraVote,
    _admin: Wallet,
    _voteManager: Wallet,
    _validators: Wallet[]
) {
    provider = _provider;
    commonsBudget = _commonsBudget;
    const storageAddress = await commonsBudget.getStorageContractAddress();
    const storageFactory = await ethers.getContractFactory("CommonsStorage");
    commonsStorage = await storageFactory.attach(storageAddress);
    voteraVote = _voteraVote;
    commonsAddress = _commonsBudget.address;
    admin = _admin;
    voteManager = _voteManager;
    validators = _validators;
}

export async function createSystemProposal(proposalID: string, proposer: Wallet, docHash: string, basicFee: BigNumber) {
    const blockLatest = await ethers.provider.getBlock("latest");
    const title = "SystemProposalTitle";
    const startTime = blockLatest.timestamp + 30000;
    const endTime = startTime + 30000;
    const signProposal = await signSystemProposal(voteManager, proposalID, title, startTime, endTime, docHash);

    const proposerBudget = CommonsBudgetFactory.connect(commonsAddress, proposer);
    const makeProposalTx = await proposerBudget.createSystemProposal(
        proposalID,
        toSystemInput(title, startTime, endTime, docHash),
        signProposal,
        { value: basicFee }
    );
    await makeProposalTx.wait();
}

export async function createFundProposal(
    proposalID: string,
    proposer: Wallet,
    docHash: string,
    basicFee: BigNumber,
    fundAmount: BigNumber
) {
    const blockLatest = await ethers.provider.getBlock("latest");
    const title = "FundProposalTitle";
    const startAssess = blockLatest.timestamp;
    const endAssess = startAssess + 15000;
    const startTime = blockLatest.timestamp + 30000;
    const endTime = startTime + 30000;
    const signProposal = await signFundProposal(
        voteManager,
        proposalID,
        title,
        startTime,
        endTime,
        startAssess,
        endAssess,
        docHash,
        fundAmount,
        proposer.address
    );

    const proposerBudget = CommonsBudgetFactory.connect(commonsAddress, proposer);
    const makeProposalTx = await proposerBudget.createFundProposal(
        proposalID,
        toFundInput(title, startTime, endTime, startAssess, endAssess, docHash, fundAmount),
        signProposal,
        { value: basicFee }
    );
    await makeProposalTx.wait();
}

export async function assessProposal(proposalID: string, assessResult: boolean) {
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

    // distribute vote fess to validators
    const adminSigner = provider.getSigner(admin.address);
    const maxCountDist = (await commonsStorage.voteFeeDistribCount()).toNumber();
    const distCallCount = validators.length / maxCountDist;
    for (let i = 0; i < distCallCount; i += 1) {
        const start = i * maxCountDist;
        await commonsBudget.distributeVoteFees(proposalID, start);
        await network.provider.send("evm_mine");
    }

    let assessCount: number;
    let passAssessResult: number[] = [];
    if (assessResult) {
        assessCount = 2;
        passAssessResult = [7, 7, 7, 7, 7];
    } else {
        assessCount = 2;
        passAssessResult = [6, 6, 6, 6, 6];
    }

    // Fund proposal
    if (proposalData.proposalType === 1) {
        for (let i = 0; i < assessCount; i += 1) {
            const assessVote = VoteraVoteFactory.connect(voteraVote.address, validators[i]);
            await assessVote.submitAssess(proposalID, passAssessResult);
        }

        // wait unit assessEnd
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");

        await expect(voteraVote.countAssess(proposalID))
            .to.emit(commonsBudget, "AssessmentFinish")
            .withArgs(proposalID, assessResult);

        // wait until startTime
        await network.provider.send("evm_increaseTime", [15000]);
        await network.provider.send("evm_mine");
    } else {
        // wait until startTime
        await network.provider.send("evm_increaseTime", [30000]);
        await network.provider.send("evm_mine");
    }
}

export async function countVote(
    proposalID: string,
    positive: number,
    negative: number,
    blank: number
): Promise<number[]> {
    const voterCount = positive + negative + blank;

    // setup votes
    const choices: number[] = [];
    const nonces: number[] = [];
    const expectVoteCounts: number[] = [0, 0, 0];

    // set positive votes
    for (let i = 0; i < positive; i += 1) {
        choices.push(1);
        nonces.push(i + 1);
        expectVoteCounts[1] += 1;
    }

    // set negative votes
    for (let i = positive; i < positive + negative; i += 1) {
        choices.push(2);
        nonces.push(i + 1);
        expectVoteCounts[2] += 1;
    }

    // set blank (= abstention) votes
    for (let i = positive + negative; i < voterCount; i += 1) {
        choices.push(0);
        nonces.push(i + 1);
        expectVoteCounts[0] += 1;
    }

    let submitBallotTx;
    for (let i = 0; i < voterCount; i += 1) {
        const commitment = await makeCommitment(
            voteraVote.address,
            proposalID,
            validators[i].address,
            choices[i],
            nonces[i]
        );
        const signature = await signCommitment(voteManager, proposalID, validators[i].address, commitment);

        const ballotVote = VoteraVoteFactory.connect(voteraVote.address, validators[i]);
        submitBallotTx = await ballotVote.submitBallot(proposalID, commitment, signature);
    }

    expect(await voteraVote.getBallotCount(proposalID)).equal(voterCount);

    if (submitBallotTx) {
        await submitBallotTx.wait();
    }

    await network.provider.send("evm_increaseTime", [30000]);
    await network.provider.send("evm_mine");

    for (let i = 0; i < voterCount; i += 1) {
        const ballotAddr = await voteraVote.getBallotAt(proposalID, i);
        const ballot = await voteraVote.getBallot(proposalID, ballotAddr);
        expect(ballot.key).equal(validators[i].address);
    }

    // wait until openTime
    await network.provider.send("evm_increaseTime", [30]);
    await network.provider.send("evm_mine");

    await voteraVote.revealBallot(
        proposalID,
        validators.slice(0, voterCount).map((v) => v.address),
        choices,
        nonces
    );
    await voteraVote.countVote(proposalID);

    return expectVoteCounts;
}

export async function countVoteResult(proposalID: string, votingResult: boolean): Promise<number[]> {
    let positive: number = 0;
    let negative: number = 0;
    if (votingResult) {
        positive = validators.length;
    } else {
        negative = validators.length;
    }
    const voterCount = positive + negative;

    // setup votes
    const choices: number[] = [];
    const nonces: number[] = [];
    const expectVoteCounts: number[] = [0, 0, 0];

    // set positive votes
    for (let i = 0; i < positive; i += 1) {
        choices.push(1);
        nonces.push(i + 1);
        expectVoteCounts[1] += 1;
    }

    // set negative votes
    for (let i = positive; i < positive + negative; i += 1) {
        choices.push(2);
        nonces.push(i + 1);
        expectVoteCounts[2] += 1;
    }

    // set blank (= abstention) votes
    for (let i = positive + negative; i < voterCount; i += 1) {
        choices.push(0);
        nonces.push(i + 1);
        expectVoteCounts[0] += 1;
    }

    let submitBallotTx;
    for (let i = 0; i < voterCount; i += 1) {
        const commitment = await makeCommitment(
            voteraVote.address,
            proposalID,
            validators[i].address,
            choices[i],
            nonces[i]
        );
        const signature = await signCommitment(voteManager, proposalID, validators[i].address, commitment);

        const ballotVote = VoteraVoteFactory.connect(voteraVote.address, validators[i]);
        submitBallotTx = await ballotVote.submitBallot(proposalID, commitment, signature);
    }

    expect(await voteraVote.getBallotCount(proposalID)).equal(voterCount);

    if (submitBallotTx) {
        await submitBallotTx.wait();
    }

    await network.provider.send("evm_increaseTime", [30000]);
    await network.provider.send("evm_mine");

    for (let i = 0; i < voterCount; i += 1) {
        const ballotAddr = await voteraVote.getBallotAt(proposalID, i);
        const ballot = await voteraVote.getBallot(proposalID, ballotAddr);
        expect(ballot.key).equal(validators[i].address);
    }

    // wait until openTime
    await network.provider.send("evm_increaseTime", [30]);
    await network.provider.send("evm_mine");

    await voteraVote.revealBallot(
        proposalID,
        validators.slice(0, voterCount).map((v) => v.address),
        choices,
        nonces
    );
    await expect(voteraVote.countVote(proposalID))
        .to.emit(commonsBudget, "VoteCountingFinish")
        .withArgs(proposalID, votingResult);

    return expectVoteCounts;
}

export async function processVote(
    proposalID: string,
    positive: number,
    negative: number,
    blank: number
): Promise<number[]> {
    await assessProposal(proposalID, true);
    return countVote(proposalID, positive, negative, blank);
}

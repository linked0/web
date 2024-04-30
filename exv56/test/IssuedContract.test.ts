/* eslint-disable no-await-in-loop */
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers, waffle } from "hardhat";
import { CommonsBudget, IssuedContract } from "../typechain-types";

describe("Test of Issued Contract", () => {
  let issuedContract: IssuedContract;
  let commonsBudget: CommonsBudget;

  const { provider } = waffle;
  const [admin, user] = provider.getWallets();

  // set 1 million BOA for the IssuedContract
  const budget = BigNumber.from(10).pow(18).mul(1000000);
  const userSigner = provider.getSigner(user.address);

  before(async () => {
    const issuedContractFactory = await ethers.getContractFactory(
      "IssuedContract"
    );
    issuedContract = (await issuedContractFactory
      .connect(admin)
      .deploy()) as IssuedContract;
    await issuedContract.deployed();

    const commonsBudgetFactory = await ethers.getContractFactory(
      "CommonsBudget"
    );
    commonsBudget = (await commonsBudgetFactory
      .connect(admin)
      .deploy()) as CommonsBudget;
    await commonsBudget.deployed();

    // send money to the issued contract that is used for the commons budget
    await provider.getSigner(admin.address).sendTransaction({
      to: issuedContract.address,
      value: budget,
    });
  });

  beforeEach(() => {});

  it("Set the CommonsBudget address", async () => {
    await expect(issuedContract.setCommonsBudgetAddress(commonsBudget.address))
      .to.emit(issuedContract, "CommonsBudgetAddressSet")
      .withArgs(commonsBudget.address);

    expect(await issuedContract.getCommonsBudgetAddress()).equal(
      commonsBudget.address
    );
  });

  it("Set the CommonsBudget address with EOA", async () => {
    await expect(
      issuedContract.setCommonsBudgetAddress(user.address)
    ).to.be.revertedWith("NotContract");
  });

  it("Get/Set owner", async () => {
    expect(await issuedContract.getOwner()).equal(admin.address);

    // setOwner by a user and get reverted
    expect(await issuedContract.getOwner()).equal(admin.address);
    await expect(
      issuedContract.connect(userSigner).setOwner(ethers.constants.AddressZero)
    ).to.be.revertedWith("NotAuthorized");

    // setOwner with zero address by a admin
    await issuedContract.setOwner(ethers.constants.AddressZero);
    expect(await issuedContract.getOwner()).equal(ethers.constants.AddressZero);

    // no one can call the setOwner due to the owner being zero address
    await expect(issuedContract.setOwner(user.address)).to.be.revertedWith(
      "NotAuthorized"
    );
  });

  it("Request to transfer Budget", async () => {
    const prevBalance: BigNumber = await provider.getBalance(
      commonsBudget.address
    );

    // request to transfer too many budget
    await expect(
      issuedContract.transferBudget(budget.mul(2))
    ).to.be.revertedWith("NotEnoughBudget");

    // request to transfer normal budget
    const fund = BigNumber.from(10).pow(18).mul(10000);
    await issuedContract.transferBudget(fund);
    const curBalance: BigNumber = await provider.getBalance(
      commonsBudget.address
    );

    expect(curBalance).equal(prevBalance.add(fund));
  });

  it("Request to transfer Budget through CommonsBudget", async () => {
    const prevBalance: BigNumber = await provider.getBalance(
      commonsBudget.address
    );

    // request to transfer budget through the CommonsBudget contract
    const fund = BigNumber.from(10).pow(18).mul(10000);
    await commonsBudget.setIssuedContractAddress(issuedContract.address);
    await commonsBudget.transferBudget(fund);
    const curBalance: BigNumber = await provider.getBalance(
      commonsBudget.address
    );

    expect(curBalance).equal(prevBalance.add(fund));
  });
});

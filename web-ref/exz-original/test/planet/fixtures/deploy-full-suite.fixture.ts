import { ethers } from "hardhat";
import { Wallet, Contract } from "ethers";
import {
  SimpleAccountFactory,
  SimpleAccountFactory__factory,
  SimpleAccount,
  SimpleAccount__factory,
} from "../../../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { parseEther } from "ethers";

let counter = 0n;

export async function deployFullSuiteFixture() {
  const [deployer, user] = await ethers.getSigners();

  const Factory = await ethers.getContractFactory("Greeter");
  const greeter = await Factory.deploy("Hello, Hardhat!");

  const basic = await ethers.deployContract("Basic");

  const EntryPoint = await ethers.getContractFactory("EntryPoint");
  const entryPoint = await EntryPoint.deploy();

  const accountOwner = createAccountOwner();

  let simpleAccountFactory: SimpleAccountFactory;
  let account: SimpleAccount;
  ({ proxy: account, accountFactory: simpleAccountFactory } =
    await createAccount(
      deployer,
      await accountOwner.getAddress(),
      await entryPoint.getAddress(),
    ));

  await fund(await account.getAddress());

  return {
    accounts: {
      deployer,
      user,
    },
    aa: {
      account,
    },
    suite: {
      greeter,
      basic,
      entryPoint,
      simpleAccountFactory,
    },
  };
}

export function createAccountOwner(): Wallet {
  const privateKey = ethers.keccak256(Buffer.from(ethers.toBeArray(++counter)));
  return new ethers.Wallet(privateKey, ethers.provider);
  // return new ethers.Wallet('0x'.padEnd(66, privkeyBase), ethers.provider);
}

// Deploys an implementation and a proxy pointing to this implementation
export async function createAccount(
  ethersSigner: HardhatEthersSigner,
  accountOwner: string,
  entryPoint: string,
  _factory?: SimpleAccountFactory,
): Promise<{
  proxy: SimpleAccount;
  accountFactory: SimpleAccountFactory;
  implementation: string;
}> {
  const accountFactory =
    _factory ??
    (await new SimpleAccountFactory__factory(ethersSigner).deploy(entryPoint));
  console.log("accountFactory:", await accountFactory.target);
  const implementation = await accountFactory.accountImplementation();
  await accountFactory.createAccount(accountOwner, 0);
  const accountAddress = await accountFactory.getAccountAddress(
    accountOwner,
    0,
  );
  console.log("accountAddress:", accountAddress);
  const proxy = SimpleAccount__factory.connect(accountAddress, ethersSigner);
  return {
    implementation,
    accountFactory,
    proxy,
  };
}

// just throw 1eth from account[0] to the given address (or contract instance)
export async function fund(
  contractOrAddress: string | Contract,
  amountEth = "1",
): Promise<void> {
  let address: string;
  if (typeof contractOrAddress === "string") {
    address = contractOrAddress;
  } else {
    address = await contractOrAddress.getAddress();
  }
  console.log("address:", address);
  const signer = await ethers.provider.getSigner();
  await signer.sendTransaction({ to: address, value: parseEther(amountEth) });
}

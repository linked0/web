import { ethers } from 'hardhat'
import { expect } from 'chai'
import { Signer, Wallet } from 'ethers'
import { ExecAccount, Operator } from '../../typechain';
import { defaultAbiCoder, hexConcat } from 'ethers/lib/utils';

const provider = ethers.provider

describe("ExecAccount", function () {
  let execAccount: ExecAccount;
  let operator: Operator;
  let signer: Signer;

  before(async () => {
    const execAccountFactory = await ethers.getContractFactory("ExecAccount");
    execAccount = await execAccountFactory.deploy();
    const operatorFactory = await ethers.getContractFactory("Operator");
    operator = await operatorFactory.deploy();
    signer = provider.getSigner()
  });

  describe("Deployment ExecAccount", () => {
    it("should deploy ExecAccount", async () => {
      console.log(execAccount.address);
      expect(await execAccount.test()).to.equal("Hello World!");
    });

    it("should deploy ExecAccount", async () => {
      const execSig = operator.interface.getSighash('add');
      const innerCall = defaultAbiCoder.encode(['address', 'bytes'], [operator.address,
      operator.interface.encodeFunctionData('add')
      ]);
      const userOp = {
        sender: operator.address,
        callData: hexConcat([execSig, innerCall])
      }
      await execAccount.executeUserOp(userOp, 1);
      await execAccount.executeUserOp(userOp, 1);

      const value = await operator.value();
      console.log(value);
    });
  });
});
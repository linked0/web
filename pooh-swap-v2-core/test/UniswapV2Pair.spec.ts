import * as dotenv from "dotenv";
import chai, { expect } from 'chai'
import { ethers } from "hardhat";
import { Contract } from 'ethers';
import { UniswapV2Factory, ERC20} from '../typechain-types';

const AddressZero = "0x0000000000000000000000000000000000000000";

const MINIMUM_LIQUIDITY = BigInt(1000);
const TOTAL_SUPPLY = BigInt(10000);

dotenv.config({ path: ".env" });

const overrides = {
  gasLimit: 9999999
}

describe('UniswapV2Pair', () => {
  let factory: UniswapV2Factory;
  let token0: Contract;
  let token1: Contract;

  beforeEach(async () => {
    // get signers
    const signers = await ethers.getSigners();
    const admin = signers[0];
    const user = signers[1];

    // deploy UniswapV2Factory
    const factory = await  ethers.deployContract("UniswapV2Factory", [admin.getAddress()], overrides);
    await factory.waitForDeployment();
    console.log("factory address:", factory.target);

    // deploy ERC20 tokens
    const token0 = await ethers.deployContract("ERC20", [TOTAL_SUPPLY], overrides);
    await token0.waitForDeployment();
    console.log("token0 address:", token0.target);

    // deploy ERC20 tokens
    const token1 = await ethers.deployContract("ERC20", [TOTAL_SUPPLY], overrides);
    await token1.waitForDeployment();
    console.log("token1 address:", token1.target);

    // get total supply of token0
    const totalSupply0 = await token0.totalSupply();
    console.log("token0 total supply:", totalSupply0.toString());

    // trasnfer token0 to user
    await token0.transfer(user.getAddress(), BigInt(1000));
    const balance0 = await token0.balanceOf(user.getAddress());
    console.log("token0 balance:", balance0.toString());

    // balance of admin
    const balanceAdmin0 = await token0.balanceOf(admin.getAddress());
    console.log("token0 balance admin:", balanceAdmin0.toString());
  })


  it.only('mint', async () => {
    console.log("minting");
  });
})
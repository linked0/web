// tests/DiamondPattern.test.ts
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { FunctionFragment } from "ethers";
import { ethers } from "hardhat";

import type { BaseContract } from "ethers";

describe("Diamond Pattern - EIP-2535 Generic Example", function () {
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();

  async function deployDiamondFixture() {
    const [owner, user, operator] = await ethers.getSigners();

    // Deploy facets
    const DiamondCutFacet = await ethers.deployContract("DiamondCutFacet");
    const DiamondLoupeFacet = await ethers.deployContract("DiamondLoupeFacet");
    const OwnershipFacet = await ethers.deployContract("OwnershipFacet");
    const ExampleFacet = await ethers.deployContract("ExampleFacet");

    function getSelectors(facet: BaseContract): string[] {
      return facet.interface.fragments
        .filter((f): f is FunctionFragment => f.type === "function")
        .map((f) => f.selector);
    }
    
    const facetList: BaseContract[] = [
      // DiamondCutFacet,
      // DiamondLoupeFacet,
      OwnershipFacet,
      ExampleFacet
    ];
    
    const cuts = facetList.map((facet) => ({
      facetAddress: facet.target,
      action: 0, // FacetCutAction.Add
      functionSelectors: getSelectors(facet)
    }));

    console.log("cuts", cuts);
    
    // Deploy Diamond pointing to cut facet first
    const diamond = await ethers.deployContract("Diamond", [owner.address, cuts]);

    // Get OwnershipFacet interface at the Diamond proxy address
    const ownership = await ethers.getContractAt(
      "OwnershipFacet",
      diamond.target
    );

    // return { owner, user, operator, Diamond, diamondCut, loupe, ownership, example };
    return { owner, user, operator, diamond, ownership };
  }

  it("should transfer ownership via fallback", async function () {
    const { owner, user, diamond, ownership } = await loadFixture(deployDiamondFixture);

    // build selector+args
    const iface    = new ethers.Interface([ "function transferOwnership(address)" ]);
    const fullData = iface.encodeFunctionData("transferOwnership", [user.address]);
    // send raw tx to the proxy; fallback() will delegate to OwnershipFacet
    await owner.sendTransaction({
      to:   diamond.target.toString(),
      data: fullData
    });

    expect(await ownership.owner()).to.equal(user.address);
  });

  it("should transfer ownership via execute()", async function () {
    const { owner, user, diamond, ownership } = await loadFixture(deployDiamondFixture);

    // build selector+args
    const iface    = new ethers.Interface([ "function transferOwnership(address)" ]);
    const fullData = iface.encodeFunctionData("transferOwnership", [user.address]);

    // 4-byte selector, with "0x"
    const sig  = fullData.slice(0, 10);

    // use the helper in Diamond
    await diamond.connect(owner).execute(sig, fullData);

    expect(await ownership.owner()).to.equal(user.address);
  });
});

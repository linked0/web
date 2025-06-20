import { ethers } from "hardhat";
import { FacetCutAction, getSelectors } from "./libraries/diamond";

export async function deployDiamond() {
  const accounts = await ethers.getSigners()
  const contractOwner = accounts[0]

  // deploy DiamondCutFacet
  const DiamondCutFacet = await ethers.getContractFactory('contracts/diamond/facets/DiamondCutFacet.sol:DiamondCutFacet')
  const diamondCutFacet = await DiamondCutFacet.deploy()
  await diamondCutFacet.waitForDeployment()
  console.log('DiamondCutFacet deployed:', await diamondCutFacet.getAddress())

  // deploy Diamond
  const Diamond = await ethers.getContractFactory('contracts/diamond/Diamond.sol:Diamond')
  const diamond = await Diamond.deploy(contractOwner.address, await diamondCutFacet.getAddress())
  await diamond.waitForDeployment()
  console.log('Diamond deployed:', await diamond.getAddress())

  // deploy DiamondInit
  // DiamondInit provides a function that is called when the diamond is upgraded to initialize state variables
  // Read about how the diamondCut function works here: https://eips.ethereum.org/EIPS/eip-2535#addingreplacingremoving-functions
  const DiamondInit = await ethers.getContractFactory('DiamondInit')
  const diamondInit = await DiamondInit.deploy()
  await diamondInit.waitForDeployment()
  console.log('DiamondInit deployed:', await diamondInit.getAddress())

  // deploy facets
  console.log('')
  console.log('Deploying facets')
  const FacetNames = [
    'contracts/diamond/facets/DiamondLoupeFacet.sol:DiamondLoupeFacet',
    'contracts/diamond/facets/OwnershipFacet.sol:OwnershipFacet'
  ]
  const cut = []
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName)
    const facet = await Facet.deploy()
    await facet.waitForDeployment()
    // const facetContract = await ethers.getContractAt(FacetName, await facet.getAddress())
    console.log(`${FacetName} deployed: ${await facet.getAddress()}`)
    cut.push({
      facetAddress: await facet.getAddress(),
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(Facet)
    })
  }

  // upgrade diamond with facets
  console.log('')
  console.log('Diamond Cut:', cut)
  const diamondCut = await ethers.getContractAt('contracts/diamond/interfaces/IDiamondCut.sol:IDiamondCut', await diamond.getAddress())
  let tx
  let receipt
  // call to init function
  let functionCall = diamondInit.interface.encodeFunctionData('init')
  tx = await diamondCut.diamondCut(cut, await diamondInit.getAddress(), functionCall)
  console.log('Diamond cut tx: ', tx.hash)
  receipt = await tx.wait()
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`)
  }
  console.log('Completed diamond cut')
  return await diamond.getAddress()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployDiamond().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

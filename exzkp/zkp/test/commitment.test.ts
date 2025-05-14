import { zkit } from "hardhat";
import { expect } from "chai";
import { Poseidon } from  "@iden3/js-crypto";
import { ethers } from "hardhat";

describe("Commitment", () => {
  it("should test the witness", async () => {
    const circuit = await zkit.getCircuit("Commitment");

    const nullifier = 123n
    const secret = 456n;
    const commitment = Poseidon.hash([nullifier, secret]);
    const nullifierHash = Poseidon.hash([nullifier]);

    await expect(circuit)
      .with.witnessInputs({nullifier, secret})
      .to.have.witnessOutputs( {commitment, nullifierHash} );
  });

  it("should test the solidity verifier", async () => {
    const circuit = await zkit.getCircuit("Commitment");

    const nullifier = 123n
    const secret = 456n;

    // generate ZK proof
    const proof = await circuit.generateProof({ nullifier, secret });
    const { proofPoints: { a, b, c }, publicSignals: inputs } = await circuit.generateCalldata(proof);
    
    const verifier = await ethers.deployContract("CommitmentGroth16Verifier");

    // call the solidity verifier
    expect(await verifier.verifyProof(a, b, c, inputs)).to.be.true;
  });
});
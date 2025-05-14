pragma circom 2.0.0;

include "circomlib/circuits/poseidon.circom";

template Commitment() {
    signal input nullifier;
    signal input secret;

    signal output commitment;
    signal output nullifierHash;

    component commitmentHash = Poseidon(2);
    commitmentHash.inputs[0] <== nullifier;
    commitmentHash.inputs[1] <== secret;

    commitment <== commitmentHash.out;

    component nullifierHasher = Poseidon(1);
    nullifierHasher.inputs[0] <== nullifier;

    nullifierHash <== nullifierHasher.out;
}

component main = Commitment();
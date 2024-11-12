import { Signature } from "ethers";
import { ethers } from "hardhat";

async function main() {
  const byteCode = process.env.DATA_STORAGE_BYTECODE || "";
  const deployerWallet = new ethers.Wallet(
    process.env.ADMIN_KEY || "",
    ethers.provider
  );
  console.log("Deployer public key: ", await deployerWallet.getAddress());

  const contractName = process.env.DATA_STORAGE_NAME || "";

  const factory = await ethers.getContractFactory(contractName);
  const deployTx = await factory.getDeployTransaction([]);
  console.log(deployTx);

  const addr = await deployerWallet.getAddress();
  const rlpEncoded = ethers.encodeRlp([addr, ethers.toBeArray(0)]);
  const contractAddressLong = ethers.keccak256(rlpEncoded);
  const contractAddress = `0x${contractAddressLong.slice(-40)}`; // Extract last 20 bytes and add '0x' prefix

  console.log("Contract Address: ", contractAddress);

  const txData = {
    type: 2,
    nonce: 0,
    gasLimit: "0x27100",
    maxPriorityFeePerGas: "0x06fc23ac00",
    maxFeePerGas: "0x06fc23ac00",
    to: null,
    value: 0,
    data: deployTx.data,
    chainId: 12301,
  };

  const rawTransaction = await deployerWallet.signTransaction(txData);
  console.log("Raw transaction: ", rawTransaction);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// NOTE: JUST FOR REFERENCE
// async function main2() {
//   const byteCode = process.env.DATA_STORAGE_BYTECODE || "";
//   const deployerWallet = new ethers.Wallet(process.env.DEPLOYER_KEY || "", ethers.provider);
//   console.log("Deployer public key: ", await deployerWallet.getAddress());

//   // const message = ethers.solidityPackedKeccak256(["bytes"], [ethers.toBeArray(byteCode)]);
//   const nonce = ethers.toBeArray(0);
//   const gasPrice = ethers.toBeArray(100 * 10 ** 9);
//   const gasLimit = ethers.toBeArray(1000000);
//   const to = ethers.toBeArray(0);
//   const value = ethers.toBeArray(0);
//   const data = ethers.getBytes(byteCode);
//   const unsignedEncodedTx = ethers.encodeRlp([nonce, gasPrice, gasLimit, to, value, data]);
//   const hashedUnsignedEncodedTx = ethers.keccak256(ethers.getBytes(unsignedEncodedTx));
//   const sigStr = await deployerWallet.signMessage(hashedUnsignedEncodedTx);
//   console.log("Signature: ", sigStr);
//   const sig = Signature.from(sigStr);
//   console.log("type of r: ", typeof sig.r);
//   const signedEncodedTx = ethers.encodeRlp([nonce, gasPrice, gasLimit, to, value, data, ethers.toBeArray(sig.v), ethers.getBytes(sig.r), ethers.getBytes(sig.s)]);
//   const signedEncodedTxBytes = ethers.getBytes(signedEncodedTx);
//   const tx = signedEncodedTxBytes.reduce((x, y) => x += y.toString(16).padStart(2, '0'), '')
//   console.log("Signed encoded tx: ", tx);

//   const pubkey = ethers.verifyMessage(hashedUnsignedEncodedTx, sigStr);
//   console.log("Pubkey: ", pubkey);
// }

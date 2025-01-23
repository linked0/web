import * as hre from "hardhat";
import { ethers } from "ethers";

export interface IValidatorInfo {
  index: number;
  privateKey: string;
  address: string;
}

async function main() {
  // TODO: How to decrypt the keystore file version 4
  // const keystoreJson = "{\"crypto\": {\"kdf\": {\"function\": \"scrypt\", \"params\": {\"dklen\": 32, \"n\": 262144, \"r\": 8, \"p\": 1, \"salt\": \"5088df477afa14ba6a57dc7094098b3ab685b85b8f5a78c6207d8b70cf165733\"}, \"message\": \"\"}, \"checksum\": {\"function\": \"sha256\", \"params\": {}, \"message\": \"3e2d8945e32afd4e66744e9c33c6151b372b6b8c7cf91e8ea29c88265f3710a8\"}, \"cipher\": {\"function\": \"aes-128-ctr\", \"params\": {\"iv\": \"84f98db7c81a8b1e13ffde1e5abc6174\"}, \"message\": \"dc58f30d317c1ab6e11798b9768a1f7b6a6b3d5a27fe99ff959e1536bfc12472\"}}, \"description\": \"\", \"pubkey\": \"aa730e92e28d1f9b4f1eed4564cd16e424c3fde058ebd7ae42a22ab63f91b327387e2fadde8e9fc3009201b5c73ded58\", \"path\": \"m/12381/3600/0/0/0\", \"uuid\": \"2fc6d966-90db-4a2f-be2e-46e66be49f68\", \"version\": 4}";

  // poohprysm/poohnet/pooh-deposit-cli/validator_keys의 voter-keystore 파일을 이용하여 private key를 얻는다.
  const keystoreJson =
    '{"address": "284126bcf634f08df00fb40b3d55bc1b63103804", "crypto": {"cipher": "aes-128-ctr", "cipherparams": {"iv": "a70f29bed0f5b10a4a249e89095b46eb"}, "ciphertext": "603ab4ae0d73ad2ead029eacfd64b9b14aa4459885ad2b25cf5c58a0dc6db2c5", "kdf": "pbkdf2", "kdfparams": {"c": 1000000, "dklen": 32, "prf": "hmac-sha256", "salt": "7937b7e18016ad339ae344d08c1967f9"}, "mac": "8a53021682733fbdb518f28975b8d6dd30b4b52375c439d7c902e85d862e98b0"}, "id": "2d2e7b26-2efd-466c-812c-ac19873f4b1a", "version": 3}';
  // const password = "boa2019!@";
  const password = "pooh2023!@";

  try {
    // Decrypt the wallet using ethers.js
    // const account = hre.web3.eth.accounts.decrypt(keystoreJson, password);
    const account = await ethers.Wallet.fromEncryptedJson(
      keystoreJson,
      password,
    );

    // Output the private key and address
    console.log("Private Key:", account.privateKey);
    console.log("Address:", account.address);
  } catch (error) {
    console.error("Error decrypting wallet:", error);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.e
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

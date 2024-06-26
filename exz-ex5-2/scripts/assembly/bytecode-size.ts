import fs from "fs";
import path from "path";

async function main() {
  const solBytecode = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../../artifacts/contracts/assembly/Sum.sol/Sum.json')
  )).deployedBytecode;

  const asmBytecode = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../../artifacts/contracts/assembly/SumAssembly.sol/SumAssembly.json')
  )).deployedBytecode;

  console.log('Solidity Contract Bytecode Length: ', solBytecode.length / 2);
  console.log('Assembly Contract Bytecode Length: ', asmBytecode.length / 2);

  console.log('Bytecode Size Reduction: ',
    ((solBytecode.length - asmBytecode.length) / solBytecode.length * 100).toFixed(2),
    '%');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
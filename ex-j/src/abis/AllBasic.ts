const AllBasicAbiJson = {
  "_format": "hh-sol-artifact-1",
  "contractName": "AllBasic",
  "sourceName": "contracts/AllBasic.sol",
  "abi": [
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "add",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "approvals",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getValue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "spenders",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "value",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x60808060405260015f5561048590816100168239f3fe60806040908082526004361015610014575f80fd5b5f3560e01c90816320965255146102fb575080633fa4f245146102c05780634f2be91f146101d75780635d0341ba1461017057806363a31bd41461010957637e5465ba14610060575f80fd5b3461010557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261010557610096610332565b6024359173ffffffffffffffffffffffffffffffffffffffff80841680940361010557600192165f5281602052805f20927fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff009383858254161790555f5260026020525f20918254161790555f80f35b5f80fd5b50346101055760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101055760209073ffffffffffffffffffffffffffffffffffffffff610159610332565b165f526002825260ff815f20541690519015158152f35b50346101055760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101055760209073ffffffffffffffffffffffffffffffffffffffff6101c0610332565b165f526001825260ff815f20541690519015158152f35b5034610105575f7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610105575f5461024681835161021781610355565b601381527f56616c756520696e204c6f636b20697320256f00000000000000000000000000602082015261039e565b600181018091116102935761029191815f555161026281610355565b601481527f56616c75653220696e204c6f636b20697320256f000000000000000000000000602082015261039e565b005b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5034610105575f7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610105576020905f549051908152f35b34610105575f7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610105576020905f548152f35b6004359073ffffffffffffffffffffffffffffffffffffffff8216820361010557565b6040810190811067ffffffffffffffff82111761037157604052565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b90604051916020908360208101937fb60e72cc000000000000000000000000000000000000000000000000000000008552604060248301528251938460648401525f935b85851061045f57505060a392505f60848584010152601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe094859260448501520116810103606481018552011682019082821067ffffffffffffffff831117610371575f92839260405251906a636f6e736f6c652e6c6f675afa50565b84810182015188860160840152938101938793506103e256fea164736f6c6343000818000a",
  "deployedBytecode": "0x60806040908082526004361015610014575f80fd5b5f3560e01c90816320965255146102fb575080633fa4f245146102c05780634f2be91f146101d75780635d0341ba1461017057806363a31bd41461010957637e5465ba14610060575f80fd5b3461010557807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261010557610096610332565b6024359173ffffffffffffffffffffffffffffffffffffffff80841680940361010557600192165f5281602052805f20927fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff009383858254161790555f5260026020525f20918254161790555f80f35b5f80fd5b50346101055760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101055760209073ffffffffffffffffffffffffffffffffffffffff610159610332565b165f526002825260ff815f20541690519015158152f35b50346101055760207ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3601126101055760209073ffffffffffffffffffffffffffffffffffffffff6101c0610332565b165f526001825260ff815f20541690519015158152f35b5034610105575f7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610105575f5461024681835161021781610355565b601381527f56616c756520696e204c6f636b20697320256f00000000000000000000000000602082015261039e565b600181018091116102935761029191815f555161026281610355565b601481527f56616c75653220696e204c6f636b20697320256f000000000000000000000000602082015261039e565b005b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5034610105575f7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610105576020905f549051908152f35b34610105575f7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610105576020905f548152f35b6004359073ffffffffffffffffffffffffffffffffffffffff8216820361010557565b6040810190811067ffffffffffffffff82111761037157604052565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b90604051916020908360208101937fb60e72cc000000000000000000000000000000000000000000000000000000008552604060248301528251938460648401525f935b85851061045f57505060a392505f60848584010152601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe094859260448501520116810103606481018552011682019082821067ffffffffffffffff831117610371575f92839260405251906a636f6e736f6c652e6c6f675afa50565b84810182015188860160840152938101938793506103e256fea164736f6c6343000818000a",
  "linkReferences": {},
  "deployedLinkReferences": {}
}

export const ALLBASIC_ABI = AllBasicAbiJson.abi;
export const ALLBASIC_BYTECODE = AllBasicAbiJson.bytecode;

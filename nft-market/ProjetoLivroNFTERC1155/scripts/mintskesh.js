require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const { ethers } = require("hardhat");
const contract = require("../artifacts/contracts/SplashERC1155.sol/SplashERC1155.json");
const contractInterface = contract.abi;

let provider = ethers.provider;

const tokenURI = "https://ipfs.io/ipfs/QmY7XYLRN2scvW7PnTHqXTA8JbqQvjWwQCc9KaNqJDWyQn";
const quantidade = 5;
const privateKey = `0x${process.env.PRIVATE_KEY}`;
const wallet = new ethers.Wallet(privateKey);

wallet.provider = provider;
const signer = wallet.connect(provider);

const nft = new ethers.Contract(
  '0xd4F8306739008eBF4f66f1cD6bD58dA0380C461C',
  contractInterface,
  signer
);

async function main(){
    await nft.mint(quantidade,tokenURI)
    .then(
        function(log) {
          console.log(`${quantidade} NFTs successfully minted. The Transaction Hash is: ${log.hash}`);
          process.exit(0);
        }
    ).catch(
        function(e)  {
            console.log("something went wrong", e);
            process.exit(1);
        }    
    );
}

main();

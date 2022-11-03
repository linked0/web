const { ethers } = require("hardhat");

async function main() {
  //Ontém o contrato o SplashWorldCollection.sol
  const SplashWorld = await ethers.getContractFactory("SplashWorldCollection");
  //O construtor do nosso contrato SplashWorldCollection.sol deve receber 
  //o nome da coleção, o símbolo e a URI dos arquivos de metadados. Estes dados
  //são passados ao construtor do contrato pelo comando abaixo  
  //QmXkpyVusFZPs4nMZK26FnewBo3sQVZoqgUUoNHuBeeFDr é o CID da pasta dos arquivos 
  //JSON no Pinata
  const splashWorld = await SplashWorld.deploy(
    "SplashWorldCollection", 
    "SWCO",
    "https://ipfs.io/ipfs/QmXkpyVusFZPs4nMZK26FnewBo3sQVZoqgUUoNHuBeeFDr/"
    );
  //Implanta o contrato na blockchain definida no arquivo hardhat.config.js
  await splashWorld.deployed();
  //Exibe uma mensagem e o número do contrato da coleção de NFT
  console.log("Success! Contract was deployed to: ", splashWorld.address);

   //Cada vez que a função mint é chamada o tokenID incrementa em 1
  //logo, o primeiro mint equivale ao NFT 1, que é o personagem Splash,
  //o segundo mint equivale ao NFT 2, que equivale ao Smesh e assim por diante
  await splashWorld.mint(4) // tokenId 1 Splash
  await splashWorld.mint(3) // tokenId 2 Smesh
  await splashWorld.mint(5) // tokenId 3 Skesh
  await splashWorld.mint(2) // tokenId 4 Sbesh

  console.log("NFT successfully minted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


  

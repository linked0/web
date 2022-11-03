//Indica que usará o hardhat para registrar os smat contracts na blockchain
const { ethers } = require("hardhat");

//Nessa função fica toda a lógica para deploy dos smart contracts
async function main() {

  //Obter o smart contract a ser registrado, onde "SplashERC1155" representa o nome do smart 
  //contract SplashERC1155.sol
  const SplashWorld = await ethers.getContractFactory("SplashERC1155");
  //Criar a versão para deploy do smart contract, onde "SplashWorldERC1155" é o nome da coleção 
  //e "SP11" é o símbolo. Estes valores são passados para o construtor do smart contract.
  const splashWorld = await SplashWorld.deploy("SplashWorldERC1155", "SP11");
  //Registra o contrato(deploy)
  await splashWorld.deployed();
  //Mostra a mensagem indicando que o contrato foi registrado na blockchain e mostra o endereço 
  //do dono do contrato
  console.log("Success! Contract was deployed to: ", splashWorld.address);
  //Cunha ou cria 10 NFT registrando na blockchain. O link fornecido é para o arquivo skesh.json no Pinata. 
  //QmYJf3FmFPyZHo8MbbySs6CZLjYh3gGBtjVKt46wbX196h é o CID do arquivo skesh.json no Pinata
  await splashWorld.mint(10,"https://ipfs.io/ipfs/QmYJf3FmFPyZHo8MbbySs6CZLjYh3gGBtjVKt46wbX196h");
  //Mostra a mensagem que o NFT foi criado e registrado (minted)
  console.log("NFT successfully minted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});

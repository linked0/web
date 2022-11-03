//Indica que usará o hardhat para registrar os smat contracts na blockchain
const { ethers } = require("hardhat");

//Nessa função fica toda a lógica para deploy dos smart contracts
async function main() {

      //Obter o smart contract a ser registrado, onde "SplashOZ" representa o nome do smart contract SplashOZ.sol
  const SplashWorld = await ethers.getContractFactory("SplashOZ");
     //Criar a versão para deploy do smart contract, onde "SplashWorldOZ" é o nome da coleção 
     //e "SPWDO" é o símbolo. Estes valores são passados para o construtor do smart contract.
  const splashWorld = await SplashWorld.deploy("SplashWorldOZ", "SPWDO");
     //Registra o contrato(deploy)
  await splashWorld.deployed();
     //Mostra a mensagem indicando que o contrato foi registrado na blockchain e mostra o endereço do dono do contrato
  console.log("Success! Contract was deployed to: ", splashWorld.address);
     //Cunha ou cria um NFT registrando na blockchain. O link fornecido é para o arquivo smesh.json no Pinata. 
     // QmWzTX4xoCNNqZrtDoKdoE8RhTrzSuxxCYvrdkpWTqdvbq é o CID do arquivo smesh.json no Pinata
  await splashWorld.mint("https://ipfs.io/ipfs/QmWzTX4xoCNNqZrtDoKdoE8RhTrzSuxxCYvrdkpWTqdvbq");
      //Mostra a mensagem que o NFT foi criado e registrado (minted)
  console.log("NFT successfully minted");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

//Indica a existência de parâmetros que devem ser buscados no arquivo .env por meio do módulo dotenv.
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

const { ethers } = require("hardhat");

//Cria a variável representando o contrato contido no caminho especificado
const contract = require("../artifacts/contracts/Splash.sol/Splash.json");
const contractInterface = contract.abi;

//Armazena todos os detalhes da conexão com a blockchain que foi definida em hardhat.config.js
let provider = ethers.provider;

//Define o URI dos metadados do NFT, que estão no arquivo Splash.json no Pinata.
const tokenURI = "https://ipfs.io/ipfs/QmPeEEaa6w1YVVTdRkn4YAmt4TeVnmckfD2c9xGMJpEGFE";
//Obtém a chave privada do endereço do dono do contrato, que está no arquivo .env 
const privateKey = `0x${process.env.PRIVATE_KEY}`;
//Define que o endereço referente à chave privada informada poderá executar e assinar transações referentes ao NFT
const wallet = new ethers.Wallet(privateKey);
//Define a conexão com a blockchain que usará esse endereço para executar transações com o NFT
wallet.provider = provider;
//Define que o endereço poderá assinar transações
const signer = wallet.connect(provider);

//Define que a variável nft poderá ser usada como representante para chamar funções do contrato usando javascript
//'0x2233Ec5C6041583B14A457B484D79068D46d258A' é o contrato da coleção de NFT SplashWorld
const nft = new ethers.Contract(
  '0x07F009af17fce066232af2d0EDF27B076aBDD333',
  contractInterface,
  signer
);

//Esta função executa a lógica, cunhando o NFT e mostrando o hash da transação
//Cunha o NFT, depois mostra o transacton hash e, se houver erro, mostrará.
async function main(){
    await nft.mint(tokenURI)
    .then(
        function(log) {
          console.log(`NFT successfully minted. The Transaction Hash is: ${log.hash}`);
          process.exit(0);
        }
    ).catch(
        function(e)  {
            console.log("something went wrong", e);
            process.exit(1);
        }    
    );
}

//Chama a função main, acima
main();

// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//Importa alguns contratos que fazem parte do OpenZeppelin
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SplashOZ is ERC721URIStorage {
           //Usa a biblioteca Counters para incrementar, decrementar ou resetar um valor,
           //nesse caso, da variável _tokenIds
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

          //Construtor recebe o nome e o símbolo da coleção de NFT
          //e passa para o construtor do contrato ERC721.sol, parte do OpenZeppelin
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {}

    function mint(string memory tokenURI) public returns (uint256) {
                       //Incrementa a variável _tokenIds
        _tokenIds.increment();
                       //Armazena na variável newItemId o ID atual contido em _tokenIds
        uint256 newItemId = _tokenIds.current();
                     //Cunha o NFT de ID newItemId para quem chamou esta função
        _mint(msg.sender, newItemId);
                     //Define a URL defnida para este NFT com id contido em newItemId
        _setTokenURI(newItemId, tokenURI);
                     //Retorna o ID do NFT cunhado (criado)
        return newItemId;
    }
}

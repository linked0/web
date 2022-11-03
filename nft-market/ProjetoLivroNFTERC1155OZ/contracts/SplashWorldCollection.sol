//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

//Importa a implementação de interface ERC1155 criada pelo OpenZeppelin Project
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
//Ownable.sol habilita o dono do contrato a implantar o contrato
//e define que funções só podem ser executadas pelo dono do contrato
import "@openzeppelin/contracts/access/Ownable.sol";
//Strings.sol será usado para receber a URL na função uri
import "@openzeppelin/contracts/utils/Strings.sol";

contract SplashWorldCollection is ERC1155, Ownable {
    //variáveis para o nome, símbolo, quantidade e URI do NFT
    string public name;
    string public symbol;
    uint256 public tokenCount;
    string public baseUri;

    //O construtor recebe o nome, osímbolo da coleção de NFT e a URI
    //e instancia o contrato ERC1155.sol passando a URI recebida
    constructor(string memory _name, string memory _symbol, string memory _baseUri)
    ERC1155(_baseUri) {
        name = _name;
        symbol = _symbol;
        baseUri = _baseUri;
    }

    //onlyOwner é uma função derivada de Ownable.sol do OpenZeppelin
    //que faz com que somente o dono do contrato possa cunhar o token
    //ou seja, executar essa função mint
    function mint(uint256 amount) public onlyOwner{
        tokenCount += 1;
        //Chama a função mint do contrato ERC1155.sol do OpenZeppelin
        //passando o endereço de quem chamou essa função (dono),
        //um ID para o NFT, a quantidade a ser cunhada e um valor
        //vazio, referente a dados adicionais que não teremos
        _mint(msg.sender, tokenCount, amount, "");
    }

    //Obtém a URI do arquivo de metadados do NFT, no formato
    //"https://game.example/api/item/{id}.json"
    function uri(uint256 _tokenId) public override view returns(string memory) {
        //Basicamente retorna o URI concatenando baseUri + _tokenId + json
        //Por exemplo: https://game.example/api/item/ + {_tokenId} + .json
        //Resultando em algo como "https://game.example/api/item/1.json"
        //Usa aqui o contrato Strings.sol do projeto OpenZeppelin
        return string(
                abi.encodePacked(
                        baseUri,
                        Strings.toString(_tokenId),
                        ".json"
                )
        );
    }
}

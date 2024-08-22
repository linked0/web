// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IGoldToken is IERC20 {
    function mint(address _to, uint _amount) external;
    function burn(address _account, uint _amount) external;
}

interface IOracle {
    function getPrice() external view returns (uint256);
}

/**
 * @title GlodExchange
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract GoldExchange is ReentrancyGuard {

    using Address for address payable;

    IGoldToken public immutable token;
    IOracle public immutable oracle;

    event TokenBought(address indexed buyer, uint256 amount, uint256 price);
    event TokenSold(address indexed seller, uint256 amount, uint256 price);

    constructor(address _token, address _oracle) payable {
        token = IGoldToken(_token);
        oracle = IOracle(_oracle);
    }

    function buyTokens(uint amount) external payable nonReentrant {

        require(msg.value > 0, "Amount paid must be greater than zero");

        // Check price 
        uint goldPrice = oracle.getPrice();
        uint totalPrice = goldPrice * amount;
        require(msg.value >= totalPrice, "Amount paid is not enough");

        // Return the change
        uint change = msg.value - totalPrice;
        (bool _success, bytes memory _data) = payable(msg.sender).call{value: change}("");
        require(_success, "Can't pay the change");

        // Mint tokens
        token.mint(msg.sender, amount);
    }

    function sellTokens(uint amount) external nonReentrant {

        // Get gold price
        uint goldPrice = oracle.getPrice();
        uint totalPrice = goldPrice * amount;
        require(address(this).balance >= totalPrice, "Not enough ETH in balance");

        // Burn the tokens
        token.burn(msg.sender, amount);
        
        // Pay
        (bool _success, bytes memory _data) = payable(msg.sender).call{value: totalPrice}("");
        require(_success, "Can't pay for the tokens");
    }

    receive() external payable {}
}

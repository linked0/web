// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later
pragma solidity ^0.7.0;

import "./AIvestToken.sol";

/**
 * @title AIvestICO
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract AIvestICO {

    uint256 constant public SALE_PERIOD = 3 days;

    AIvestToken public token;
    uint256 public startTime;
    address public admin;

    modifier onlyAdmin() {
        require(msg.sender == admin, "not admin");
        _;
    }

    constructor() {
        token = new AIvestToken();
        admin = msg.sender;
        startTime = block.timestamp;
    }

    function buy(uint256 numTokens) public payable {
        require(block.timestamp <= startTime + SALE_PERIOD, "ICO is over");
        
        // 1 ETH = 10 Tokens (1 Token = 0.1 ETH)
        require(msg.value == numTokens * 10 / 100, "wrong ETH amount sent");

        token.mint(msg.sender, numTokens);
    }

    function refund(uint256 numTokens) public {

        require(block.timestamp < startTime + SALE_PERIOD, "ICO is over");

        token.burn(msg.sender, numTokens);

        // 1 ETH = 10 Tokens (1 Token = 0.1 ETH)
        payable(msg.sender).call{value: numTokens * 10 / 100}("");
    }

    function adminWithdraw() external onlyAdmin {
        require(block.timestamp > startTime + SALE_PERIOD, "only when sale is over");
        payable(msg.sender).call{value: address(this).balance}("");
    }

    function adminMint(address _to, uint256 _amount) external onlyAdmin {
        token.mint(_to, _amount);
    }

    function changeAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0));
        admin = _newAdmin;
    }
}
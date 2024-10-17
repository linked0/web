// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policyGPL-3.0-or-later 
pragma solidity ^0.8.13;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title HackersToken
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract HackersToken is ERC20 {

    address public owner;
    
    constructor() ERC20("Hackers Token", "HTK") {
        owner = msg.sender;
    }

    function mint(address _to, uint _amount) external {
        require(msg.sender == owner, "Not Owner");
        _mint(_to, _amount);
    }
}


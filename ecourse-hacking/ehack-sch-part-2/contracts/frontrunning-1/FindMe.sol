// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
pragma solidity ^0.8.13;

/**
 * @title FindMe
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract FindMe {
    bytes32 public constant hash =
        0x564ccaf7594d66b1eaaea24fe01f0585bf52ee70852af4eac0cc4b04711cd0e2;

    constructor() payable {}

    function claim(string memory solution) public {
        require(
            hash == keccak256(abi.encodePacked(solution)),
            "Incorrect response"
        );
        require(address(this).balance >= 10 ether, "Not enough ether");
        (bool sent, ) = msg.sender.call{value: 10 ether}("");

        require(sent, "Failed to send Ether");
    }

    function funnyFunction() public pure returns (string memory) {
        return
            "I am a funny function, I am not used for anything, I am just here to make you laugh";
    }

    function complicateFunction() public pure returns (string memory) {
        for (uint256 i = 0; i < 100; i++) {
            if (i == 50) {
                break;
            }
        }

        return
            "I am a complicate function, I am not used for anything, I am just here to make you cry";
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}

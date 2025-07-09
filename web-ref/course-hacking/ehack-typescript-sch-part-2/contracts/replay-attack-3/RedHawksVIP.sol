// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title RedHawksVIP
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract RedHawksVIP is ERC721 {
    using ECDSA for bytes32;

    // Constants
    uint16 public constant MAX_SUPPLY = 180; // 180 Members
    bytes32 private constant _TYPE_HASH =
        keccak256("EIP712Domain(uint256 chainId,address verifyingContract)");

    // Variables
    uint16 public currentSupply;
    address public vouchersSigner;
    mapping(bytes => mapping(address => bool)) public usedVouchers;

    struct VoucherData {
        uint amountOfTickets;
        string password;
    }

    constructor(address _vouchersSigner) ERC721("VIP Futball Club", "VIP") {
        require(_vouchersSigner != address(0), "Invalid Signer");
        vouchersSigner = _vouchersSigner;
        currentSupply = 0;
    }

    function mint(
        uint16 amountOfTickets,
        string memory password,
        bytes memory signature
    ) external {
        // Verify voucher
        VoucherData memory voucherData = VoucherData(amountOfTickets, password);
        _verifyVoucher(voucherData, signature);

        // Make sure we didn't reach max supply
        uint16 toMint = amountOfTickets;
        if (currentSupply + toMint > MAX_SUPPLY) {
            toMint = MAX_SUPPLY - currentSupply;
        }

        // Mint member club tickets
        uint16 tokenId;
        for (uint i = 0; i < toMint; i++) {
            currentSupply += 1;
            tokenId = currentSupply;
            _mint(msg.sender, tokenId);
        }
    }

    function _verifyVoucher(
        VoucherData memory data,
        bytes memory signature
    ) internal {
        require(!usedVouchers[signature][msg.sender], "Voucher used");

        bytes32 dataHash = _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256(
                        "VoucherData(uint256 amountOfTickets,string password)"
                    ),
                    data.amountOfTickets,
                    keccak256(bytes(data.password)) // Only hash string
                )
            )
        );

        address recoveredAddress = dataHash.recover(signature);
        require(recoveredAddress == vouchersSigner, "Invalid voucher");
        usedVouchers[signature][msg.sender] = true;
    }

    function _domainSeparatorV4() internal view returns (bytes32) {
        return keccak256(abi.encode(_TYPE_HASH, block.chainid, address(this)));
    }

    function _hashTypedDataV4(
        bytes32 structHash
    ) internal view virtual returns (bytes32) {
        return ECDSA.toTypedDataHash(_domainSeparatorV4(), structHash);
    }
}

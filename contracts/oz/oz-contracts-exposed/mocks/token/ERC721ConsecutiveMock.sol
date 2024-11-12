// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.6.0;

import "../../../contracts/mocks/token/ERC721ConsecutiveMock.sol";
import "../../../contracts/token/ERC721/extensions/ERC721Votes.sol";
import "../../../contracts/governance/utils/Votes.sol";
import "../../../contracts/interfaces/IERC5805.sol";
import "../../../contracts/governance/utils/IVotes.sol";
import "../../../contracts/interfaces/IERC6372.sol";
import "../../../contracts/utils/Nonces.sol";
import "../../../contracts/utils/cryptography/EIP712.sol";
import "../../../contracts/interfaces/IERC5267.sol";
import "../../../contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "../../../contracts/utils/Pausable.sol";
import "../../../contracts/token/ERC721/extensions/ERC721Consecutive.sol";
import "../../../contracts/token/ERC721/ERC721.sol";
import "../../../contracts/interfaces/draft-IERC6093.sol";
import "../../../contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "../../../contracts/token/ERC721/IERC721.sol";
import "../../../contracts/utils/introspection/ERC165.sol";
import "../../../contracts/utils/introspection/IERC165.sol";
import "../../../contracts/utils/Context.sol";
import "../../../contracts/interfaces/IERC2309.sol";
import "../../../contracts/utils/structs/Checkpoints.sol";
import "../../../contracts/utils/math/SafeCast.sol";
import "../../../contracts/utils/cryptography/ECDSA.sol";
import "../../../contracts/utils/types/Time.sol";
import "../../../contracts/utils/cryptography/MessageHashUtils.sol";
import "../../../contracts/utils/ShortStrings.sol";
import "../../../contracts/utils/structs/BitMaps.sol";
import "../../../contracts/token/ERC721/utils/ERC721Utils.sol";
import "../../../contracts/utils/Strings.sol";
import "../../../contracts/utils/math/Math.sol";
import "../../../contracts/utils/StorageSlot.sol";
import "../../../contracts/token/ERC721/IERC721Receiver.sol";
import "../../../contracts/utils/math/SignedMath.sol";
import "../../../contracts/utils/Panic.sol";

contract $ERC721ConsecutiveMock is ERC721ConsecutiveMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    event return$_update(address ret0);

    event return$_useNonce(uint256 ret0);

    event return$_mintConsecutive(uint96 ret0);

    constructor(string memory name, string memory symbol, uint96 offset, address[] memory delegates, address[] memory receivers, uint96[] memory amounts) ERC721ConsecutiveMock(name, symbol, offset, delegates, receivers, amounts) payable {
    }

    function $_firstConsecutiveId() external view returns (uint96 ret0) {
        (ret0) = super._firstConsecutiveId();
    }

    function $_ownerOf(uint256 tokenId) external view returns (address ret0) {
        (ret0) = super._ownerOf(tokenId);
    }

    function $_update(address to,uint256 tokenId,address auth) external returns (address ret0) {
        (ret0) = super._update(to,tokenId,auth);
        emit return$_update(ret0);
    }

    function $_increaseBalance(address account,uint128 amount) external {
        super._increaseBalance(account,amount);
    }

    function $_getVotingUnits(address account) external view returns (uint256 ret0) {
        (ret0) = super._getVotingUnits(account);
    }

    function $_getTotalSupply() external view returns (uint256 ret0) {
        (ret0) = super._getTotalSupply();
    }

    function $_delegate(address account,address delegatee) external {
        super._delegate(account,delegatee);
    }

    function $_transferVotingUnits(address from,address to,uint256 amount) external {
        super._transferVotingUnits(from,to,amount);
    }

    function $_numCheckpoints(address account) external view returns (uint32 ret0) {
        (ret0) = super._numCheckpoints(account);
    }

    function $_checkpoints(address account,uint32 pos) external view returns (Checkpoints.Checkpoint208 memory ret0) {
        (ret0) = super._checkpoints(account,pos);
    }

    function $_useNonce(address owner) external returns (uint256 ret0) {
        (ret0) = super._useNonce(owner);
        emit return$_useNonce(ret0);
    }

    function $_useCheckedNonce(address owner,uint256 nonce) external {
        super._useCheckedNonce(owner,nonce);
    }

    function $_domainSeparatorV4() external view returns (bytes32 ret0) {
        (ret0) = super._domainSeparatorV4();
    }

    function $_hashTypedDataV4(bytes32 structHash) external view returns (bytes32 ret0) {
        (ret0) = super._hashTypedDataV4(structHash);
    }

    function $_EIP712Name() external view returns (string memory ret0) {
        (ret0) = super._EIP712Name();
    }

    function $_EIP712Version() external view returns (string memory ret0) {
        (ret0) = super._EIP712Version();
    }

    function $_requireNotPaused() external view {
        super._requireNotPaused();
    }

    function $_requirePaused() external view {
        super._requirePaused();
    }

    function $_pause() external {
        super._pause();
    }

    function $_unpause() external {
        super._unpause();
    }

    function $_maxBatchSize() external view returns (uint96 ret0) {
        (ret0) = super._maxBatchSize();
    }

    function $_mintConsecutive(address to,uint96 batchSize) external returns (uint96 ret0) {
        (ret0) = super._mintConsecutive(to,batchSize);
        emit return$_mintConsecutive(ret0);
    }

    function $_baseURI() external view returns (string memory ret0) {
        (ret0) = super._baseURI();
    }

    function $_getApproved(uint256 tokenId) external view returns (address ret0) {
        (ret0) = super._getApproved(tokenId);
    }

    function $_isAuthorized(address owner,address spender,uint256 tokenId) external view returns (bool ret0) {
        (ret0) = super._isAuthorized(owner,spender,tokenId);
    }

    function $_checkAuthorized(address owner,address spender,uint256 tokenId) external view {
        super._checkAuthorized(owner,spender,tokenId);
    }

    function $_mint(address to,uint256 tokenId) external {
        super._mint(to,tokenId);
    }

    function $_safeMint(address to,uint256 tokenId) external {
        super._safeMint(to,tokenId);
    }

    function $_safeMint(address to,uint256 tokenId,bytes calldata data) external {
        super._safeMint(to,tokenId,data);
    }

    function $_burn(uint256 tokenId) external {
        super._burn(tokenId);
    }

    function $_transfer(address from,address to,uint256 tokenId) external {
        super._transfer(from,to,tokenId);
    }

    function $_safeTransfer(address from,address to,uint256 tokenId) external {
        super._safeTransfer(from,to,tokenId);
    }

    function $_safeTransfer(address from,address to,uint256 tokenId,bytes calldata data) external {
        super._safeTransfer(from,to,tokenId,data);
    }

    function $_approve(address to,uint256 tokenId,address auth) external {
        super._approve(to,tokenId,auth);
    }

    function $_approve(address to,uint256 tokenId,address auth,bool emitEvent) external {
        super._approve(to,tokenId,auth,emitEvent);
    }

    function $_setApprovalForAll(address owner,address operator,bool approved) external {
        super._setApprovalForAll(owner,operator,approved);
    }

    function $_requireOwned(uint256 tokenId) external view returns (address ret0) {
        (ret0) = super._requireOwned(tokenId);
    }

    function $_msgSender() external view returns (address ret0) {
        (ret0) = super._msgSender();
    }

    function $_msgData() external view returns (bytes memory ret0) {
        (ret0) = super._msgData();
    }

    function $_contextSuffixLength() external view returns (uint256 ret0) {
        (ret0) = super._contextSuffixLength();
    }

    receive() external payable {}
}

contract $ERC721ConsecutiveNoConstructorMintMock is ERC721ConsecutiveNoConstructorMintMock {
    bytes32 public constant __hh_exposed_bytecode_marker = "hardhat-exposed";

    event return$_mintConsecutive(uint96 ret0);

    event return$_update(address ret0);

    constructor(string memory name, string memory symbol) ERC721ConsecutiveNoConstructorMintMock(name, symbol) payable {
    }

    function $_maxBatchSize() external view returns (uint96 ret0) {
        (ret0) = super._maxBatchSize();
    }

    function $_ownerOf(uint256 tokenId) external view returns (address ret0) {
        (ret0) = super._ownerOf(tokenId);
    }

    function $_mintConsecutive(address to,uint96 batchSize) external returns (uint96 ret0) {
        (ret0) = super._mintConsecutive(to,batchSize);
        emit return$_mintConsecutive(ret0);
    }

    function $_update(address to,uint256 tokenId,address auth) external returns (address ret0) {
        (ret0) = super._update(to,tokenId,auth);
        emit return$_update(ret0);
    }

    function $_firstConsecutiveId() external view returns (uint96 ret0) {
        (ret0) = super._firstConsecutiveId();
    }

    function $_baseURI() external view returns (string memory ret0) {
        (ret0) = super._baseURI();
    }

    function $_getApproved(uint256 tokenId) external view returns (address ret0) {
        (ret0) = super._getApproved(tokenId);
    }

    function $_isAuthorized(address owner,address spender,uint256 tokenId) external view returns (bool ret0) {
        (ret0) = super._isAuthorized(owner,spender,tokenId);
    }

    function $_checkAuthorized(address owner,address spender,uint256 tokenId) external view {
        super._checkAuthorized(owner,spender,tokenId);
    }

    function $_increaseBalance(address account,uint128 value) external {
        super._increaseBalance(account,value);
    }

    function $_mint(address to,uint256 tokenId) external {
        super._mint(to,tokenId);
    }

    function $_safeMint(address to,uint256 tokenId) external {
        super._safeMint(to,tokenId);
    }

    function $_safeMint(address to,uint256 tokenId,bytes calldata data) external {
        super._safeMint(to,tokenId,data);
    }

    function $_burn(uint256 tokenId) external {
        super._burn(tokenId);
    }

    function $_transfer(address from,address to,uint256 tokenId) external {
        super._transfer(from,to,tokenId);
    }

    function $_safeTransfer(address from,address to,uint256 tokenId) external {
        super._safeTransfer(from,to,tokenId);
    }

    function $_safeTransfer(address from,address to,uint256 tokenId,bytes calldata data) external {
        super._safeTransfer(from,to,tokenId,data);
    }

    function $_approve(address to,uint256 tokenId,address auth) external {
        super._approve(to,tokenId,auth);
    }

    function $_approve(address to,uint256 tokenId,address auth,bool emitEvent) external {
        super._approve(to,tokenId,auth,emitEvent);
    }

    function $_setApprovalForAll(address owner,address operator,bool approved) external {
        super._setApprovalForAll(owner,operator,approved);
    }

    function $_requireOwned(uint256 tokenId) external view returns (address ret0) {
        (ret0) = super._requireOwned(tokenId);
    }

    function $_msgSender() external view returns (address ret0) {
        (ret0) = super._msgSender();
    }

    function $_msgData() external view returns (bytes memory ret0) {
        (ret0) = super._msgData();
    }

    function $_contextSuffixLength() external view returns (uint256 ret0) {
        (ret0) = super._contextSuffixLength();
    }

    receive() external payable {}
}

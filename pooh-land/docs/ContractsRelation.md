# The relation between contracts on OpenSea

There are six contracts that consist the OpenSea marketplace as follows.
* Seaport
* ConduitController
* ConduitCreator
* Conduit
* SharedStorefrontLazyMintAdapter
* AssetContractShared

## SharedStorefrontLazyMintAdapter contract
It has two main constant values that indicates addresses of the `Seaport` and `Conduit` contracts.

```solidity
contract SharedStorefrontLazyMintAdapter {
    IERC1155 immutable ssfToken;
    address private constant SEAPORT =
    0x00000000006c3852cbEf3e08E8dF289169EdE581;
    address private constant CONDUIT =
    0x1E0049783F008A0085193E00003D00cd54003c71;

    ...
}
```

We should make these contants variables and pass in these addresses in the constructor of our `SharedStorefrontLazyMintAdapter` contract.

And the constructor of the contract also has the address of an `ERC1155` compatible contract.
```solidity
constructor(address tokenAddress) {
    ssfToken = IERC1155(tokenAddress);
}
```

The value is actually the address of `AssetContractShared` contract in this case as shown on [the detail page](https://goerli.etherscan.io/address/0x804159144AEFB1Dc17B171afCefA5B33746c722F#code) of `Goerli` Etherscan.
```
-----Decoded View---------------
Arg [0] : tokenAddress (address): 0xf4910C763eD4e47A585E2D34baA9A4b611aE448C
```

## Conduit contract
```solidity
/**
 * @title Conduit
 * @author 0age
 * @notice This contract serves as an originator for "proxied" transfers. Each
 *         conduit is deployed and controlled by a "conduit controller" that can
 *         add and remove "channels" or contracts that can instruct the conduit
 *         to transfer approved ERC20/721/1155 tokens. *IMPORTANT NOTE: each
 *         conduit has an owner that can arbitrarily add or remove channels, and
 *         a malicious or negligent owner can add a channel that allows for any
 *         approved ERC20/721/1155 tokens to be taken immediately — be extremely
 *         cautious with what conduits you give token approvals to!*
 */
```

We should deploy `Conduit` contract by calling `createConduit` function of `ConduitController` contract or `ConduitCreater`contract.

The address of the deployed `Conduit` contract is set to `0x1E0049783F008A0085193E00003D00cd54003c71` in this case and you can see [the transaction of the contract creation](https://goerli.etherscan.io/tx/0xbdd01e7fe6c10a76151f055261a0fe26c847a97b6d465040ee81fd75861d7f14) in the Goerli Etherscan.

The input data is as follows.
```
Function: createConduit(address conduitController, bytes32 conduitKey, address initialOwner)

MethodID: 0xc773d1ee
[0]:  00000000000000000000000000000000f9490004c11cef243f5400493c00ad63
[1]:  0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000
[2]:  000000000000000000000000939c8d89ebc11fa45e576215e2353673ad0ba18a
```

The related test codes in as follows that we should analyze more.
* transferhelper.spec.ts
* conduit.spec.ts

## AssetContractShared contract
The constructor of this contract has parameters to be analyzed more named `_proxyRegistryAddress` and `_migrationAddress`.

```solidity
constructor(
    string memory _name,
    string memory _symbol,
    address _proxyRegistryAddress,
    string memory _templateURI,
    address _migrationAddress
) AssetContract(_name, _symbol, _proxyRegistryAddress, _templateURI) {
    migrationTarget = AssetContractShared(_migrationAddress);
}
```

But these values are in fact `null` in [the detail page](https://goerli.etherscan.io/address/0xf4910c763ed4e47a585e2d34baa9a4b611ae448c#code) on the `Goerli` Etherscan as shown as follows.
```
-----Decoded View---------------
Arg [0] : _name (string): OpenSea Collections
Arg [1] : _symbol (string): OPENSTORE
Arg [2] : _proxyRegistryAddress (address): 0x0000000000000000000000000000000000000000
Arg [3] : _templateURI (string): 
Arg [4] : _migrationAddress (address): 0x0000000000000000000000000000000000000000
```

## The way a Conduit is used with setApprovalForAll
The code excerpt from `test/conduit.spec.ts`.

```typescript
await conduitController
  .connect(owner)
  .updateChannel(tempConduit.address, seller.address, true);

// Seller mints nft
const nftId = randomBN();
await testERC721.mint(seller.address, nftId);

// Check ownership
expect(await testERC721.ownerOf(nftId)).to.equal(seller.address);

// Set approval of nft
await expect(
  testERC721.connect(seller).setApprovalForAll(tempConduit.address, true)
)
  .to.emit(testERC721, "ApprovalForAll")
  .withArgs(seller.address, tempConduit.address, true);

const secondNftId = random128();
const amount = random128().add(1);
await testERC1155.mint(seller.address, secondNftId, amount);

await expect(
  testERC1155.connect(seller).setApprovalForAll(tempConduit.address, true)
)
  .to.emit(testERC1155, "ApprovalForAll")
  .withArgs(seller.address, tempConduit.address, true);

// Check ownership
expect(await testERC1155.balanceOf(seller.address, secondNftId)).to.equal(
  amount
);

// Send an ERC721 and ERC1155
await tempConduit.connect(seller).execute([
  {
    itemType: 2, // ERC721
    token: testERC721.address,
    from: seller.address,
    to: buyer.address,
    identifier: nftId,
    amount: ethers.BigNumber.from(1),
  },
  {
    itemType: 3, // ERC1155
    token: testERC1155.address,
    from: seller.address,
    to: buyer.address,
    identifier: secondNftId,
    amount: amount.sub(10),
  },
]);
```

## The way a Conduit is used in SharedStorefrontLazyMintAdapter

```solidity
modifier onlySeaportOrConduit() {
    if (msg.sender != CONDUIT && msg.sender != SEAPORT) {
        revert UnauthorizedCaller();
    }
    _;
}

/**
 * @notice stub method that performs two checks before calling real SSF safeTransferFrom
 *   1. check that the caller is a valid proxy (Seaport or OpenSea conduit)
 *   2. check that the token spender owns enough tokens, or is the creator of
 *      the token and not all tokens have been minted yet
 */
function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    uint256 amount,
    bytes memory
) public onlySeaportOrConduit onlyCreatorLazyMint(from, tokenId, amount) {
    // Seaport 1.1 always calls safeTransferFrom with empty data
    ssfToken.safeTransferFrom(from, to, tokenId, amount, "");
}
```
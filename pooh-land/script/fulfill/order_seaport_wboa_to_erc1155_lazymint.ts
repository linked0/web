/*******************************************************************************

    Script for fulfilling an order without any conduit, which offers WBOA
    tokens and sets ERC1155(AssetContractShared) tokens as consideration.
    And this is for lazy minting which means the fulfiller has not minted
    the ERC1155 tokens yet.

*******************************************************************************/

import { NonceManager } from "@ethersproject/experimental";
import { BigNumber, BigNumberish, Wallet } from "ethers";
import { ethers } from "hardhat";
import { getItemETH, toBN, toKey } from "../../test/utils/encoding";
import { Seaport, SharedStorefrontLazyMintAdapter } from "../../typechain-types";
import { GasPriceManager } from "../../utils/GasPriceManager";
import {
    createOrder,
    depositToWBoa,
    depositToWboa,
    depositToWBOA,
    displayBoaBalance,
    displayNFTBalance,
    displayWBoaBalance,
    displayWBOABalance,
    setAssetContract,
    setContracts,
    setSeaport,
    setWBoaContract,
    setWBOAContract,
} from "../../utils/CommonFunctions";
import type { ConsiderationItem, OfferItem } from "../../test/utils/types";
import { createTokenId } from "../../utils/ParseTokenID";

const ZeroAddress = "0x0000000000000000000000000000000000000000";

async function main() {
    const SeaportFacotry = await ethers.getContractFactory("Seaport");
    const StorefrontFactory = await ethers.getContractFactory("SharedStorefrontLazyMintAdapter");
    const AssetContractFactory = await ethers.getContractFactory("AssetContractShared");
    const WBOAFactory = await ethers.getContractFactory("WETH");
    const provider = ethers.provider;

    const admin = new Wallet(process.env.ADMIN_KEY || "");
    const adminSigner = new NonceManager(new GasPriceManager(provider.getSigner(admin.address)));
    const nftSeller = new Wallet(process.env.ORDER_NFT_SELLER_KEY || "");
    const nftSellerSigner = new NonceManager(new GasPriceManager(provider.getSigner(nftSeller.address)));
    const nftBuyer = new Wallet(process.env.ORDER_NFT_BUYER_KEY || "");
    const nftBuyerSigner = new NonceManager(new GasPriceManager(provider.getSigner(nftBuyer.address)));

    const marketplace = await SeaportFacotry.attach(process.env.SEAPORT_ADDRESS || "");
    const storefront = await StorefrontFactory.attach(process.env.LAZY_MINT_ADAPTER_ADDRESS || "");
    const assetToken = await AssetContractFactory.attach(process.env.ASSET_CONTRACT_SHARED_ADDRESS || "");
    const wboaToken = await WBOAFactory.attach(process.env.WBOA_ADDRESS);

    const quantity = Number(process.env.SPIDER_VERSE_NFT_QUANTITY || "1");
    const tokenIndex = BigNumber.from(process.env.SPIDER_VERSE_NFT_INDEX || "0");
    const data = process.env.SPIDER_VERSE_NFT_DATA || "";
    const newTokenId = createTokenId(nftSeller.address, tokenIndex, quantity);

    setContracts(marketplace, assetToken, wboaToken);

    // Current status of seller, buyer, and nft
    await displayNFTBalance("Seller", newTokenId, nftSeller.address);
    await displayBoaBalance("Buyer", nftBuyer.address);
    await displayBoaBalance("Seller", nftSeller.address);

    // deposit BOA to WBOA contract from NFT buyer
    const totalDeposit = ethers.utils.parseEther("1.0");
    await depositToWBoa(nftBuyer.address, totalDeposit);
    await displayWBoaBalance("Buyer", nftBuyer.address);
    await displayWBoaBalance("Seller", nftSeller.address);

    // approve WOBAs of seller to the Seaport
    const tokenPriceAmount = ethers.utils.parseEther("0.1");
    await wboaToken.connect(nftBuyerSigner).approve(marketplace.address, tokenPriceAmount);

    // create an offer that comes from buyer
    const offer: OfferItem[] = [
        {
            itemType: 1,
            token: wboaToken.address,
            identifierOrCriteria: toBN(0),
            startAmount: tokenPriceAmount,
            endAmount: tokenPriceAmount,
        },
    ];

    // create considerations
    const nftAmount: BigNumberish = BigNumber.from(1);
    const consideration: ConsiderationItem[] = [
        {
            itemType: 3,
            token: storefront.address,
            identifierOrCriteria: toBN(newTokenId),
            startAmount: toBN(nftAmount),
            endAmount: toBN(nftAmount),
            recipient: nftBuyer.address,
        },
    ];

    // creator an order
    const { order, orderHash, value } = await createOrder(
        nftBuyer,
        ZeroAddress,
        offer,
        consideration,
        1 // PARTIAL_OPEN
    );

    console.log("orderHash:", orderHash);
    console.log("value:", value);
    console.log("order:", order);
    console.log("offer:", order.parameters.offer);
    console.log("consideration:", order.parameters.consideration);

    const tx = marketplace.connect(nftSellerSigner).fulfillOrder(order, toKey(0), {
        value,
    });

    await (await tx).wait();
    console.log("NFT to transfer:", newTokenId);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

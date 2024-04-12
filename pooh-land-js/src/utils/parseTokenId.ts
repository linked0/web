import { BigNumber } from "ethers";
import { utils } from "ethers";

export function parseTokenId(tokenId: string): [string, BigNumber, number] {
    const ADDRESS_BITS = 160;
    const INDEX_BITS = 56;
    const SUPPLY_BITS = 40;

    const lastNftId = BigNumber.from(tokenId);
    const SUPPLY_MASK = BigNumber.from(1).shl(SUPPLY_BITS).sub(1);
    const INDEX_MASK = BigNumber.from(1)
        .shl(INDEX_BITS + SUPPLY_BITS)
        .sub(1)
        .xor(SUPPLY_MASK);

    const address = lastNftId.shr(INDEX_BITS + SUPPLY_BITS).toHexString();
    const tokenIndex = lastNftId.and(INDEX_MASK).shr(SUPPLY_BITS);
    const maxSupply = lastNftId.and(SUPPLY_MASK).toNumber();

    return [address, tokenIndex, maxSupply];
}

export function createTokenId(address: string, index: BigNumber, maxSupply: number): BigNumber {
    let makerPart = BigNumber.from(utils.hexZeroPad(address, 32));
    makerPart = makerPart.shl(96); // shift 12 bytees
    const newIdPart = index.shl(40);
    const quantityPart = BigNumber.from(maxSupply);
    const tokenId = makerPart.add(newIdPart).add(quantityPart);

    return tokenId;
}

import { IERC20 } from "../typechain-types";

export const displayERC20Balance = async (token: IERC20, owner: string) => {
    const amount = await token.balanceOf(owner);
    const integerPart = amount / BigInt(10 ** 18);
    const decimalPart = amount % BigInt(10 ** 18);
    console.log(`Token balance: ${integerPart.toString()}.${decimalPart.toString()}`);
};

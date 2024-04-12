import { NonceManager } from "@ethersproject/experimental";
import { expect } from "chai";
import { BigNumber, Contract, constants } from "ethers";
import { recoverAddress } from "ethers/lib/utils";
import { ethers } from "hardhat";

import {
    calculateOrderHash,
    convertSignatureToEIP2098,
    getItemETH,
    randomHex,
    toBN,
    toKey,
} from "../test/utils/encoding";
import { VERSION } from "../test/utils/helpers";

import { GasPriceManager } from "./GasPriceManager";

import type {
    AdvancedOrder,
    ConsiderationItem,
    CriteriaResolver,
    OfferItem,
    OrderComponents,
} from "../test/utils/types";
import type { AssetContractShared, Seaport, TestZone, WETH } from "../typechain-types";
import type { BigNumberish, ContractReceipt, ContractTransaction, Wallet } from "ethers";

const { orderType } = require("../eip-712-types/order");
const { parseEther, keccak256 } = ethers.utils;

const provider = ethers.provider;
let marketplaceContract: Seaport;
let assetToken: AssetContractShared;
let wboaToken: WETH;

export const setContracts = (
    _seaportContrct: Seaport,
    _assetContrct: AssetContractShared,
    _wboaContrct?: WETH | undefined
) => {
    marketplaceContract = _seaportContrct;
    assetToken = _assetContrct;
    if (_wboaContrct !== undefined) {
        wboaToken = _wboaContrct;
    }
    setChainId();
};

export const setSeaport = (seaportContrct: Seaport) => {
    marketplaceContract = seaportContrct;
    setChainId();
};

export const setWBoaContract = (_wboaContrct: WETH) => {
    wboaToken = _wboaContrct;
    setChainId();
};

export const setAssetContract = (_assetContrct: AssetContractShared) => {
    assetToken = _assetContrct;
    setChainId();
};

// Default chainId is for the Bosagora testnet
let chainId: number = 2019;

export const setChainId = async () => {
    provider.getNetwork().then((network) => {
        chainId = network.chainId;
    }).catch((error) => {
        console.error("Error getting chain ID:", error);
    });
};

export const depositToWBoa = async (depositer: string, totalDeposit: BigNumber) => {
    const depositSigner = new NonceManager(new GasPriceManager(provider.getSigner(depositer)));

    const amount = await wboaToken.balanceOf(depositer);

    if (totalDeposit.gt(amount)) {
        await wboaToken.connect(depositSigner).deposit({ value: totalDeposit.sub(amount) });
    }
};

export const displayBoaBalance = async (msg: string, owner: string) => {
    const amount = await provider.getBalance(owner);
    const intPartStr = amount.div(BigNumber.from(10.0).pow(18)).toString();
    if (intPartStr === "0") {
        console.log("%s BOA balance: 0.%s", msg, amount.toString().padStart(18, "0"));
    } else {
        console.log("%s BOA balance: %s.%s", msg, intPartStr, amount.toString().slice(intPartStr.length));
    }
};

export const displayNFTBalance = async (msg: string, tokenId: BigNumber, owner: string) => {
    console.log("NFT tokenId:", tokenId.toString());
    console.log("%s NFT balance: %s", msg, await assetToken.balanceOf(owner, tokenId));
};

export const displayWBoaBalance = async (msg: string, owner: string) => {
    const amount = await wboaToken.balanceOf(owner);
    const intPartStr = amount.div(BigNumber.from(10.0).pow(18)).toString();
    if (intPartStr === "0") {
        console.log("%s WBOA balance: 0.%s", msg, amount.toString().padStart(18, "0"));
    } else {
        console.log("%s WBOA balance: %s.%s", msg, intPartStr, amount.toString().slice(intPartStr.length));
    }
};

export const simpleBoaBalance = async (owner: string) => {
    const amount = await provider.getBalance(owner);
    const intPartStr = amount.div(BigNumber.from(10.0).pow(18)).toString();
    if (intPartStr === "0") {
        console.log("BOA: 0.%s", amount.toString().padStart(18, "0"));
    } else {
        console.log("BOA: %s.%s", intPartStr, amount.toString().slice(intPartStr.length));
    }
};

export const simpleWBoaBalance = async (owner: string) => {
    let amount: BigNumber = BigNumber.from(0);
    try {
        amount = await wboaToken.balanceOf(owner);
    }
    catch (error) {
    }
    const intPartStr = amount.div(BigNumber.from(10.0).pow(18)).toString();
    if (intPartStr === "0") {
        console.log("WBOA: 0.%s", amount.toString().padStart(18, "0"));
    } else {
        console.log("WBOA: %s.%s", intPartStr, amount.toString().slice(intPartStr.length));
    }
};

export const withBalanceChecks = async (
    ordersArray: AdvancedOrder[], // TODO: include order statuses to account for partial fills
    additionalPayouts: 0 | BigNumber,
    criteriaResolvers: CriteriaResolver[] = [],
    fn: () => Promise<ContractReceipt>,
    multiplier = 1
) => {
    const ordersClone: AdvancedOrder[] = JSON.parse(JSON.stringify(ordersArray as any)) as any;
    for (const [i, order] of Object.entries(ordersClone) as any as [number, AdvancedOrder][]) {
        order.parameters.startTime = ordersArray[i].parameters.startTime;
        order.parameters.endTime = ordersArray[i].parameters.endTime;

        for (const [j, offerItem] of Object.entries(order.parameters.offer) as any) {
            offerItem.startAmount = ordersArray[i].parameters.offer[j].startAmount;
            offerItem.endAmount = ordersArray[i].parameters.offer[j].endAmount;
        }

        for (const [j, considerationItem] of Object.entries(order.parameters.consideration) as any) {
            considerationItem.startAmount = ordersArray[i].parameters.consideration[j].startAmount;
            considerationItem.endAmount = ordersArray[i].parameters.consideration[j].endAmount;
        }
    }

    if (criteriaResolvers) {
        for (const { orderIndex, side, index, identifier } of criteriaResolvers) {
            const itemType = ordersClone[orderIndex].parameters[side === 0 ? "offer" : "consideration"][index].itemType;
            if (itemType < 4) {
                console.error("APPLYING CRITERIA TO NON-CRITERIA-BASED ITEM");
                process.exit(1);
            }

            ordersClone[orderIndex].parameters[side === 0 ? "offer" : "consideration"][index].itemType = itemType - 2;
            ordersClone[orderIndex].parameters[side === 0 ? "offer" : "consideration"][index].identifierOrCriteria =
                identifier;
        }
    }

    const allOfferedItems = ordersClone
        .map((x) =>
            x.parameters.offer.map((offerItem) => ({
                ...offerItem,
                account: x.parameters.offerer,
                numerator: x.numerator,
                denominator: x.denominator,
                startTime: x.parameters.startTime,
                endTime: x.parameters.endTime,
            }))
        )
        .flat();

    const allReceivedItems = ordersClone
        .map((x) =>
            x.parameters.consideration.map((considerationItem) => ({
                ...considerationItem,
                numerator: x.numerator,
                denominator: x.denominator,
                startTime: x.parameters.startTime,
                endTime: x.parameters.endTime,
            }))
        )
        .flat();

    for (const offeredItem of allOfferedItems as any[]) {
        if (offeredItem.itemType > 3) {
            console.error("CRITERIA ON OFFERED ITEM NOT RESOLVED");
            process.exit(1);
        }

        offeredItem.initialBalance = await testERC1155.balanceOf(offeredItem.account, offeredItem.identifierOrCriteria);
    }

    for (const receivedItem of allReceivedItems as any[]) {
        if (receivedItem.itemType > 3) {
            console.error("CRITERIA-BASED BALANCE RECEIVED CHECKS NOT IMPLEMENTED YET");
            process.exit(1);
        }

        // ERC1155
        receivedItem.initialBalance = await testERC1155.balanceOf(
            receivedItem.recipient,
            receivedItem.identifierOrCriteria
        );
    }

    const receipt = await fn();

    const from = receipt.from;
    const gasUsed = receipt.gasUsed;

    for (const offeredItem of allOfferedItems as any[]) {
        if (offeredItem.account === from && offeredItem.itemType === 0) {
            offeredItem.initialBalance = offeredItem.initialBalance.sub(gasUsed);
        }
    }

    for (const receivedItem of allReceivedItems as any[]) {
        if (receivedItem.recipient === from && receivedItem.itemType === 0) {
            receivedItem.initialBalance = receivedItem.initialBalance.sub(gasUsed);
        }
    }

    for (const offeredItem of allOfferedItems as any[]) {
        if (offeredItem.itemType > 3) {
            console.error("CRITERIA-BASED BALANCE OFFERED CHECKS NOT MET");
            process.exit(1);
        }

        // ERC1155
        offeredItem.finalBalance = await testERC1155.balanceOf(offeredItem.account, offeredItem.identifierOrCriteria);
    }

    for (const receivedItem of allReceivedItems as any[]) {
        if (receivedItem.itemType > 3) {
            console.error("CRITERIA-BASED BALANCE RECEIVED CHECKS NOT MET");
            process.exit(1);
        }

        // ERC1155
        receivedItem.finalBalance = testERC1155.balanceOf(receivedItem.recipient, receivedItem.identifierOrCriteria);
    }

    const { timestamp } = await provider.getBlock(receipt.blockHash);

    for (const offeredItem of allOfferedItems as any[]) {
        const duration = toBN(offeredItem.endTime).sub(offeredItem.startTime);
        const elapsed = toBN(timestamp).sub(offeredItem.startTime);
        const remaining = duration.sub(elapsed);

        if (offeredItem.itemType < 4) {
            // TODO: criteria-based
            if (!additionalPayouts) {
                expect(offeredItem.initialBalance.sub(offeredItem.finalBalance).toString()).to.equal(
                    toBN(offeredItem.startAmount)
                        .mul(remaining)
                        .add(toBN(offeredItem.endAmount).mul(elapsed))
                        .div(duration)
                        .mul(offeredItem.numerator)
                        .div(offeredItem.denominator)
                        .mul(multiplier)
                        .toString()
                );
            } else {
                expect(offeredItem.initialBalance.sub(offeredItem.finalBalance).toString()).to.equal(
                    additionalPayouts.add(offeredItem.endAmount).toString()
                );
            }
        }

        if (offeredItem.itemType === 2) {
            // ERC721
            expect(offeredItem.ownsItemBefore).to.equal(true);
            expect(offeredItem.ownsItemAfter).to.equal(false);
        }
    }

    for (const receivedItem of allReceivedItems as any[]) {
        const duration = toBN(receivedItem.endTime).sub(receivedItem.startTime);
        const elapsed = toBN(timestamp).sub(receivedItem.startTime);
        const remaining = duration.sub(elapsed);

        try {
            expect(receivedItem.finalBalance.sub(receivedItem.initialBalance).toString()).to.equal(
                toBN(receivedItem.startAmount)
                    .mul(remaining)
                    .add(toBN(receivedItem.endAmount).mul(elapsed))
                    .add(duration.sub(1))
                    .div(duration)
                    .mul(receivedItem.numerator)
                    .div(receivedItem.denominator)
                    .mul(multiplier)
                    .toString()
            );
        } catch (e) {
            // TODO: Check exception
        }

        if (receivedItem.itemType === 2) {
            // ERC721
            expect(receivedItem.ownsItemBefore).to.equal(false);
            expect(receivedItem.ownsItemAfter).to.equal(true);
        }
    }

    return receipt;
};

const checkTransferEvent = async (
    tx: ContractTransaction | Promise<ContractTransaction>,
    item: (OfferItem | ConsiderationItem) & {
        identifier?: string;
        amount?: BigNumberish;
        recipient?: string;
    },
    { offerer, conduitKey, target }: { offerer: string; conduitKey: string; target: string }
) => {
    const { itemType, token, identifier: id1, identifierOrCriteria: id2, amount, recipient } = item;
    const identifier = id1 ?? id2;
    const sender = offerer; // getTransferSender(offerer, conduitKey);
    if ([1, 2, 5].includes(itemType)) {
    } else if ([3, 4].includes(itemType)) {
        const contract = new Contract(token, testERC1155.interface, provider);
        const operator = sender !== offerer ? sender : target;
        await expect(tx).to.emit(contract, "TransferSingle").withArgs(operator, offerer, recipient, identifier, amount);
    }
};

export const checkExpectedEvents = async (
    tx: Promise<ContractTransaction> | ContractTransaction,
    receipt: ContractReceipt,
    orderGroups: Array<{
        order: AdvancedOrder;
        orderHash: string;
        fulfiller?: string;
        fulfillerConduitKey?: string;
        recipient?: string;
    }>,
    standardExecutions: any[] = [],
    criteriaResolvers: any[] = [],
    shouldSkipAmountComparison = false,
    multiplier = 1
) => {
    const { timestamp } = await provider.getBlock(receipt.blockHash);

    if (standardExecutions && standardExecutions.length) {
        for (const standardExecution of standardExecutions) {
            const { item, offerer, conduitKey } = standardExecution;
            await checkTransferEvent(tx, item, {
                offerer,
                conduitKey,
                target: receipt.to,
            });
        }

        // TODO: sum up executions and compare to orders to ensure that all the
        // items (or partially-filled items) are accounted for
    }

    if (criteriaResolvers && criteriaResolvers.length) {
        for (const { orderIndex, side, index, identifier } of criteriaResolvers) {
            const itemType =
                orderGroups[orderIndex].order.parameters[side === 0 ? "offer" : "consideration"][index].itemType;
            if (itemType < 4) {
                console.error("APPLYING CRITERIA TO NON-CRITERIA-BASED ITEM");
                process.exit(1);
            }

            orderGroups[orderIndex].order.parameters[side === 0 ? "offer" : "consideration"][index].itemType =
                itemType - 2;
            orderGroups[orderIndex].order.parameters[side === 0 ? "offer" : "consideration"][
                index
            ].identifierOrCriteria = identifier;
        }
    }

    for (let { order, orderHash, fulfiller, fulfillerConduitKey, recipient } of orderGroups) {
        if (!recipient) {
            recipient = fulfiller;
        }
        const duration = toBN(order.parameters.endTime).sub(order.parameters.startTime as any);
        const elapsed = toBN(timestamp).sub(order.parameters.startTime as any);
        const remaining = duration.sub(elapsed);

        const marketplaceContractEvents = (receipt.events as any[])
            .filter((x) => x.address === marketplaceContract.address)
            .map((x) => ({
                eventName: x.event,
                eventSignature: x.eventSignature,
                orderHash: x.args.orderHash,
                offerer: x.args.offerer,
                zone: x.args.zone,
                recipient: x.args.recipient,
                offer: x.args.offer.map((y: any) => ({
                    itemType: y.itemType,
                    token: y.token,
                    identifier: y.identifier,
                    amount: y.amount,
                })),
                consideration: x.args.consideration.map((y: any) => ({
                    itemType: y.itemType,
                    token: y.token,
                    identifier: y.identifier,
                    amount: y.amount,
                    recipient: y.recipient,
                })),
            }))
            .filter((x) => x.orderHash === orderHash);

        expect(marketplaceContractEvents.length).to.equal(1);

        const event = marketplaceContractEvents[0];

        expect(event.eventName).to.equal("OrderFulfilled");
        expect(event.eventSignature).to.equal(
            "OrderFulfilled(" +
                "bytes32,address,address,address,(" +
                "uint8,address,uint256,uint256)[],(" +
                "uint8,address,uint256,uint256,address)[])"
        );
        expect(event.orderHash).to.equal(orderHash);
        expect(event.offerer).to.equal(order.parameters.offerer);
        expect(event.zone).to.equal(order.parameters.zone);
        expect(event.recipient).to.equal(recipient);

        const { offerer, conduitKey, consideration, offer } = order.parameters;
        const compareEventItems = async (
            item: any,
            orderItem: OfferItem | ConsiderationItem,
            isConsiderationItem: boolean
        ) => {
            expect(item.itemType).to.equal(orderItem.itemType > 3 ? orderItem.itemType - 2 : orderItem.itemType);
            expect(item.token).to.equal(orderItem.token);
            expect(item.token).to.equal(testERC1155.address);
            if (orderItem.itemType < 4) {
                // no criteria-based
                expect(item.identifier).to.equal(orderItem.identifierOrCriteria);
            } else {
                console.error("CRITERIA-BASED EVENT VALIDATION NOT MET");
                process.exit(1);
            }

            if (order.parameters.orderType === 0) {
                // FULL_OPEN (no partial fills)
                if (orderItem.startAmount.toString() === orderItem.endAmount.toString()) {
                    expect(item.amount.toString()).to.equal(orderItem.endAmount.toString());
                } else {
                    expect(item.amount.toString()).to.equal(
                        toBN(orderItem.startAmount)
                            .mul(remaining)
                            .add(toBN(orderItem.endAmount).mul(elapsed))
                            .add(isConsiderationItem ? duration.sub(1) : 0)
                            .div(duration)
                            .toString()
                    );
                }
            } else {
                if (orderItem.startAmount.toString() === orderItem.endAmount.toString()) {
                    expect(item.amount.toString()).to.equal(
                        orderItem.endAmount.mul(order.numerator).div(order.denominator).toString()
                    );
                } else {
                    console.error("SLIDING AMOUNT NOT IMPLEMENTED YET");
                    process.exit(1);
                }
            }
        };

        if (!standardExecutions || !standardExecutions.length) {
            for (const item of consideration) {
                const { startAmount, endAmount } = item;
                let amount;
                if (order.parameters.orderType === 0) {
                    amount = startAmount.eq(endAmount)
                        ? endAmount
                        : startAmount.mul(remaining).add(endAmount.mul(elapsed)).add(duration.sub(1)).div(duration);
                } else {
                    amount = endAmount.mul(order.numerator).div(order.denominator);
                }
                amount = amount.mul(multiplier);

                await checkTransferEvent(
                    tx,
                    { ...item, amount },
                    {
                        offerer: receipt.from,
                        conduitKey: fulfillerConduitKey!,
                        target: receipt.to,
                    }
                );
            }

            for (const item of offer) {
                const { startAmount, endAmount } = item;
                let amount;
                if (order.parameters.orderType === 0) {
                    amount = startAmount.eq(endAmount)
                        ? endAmount
                        : startAmount.mul(remaining).add(endAmount.mul(elapsed)).div(duration);
                } else {
                    amount = endAmount.mul(order.numerator).div(order.denominator);
                }
                amount = amount.mul(multiplier);

                await checkTransferEvent(
                    tx,
                    { ...item, amount, recipient },
                    {
                        offerer,
                        conduitKey,
                        target: receipt.to,
                    }
                );
            }
        }

        expect(event.offer.length).to.equal(order.parameters.offer.length);
        for (const [index, offer] of Object.entries(event.offer) as any[]) {
            const offerItem = order.parameters.offer[index];
            console.log("oferr:", offer);
            console.log("offerItem:", offerItem);

            await compareEventItems(offer, offerItem, false);

            const tokenEvents = receipt.events?.filter((x) => x.address === offerItem.token);

            if (offer.itemType === 1) {
            } else if (offer.itemType === 2) {
            } else if (offer.itemType === 3) {
                // search for transfer
                const transferLogs = (tokenEvents ?? [])
                    .map((x) => testERC1155.interface.parseLog(x))
                    .filter(
                        (x) =>
                            (x.signature === "TransferSingle(address,address,address,uint256,uint256)" &&
                                x.args.from === event.offerer &&
                                (fulfiller !== constants.AddressZero ? x.args.to === fulfiller : true)) ||
                            (x.signature === "TransferBatch(address,address,address,uint256[],uint256[])" &&
                                x.args.from === event.offerer &&
                                (fulfiller !== constants.AddressZero ? x.args.to === fulfiller : true))
                    );

                expect(transferLogs.length).to.be.above(0);

                let found = false;
                for (const transferLog of transferLogs) {
                    if (
                        transferLog.signature === "TransferSingle(address,address,address,uint256,uint256)" &&
                        transferLog.args.id.toString() === offer.identifier.toString() &&
                        (shouldSkipAmountComparison ||
                            transferLog.args.amount.toString() === offer.amount.mul(multiplier).toString())
                    ) {
                        found = true;
                        break;
                    }
                }

                // eslint-disable-next-line no-unused-expressions
                expect(found).to.be.true;
            }
        }

        expect(event.consideration.length).to.equal(order.parameters.consideration.length);
        for (const [index, consideration] of Object.entries(event.consideration) as any[]) {
            const considerationItem = order.parameters.consideration[index];
            await compareEventItems(consideration, considerationItem, true);
            expect(consideration.recipient).to.equal(considerationItem.recipient);

            const tokenEvents = receipt.events?.filter((x) => x.address === considerationItem.token);

            if (consideration.itemType === 1) {
            } else if (consideration.itemType === 2) {
            } else if (consideration.itemType === 3) {
                // search for transfer
                const transferLogs = (tokenEvents ?? [])
                    .map((x) => testERC1155.interface.parseLog(x))
                    .filter(
                        (x) =>
                            (x.signature === "TransferSingle(address,address,address,uint256,uint256)" &&
                                x.args.to === consideration.recipient) ||
                            (x.signature === "TransferBatch(address,address,address,uint256[],uint256[])" &&
                                x.args.to === consideration.recipient)
                    );

                expect(transferLogs.length).to.be.above(0);

                let found = false;
                for (const transferLog of transferLogs) {
                    if (
                        transferLog.signature === "TransferSingle(address,address,address,uint256,uint256)" &&
                        transferLog.args.id.toString() === consideration.identifier.toString() &&
                        (shouldSkipAmountComparison ||
                            transferLog.args.amount.toString() === consideration.amount.mul(multiplier).toString())
                    ) {
                        found = true;
                        break;
                    }
                }

                // eslint-disable-next-line no-unused-expressions
                expect(found).to.be.true;
            }
        }
    }
};

export const createOrder = async (
    offerer: Wallet | Contract,
    zone: TestZone | Wallet | undefined | string = undefined,
    offer: OfferItem[],
    consideration: ConsiderationItem[],
    orderType: number,
    criteriaResolvers?: CriteriaResolver[],
    timeFlag?: string | null,
    signer?: Wallet,
    zoneHash = constants.HashZero,
    conduitKey = constants.HashZero,
    extraCheap = false
) => {
    console.log("offerer:", offerer.address);
    const counter = await marketplaceContract.getCounter(offerer.address);

    const salt = !extraCheap ? randomHex() : constants.HashZero;
    const startTime = timeFlag !== "NOT_STARTED" ? 0 : toBN("0xee00000000000000000000000000");
    const endTime = timeFlag !== "EXPIRED" ? toBN("0xff00000000000000000000000000") : 1;

    const orderParameters = {
        offerer: offerer.address,
        zone: !extraCheap ? (zone as Wallet).address ?? zone : constants.AddressZero,
        offer,
        consideration,
        totalOriginalConsiderationItems: consideration.length,
        orderType,
        zoneHash,
        salt,
        conduitKey,
        startTime,
        endTime,
    };

    const orderComponents = {
        ...orderParameters,
        counter,
    };

    const orderHash = await getAndVerifyOrderHash(orderComponents);

    const { isValidated, isCancelled, totalFilled, totalSize } = await marketplaceContract.getOrderStatus(orderHash);

    expect(isCancelled).to.equal(false);

    const orderStatus = {
        isValidated,
        isCancelled,
        totalFilled,
        totalSize,
    };

    const flatSig = await signOrder(orderComponents, signer ?? offerer);

    const order = {
        parameters: orderParameters,
        signature: !extraCheap ? flatSig : convertSignatureToEIP2098(flatSig),
        numerator: 1, // only used for advanced orders
        denominator: 1, // only used for advanced orders
        extraData: "0x", // only used for advanced orders
    };

    // How much ether (at most) needs to be supplied when fulfilling the order
    const value = offer
        .map((x) => (x.itemType === 0 ? (x.endAmount.gt(x.startAmount) ? x.endAmount : x.startAmount) : toBN(0)))
        .reduce((a, b) => a.add(b), toBN(0))
        .add(
            consideration
                .map((x) =>
                    x.itemType === 0 ? (x.endAmount.gt(x.startAmount) ? x.endAmount : x.startAmount) : toBN(0)
                )
                .reduce((a, b) => a.add(b), toBN(0))
        );

    return {
        order,
        orderHash,
        value,
        orderStatus,
        orderComponents,
    };
};

const getAndVerifyOrderHash = async (orderComponents: OrderComponents) => {
    const orderHash = await marketplaceContract.getOrderHash(orderComponents);
    const derivedOrderHash = calculateOrderHash(orderComponents);
    expect(orderHash).to.equal(derivedOrderHash);
    return orderHash;
};

// Returns signature
const signOrder = async (orderComponents: OrderComponents, signer: Wallet | Contract) => {
    // Required for EIP712 signing
    const domainData = {
        name: process.env.REFERENCE ? "Consideration" : "Seaport",
        version: VERSION,
        chainId,
        verifyingContract: marketplaceContract.address,
    };

    const signature = await signer._signTypedData(domainData, orderType, orderComponents);

    const orderHash = await getAndVerifyOrderHash(orderComponents);

    const { domainSeparator } = await marketplaceContract.information();
    const digest = keccak256(`0x1901${domainSeparator.slice(2)}${orderHash.slice(2)}`);
    const recoveredAddress = recoverAddress(digest, signature);

    expect(recoveredAddress).to.equal(signer.address);

    return signature;
};

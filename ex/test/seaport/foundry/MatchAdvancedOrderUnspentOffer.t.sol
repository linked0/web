// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import {ItemType} from "seaport-types/src/lib/ConsiderationEnums.sol";

import {Order} from "seaport-types/src/lib/ConsiderationStructs.sol";

import {ConsiderationInterface} from "seaport-types/src/interfaces/ConsiderationInterface.sol";

import {AdvancedOrder, OfferItem, ConsiderationItem, CriteriaResolver, Fulfillment} from "seaport-types/src/lib/ConsiderationStructs.sol";

import {BaseOrderTest} from "./utils/BaseOrderTest.sol";

import {Vm} from "forge-std/Vm.sol";

contract MatchOrderUnspentOfferTest is BaseOrderTest {
  struct Context {
    ConsiderationInterface seaport;
  }

  function test(
    function(Context memory) external fn,
    Context memory context
  ) internal {
    try fn(context) {
      fail(
        "Stateless test function should have reverted with assertion failure status."
      );
    } catch (bytes memory reason) {
      assertPass(reason);
    }
  }

  function setUpFilterOfferItemBySpecifyingOffererAsRecipient(
    Context memory context
  ) internal returns (AdvancedOrder[] memory, Fulfillment[] memory) {
    string memory offererName = "offerer";
    address offerer = makeAddr(offererName);
    string memory fulfillerName = "fulfiller";
    address fulfiller = makeAddr(fulfillerName);

    // allocate tokens and approvals
    test721_1.mint(offerer, 1);
    test721_2.mint(offerer, 1);
    token1.mint(fulfiller, 10000);
    vm.startPrank(offerer);
    test721_1.setApprovalForAll(address(context.seaport), true);
    test721_2.setApprovalForAll(address(context.seaport), true);
    vm.stopPrank();
    vm.prank(fulfiller);
    token1.approve(address(context.seaport), type(uint256).max);

    // configure orders
    addOfferItem(
      OfferItem({
        itemType: ItemType.ERC721,
        token: address(test721_1),
        identifierOrCriteria: 1,
        startAmount: 1,
        endAmount: 1
      })
    );
    // add another offer item, this time using test721_2
    addOfferItem(
      OfferItem({
        itemType: ItemType.ERC721,
        token: address(test721_2),
        identifierOrCriteria: 1,
        startAmount: 1,
        endAmount: 1
      })
    );

    // add a considerationItem of 10k of token1 with offerer as the payable recipient
    addConsiderationItem(
      ConsiderationItem({
        itemType: ItemType.ERC20,
        token: address(token1),
        identifierOrCriteria: 0,
        startAmount: 10000,
        endAmount: 10000,
        recipient: payable(offerer)
      })
    );
    Order memory offererOrder = createSignedOrder(context.seaport, offererName);

    // offer 10k of token1

    addOfferItem(
      OfferItem({
        itemType: ItemType.ERC20,
        token: address(token1),
        identifierOrCriteria: 0,
        startAmount: 10000,
        endAmount: 10000
      })
    );
    // add consideration item for test721_1 id 1 with fulfiller as recipient
    addConsiderationItem(
      ConsiderationItem({
        itemType: ItemType.ERC721,
        token: address(test721_1),
        identifierOrCriteria: 1,
        startAmount: 1,
        endAmount: 1,
        recipient: payable(fulfiller)
      })
    );
    // add consideration item for test721_2 id 1 with offerer as recipient, which we will try to filter out
    addConsiderationItem(
      ConsiderationItem({
        itemType: ItemType.ERC721,
        token: address(test721_2),
        identifierOrCriteria: 1,
        startAmount: 1,
        endAmount: 1,
        recipient: payable(offerer)
      })
    );
    Order memory fulfillerOrder = createSignedOrder(
      context.seaport,
      fulfillerName
    );

    Fulfillment[] memory _fulfillments = createFulfillmentsFromMirrorOrders(
      offererOrder.parameters,
      fulfillerOrder.parameters
    );

    AdvancedOrder memory offererAdvanced = toAdvancedOrder(offererOrder);
    AdvancedOrder memory fulfillerAdvanced = toAdvancedOrder(fulfillerOrder);

    AdvancedOrder[] memory orders = new AdvancedOrder[](2);
    orders[0] = offererAdvanced;
    orders[1] = fulfillerAdvanced;

    return (orders, _fulfillments);
  }

  // TODO: look into sporadic failures here
  function xtestSweepRemaining() public {
    test(this.execSweepRemaining, Context({seaport: consideration}));
    test(this.execSweepRemaining, Context({seaport: referenceConsideration}));
  }

  function setUpSweepRemaining(
    Context memory context
  ) internal returns (Order[] memory, Fulfillment[] memory) {
    string memory offererName = "offerer";
    address offerer = makeAddr(offererName);
    string memory fulfillerName = "fulfiller";
    address fulfiller = makeAddr(fulfillerName);

    // allocate tokens and approvals
    test721_1.mint(fulfiller, 1);
    token1.mint(offerer, 10000);
    vm.prank(fulfiller);
    test721_1.setApprovalForAll(address(context.seaport), true);
    vm.prank(offerer);
    token1.approve(address(context.seaport), type(uint256).max);

    // configure orders
    addOfferItem(
      OfferItem({
        itemType: ItemType.ERC20,
        token: address(token1),
        identifierOrCriteria: 0,
        startAmount: 1000,
        endAmount: 1000
      })
    );
    // add another offer item, this time using test721_2
    addConsiderationItem(
      ConsiderationItem({
        itemType: ItemType.ERC721,
        token: address(test721_1),
        identifierOrCriteria: 1,
        startAmount: 1,
        endAmount: 1,
        recipient: payable(offerer)
      })
    );

    Order memory offererOrder = createSignedOrder(context.seaport, offererName);

    // offer 10k of token1

    addOfferItem(
      OfferItem({
        itemType: ItemType.ERC721,
        token: address(test721_1),
        identifierOrCriteria: 1,
        startAmount: 1,
        endAmount: 1
      })
    );

    addConsiderationItem(
      ConsiderationItem({
        itemType: ItemType.ERC20,
        token: address(token1),
        identifierOrCriteria: 0,
        startAmount: 800,
        endAmount: 800,
        recipient: payable(fulfiller)
      })
    );

    Order memory fulfillerOrder = createSignedOrder(
      context.seaport,
      fulfillerName
    );

    Fulfillment[] memory _fulfillments = createFulfillmentsFromMirrorOrders(
      offererOrder.parameters,
      fulfillerOrder.parameters
    );

    Order[] memory orders = new Order[](2);
    orders[0] = offererOrder;
    orders[1] = fulfillerOrder;
    return (orders, _fulfillments);
  }

  /**
   * @dev test that unmatched item amounts are swept to the fulfiller when calling matchOrders
   */
  function execSweepRemaining(Context memory context) external stateless {
    (
      Order[] memory orders,
      Fulfillment[] memory _fulfillments
    ) = setUpSweepRemaining(context);
    uint256 startingToken1Balance = token1.balanceOf(address(this));
    context.seaport.matchOrders(orders, _fulfillments);
    uint256 endingToken1Balance = token1.balanceOf(address(this));
    assertEq(endingToken1Balance, startingToken1Balance + 200);
  }

  // TODO: look into sporadic failures here
  function xtestSweepRemainingAdvanced() public {
    test(this.execSweepRemainingAdvanced, Context({seaport: consideration}));
    test(
      this.execSweepRemainingAdvanced,
      Context({seaport: referenceConsideration})
    );
  }

  /**
   * @dev test that unmatched item amounts are swept to the fulfiller when calling matchAdvancedOrders with a recipient of 0
   */
  function execSweepRemainingAdvanced(
    Context memory context
  ) external stateless {
    (
      Order[] memory orders,
      Fulfillment[] memory _fulfillments
    ) = setUpSweepRemaining(context);
    AdvancedOrder[] memory advancedOrders = new AdvancedOrder[](2);
    advancedOrders[0] = toAdvancedOrder(orders[0]);
    advancedOrders[1] = toAdvancedOrder(orders[1]);

    uint256 startingToken1Balance = token1.balanceOf(address(this));
    context.seaport.matchAdvancedOrders({
      orders: advancedOrders,
      criteriaResolvers: new CriteriaResolver[](0),
      fulfillments: _fulfillments,
      recipient: address(0)
    });
    uint256 endingToken1Balance = token1.balanceOf(address(this));
    assertEq(endingToken1Balance, startingToken1Balance + 200);
  }
}

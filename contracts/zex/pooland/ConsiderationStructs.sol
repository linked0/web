// SPDX-Lciense-Identifier: MIT
pragma solidity ^0.8.28;

import {BasicOrderType, ItemType, OrderType, Side} from "./ConsiderationEnums.sol";

/**
 * @dev For basic orders involving ETH / native / ERC20 <=> ERC721 / ERC1155
 *      matching, a group of six functions may be called that only require a
 *      subset of the usual order arguments. Note the use of a "basicOrderType"
 *      enum; this represents both the usal order type as well as the "route"
 *      of the basic order (a simple derivation function for the basic order
 *      type is `basicOrderType = orderType + (4 * basicOrderRoute)`).
 */
struct BasicOrderParameters {
  // calldata offset
  address considerationToken; // 0x24
  uint256 considerationIdentifier; // 0x44
  uint256 considerationAmount; // 0x64
  address payable offerer; // 0x84
  address zone; // 0xa4
  address offerToken; // 0xc4
  uint256 offerIdentifier; // 0xe4
  uint256 offerAmount; // 0x104
  BasicOrderType basicOrderType; // 0x124
  uint256 startTime; // 0x144
  uint256 endTime; // 0x164
  bytes32 zoneHash; // 0x184
  uint256 salt; // 0x1a4
  bytes32 offererConduitKey; // 0x1c4
  bytes32 fulfillerConduitKey; // 0x1e4
  uint256 totalOriginalAdditionalRecipients; // 0x204
  AdditionalRecipient[] additionalRecipients; // 0x224
  bytes signature; // 0x244
  // Total length, excluding dynamic array data: 0x264 (580)
}

/**
 * @dev Basic orders can supply any number of additional recipients, with the
 *      implied assumption that they are supplied from the offered ETH (or other
 *      native token) or ERC20 token for the order.
 */
struct AdditionalRecipient {
  uint256 amount;
  address payable recipient;
}

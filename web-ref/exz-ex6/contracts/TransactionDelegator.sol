// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IERC20Mintable.sol";

/// @title A contract that deletes the request of a user to mint a token to the
/// user. This contract stored the status of the request of the user to mint a
/// token. The user can get the status of the request by calling the `getStatus`.
contract TransactionDelegator {
  enum MintStatus {
    PENDING,
    SUCCESS
  }

  /// @notice save the information of minint request
  /// @param id The id of the request, which is incremented by 1 for each new
  /// @param userAddress The address of the user who made the request
  /// @param status The status of the request as described in the MintStatus enum
  /// @param isSet A boolean to check if the request is set
  struct MintRequest {
    uint id;
    address userAddress;
    MintStatus status;
    bool isSet;
  }

  // Mapping of user address to the request of the user
  // The `uint` is the id of the request
  mapping(address => mapping(uint => MintRequest)) public requests;

  // The token to mint
  IERC20Mintable public token;

  // @param _token The token to mint
  constructor(IERC20Mintable _token) {
    token = _token;
  }

  /// @notice Adds a request to the mapping and mints the token to the user
  /// @param _user The address of the user who made the request
  /// @param _id The id of the request which should be unique for the existing requests
  function mint(address _user, uint _id) public {
    require(_user != address(0), "TransactionDelegator: zero address");
    require(
      requests[_user][_id].isSet == false,
      "TransactionDelegator: request already exists"
    );
    // save the request to the mapping
    requests[_user][_id] = MintRequest({
      id: _id,
      userAddress: _user,
      status: MintStatus.PENDING,
      isSet: true
    });

    // mint the token to the user
    token.mint(_user);
    requests[_user][_id].status = MintStatus.SUCCESS;
  }

  // @notice Get the status of the request
  // @param _user The address of the user who made the request
  // @param _id The id of the request
  function getStatus(address _user, uint _id) public view returns (MintStatus) {
    return requests[_user][_id].status;
  }
}

// SPDX-Lincense-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MultiSigSafeSecured
 * @author Jay Lee
 */ contract MultiSigSafeSecured {
  address[] public signers;
  uint8 public requiredApprovals;

  // To -> Amount -> Approvals
  mapping(address => mapping(uint256 => uint256)) public withdrawRequests;

  constructor(address[] memory _signers, uint8 _requiredApprovals) {
    requiredApprovals = _requiredApprovals;
    for (uint i = 0; i < _signers.length; i++) {
      signers.push(_signers[i]);
    }
  }

  function withdrawETH(address _to, uint _amount) external {
    uint approvals = withdrawRequests[_to][_amount];
    require(approvals >= requiredApprovals, "Not enough approvals");

    withdrawRequests[_to][_amount] = 0;

    (bool success, ) = payable(_to).call{value: _amount}("");
    require(success, "donation failed, couldn't send ETH");
  }

  receive() external payable {}
}

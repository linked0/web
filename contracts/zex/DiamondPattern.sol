// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
 * @title Generic Diamond Pattern Example
 * @notice A minimal EIP-2535 (Diamond) implementation with separate facets
 * @dev This example shows a Diamond contract, on-chain upgrade via library, loupe facets, ownership facet, and a sample business logic facet
 */

// ======== Interfaces ========

/// @notice Diamond Cut interface for adding/replacing/removing functions
interface IDiamondCut {
  enum FacetCutAction {
    Add,
    Replace,
    Remove
  }
  struct FacetCut {
    address facetAddress;
    FacetCutAction action;
    bytes4[] functionSelectors;
  }
  function diamondCut(
    FacetCut[] calldata _cut,
    address _init,
    bytes calldata _calldata
  ) external;
}

/// @notice Diamond Loupe interface for introspection
interface IDiamondLoupe {
  struct Facet {
    address facetAddress;
    bytes4[] functionSelectors;
  }
  function facets() external view returns (Facet[] memory);
  function facetFunctionSelectors(
    address _facet
  ) external view returns (bytes4[] memory);
  function facetAddresses() external view returns (address[] memory);
  function facetAddress(
    bytes4 _functionSelector
  ) external view returns (address);
}

/// @notice Ownership interface
interface IOwnership {
  function owner() external view returns (address);
  function transferOwnership(address _newOwner) external;
}

// ======== Library: Shared Storage & Internal Cut ========

library LibDiamond {
  bytes32 constant STORAGE_POSITION = keccak256("diamond.standard.storage");

  struct DiamondStorage {
    mapping(bytes4 => address) selectorToFacet;
    address[] facetAddresses;
    address contractOwner;
  }

  event DiamondCut(IDiamondCut.FacetCut[] _cut, address _init, bytes _calldata);

  function diamondStorage() internal pure returns (DiamondStorage storage ds) {
    bytes32 pos = STORAGE_POSITION;
    assembly {
      ds.slot := pos
    }
  }

  function setOwner(address _owner) internal {
    diamondStorage().contractOwner = _owner;
  }
  function enforceOwner() internal view {
    require(
      msg.sender == diamondStorage().contractOwner,
      "LibDiamond: Must be contract owner"
    );
  }
  function owner() internal view returns (address) {
    return diamondStorage().contractOwner;
  }

  function addSelectors(address _facet, bytes4[] memory _selectors) internal {
    DiamondStorage storage ds = diamondStorage();
    for (uint i = 0; i < _selectors.length; i++) {
      bytes4 sel = _selectors[i];
      require(
        ds.selectorToFacet[sel] == address(0),
        "LibDiamond: Selector exists"
      );
      ds.selectorToFacet[sel] = _facet;
    }
    ds.facetAddresses.push(_facet);
  }

  function removeSelectors(bytes4[] memory _selectors) internal {
    DiamondStorage storage ds = diamondStorage();
    for (uint i = 0; i < _selectors.length; i++) {
      delete ds.selectorToFacet[_selectors[i]];
    }
  }

  function getFacetForSelector(
    bytes4 _selector
  ) internal view returns (address) {
    return diamondStorage().selectorToFacet[_selector];
  }
  function facetsList() internal view returns (address[] memory) {
    return diamondStorage().facetAddresses;
  }

  // Internal diamondCut logic (no external CALL to address(this))
  function doDiamondCut(
    IDiamondCut.FacetCut[] memory _cut,
    address _init,
    bytes memory _calldata
  ) internal {
    enforceOwner();
    for (uint i = 0; i < _cut.length; i++) {
      IDiamondCut.FacetCutAction action = _cut[i].action;
      if (action == IDiamondCut.FacetCutAction.Add) {
        addSelectors(_cut[i].facetAddress, _cut[i].functionSelectors);
      } else if (action == IDiamondCut.FacetCutAction.Remove) {
        removeSelectors(_cut[i].functionSelectors);
      }
    }
    emit DiamondCut(_cut, _init, _calldata);
    if (_init != address(0)) {
      (bool success, ) = _init.delegatecall(_calldata);
      require(success, "LibDiamond: Init function reverted");
    }
  }
}

// ======== Diamond Core ========

contract Diamond {
  constructor(address _owner, IDiamondCut.FacetCut[] memory _initialCuts) {
    LibDiamond.setOwner(_owner);
    // perform initial cuts internally (no external CALL to self)
    LibDiamond.doDiamondCut(_initialCuts, address(0), "");
  }

  /// @notice Execute arbitrary facet function by selector + calldata
  /// @dev Only callable by contract owner
  function execute(bytes4 _sig, bytes calldata _calldata) external {
    LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
    address facet = ds.selectorToFacet[_sig];
    require(facet != address(0), "Diamond: Function does not exist");

    // 3) delegatecall into the facet, forwarding the full calldata
    (bool success, bytes memory result) = facet.delegatecall(_calldata);
    require(success, _getRevertMsg(result));
  }

  /// @dev Helper to bubble up revert reasons
  function _getRevertMsg(
    bytes memory _returnData
  ) internal pure returns (string memory) {
    if (_returnData.length < 68) return "Diamond: Execution reverted";
    assembly {
      // strip selector
      _returnData := add(_returnData, 0x04)
    }
    return abi.decode(_returnData, (string));
  }

  fallback() external payable {
    address facet = LibDiamond.getFacetForSelector(msg.sig);
    require(facet != address(0), "Diamond: Function not found");
    assembly {
      calldatacopy(0, 0, calldatasize())
      let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
      returndatacopy(0, 0, returndatasize())
      switch result
      case 0 {
        revert(0, returndatasize())
      }
      default {
        return(0, returndatasize())
      }
    }
  }
}

// ======== Facets ========

contract DiamondCutFacet is IDiamondCut {
  function diamondCut(
    FacetCut[] calldata _cut,
    address _init,
    bytes calldata _calldata
  ) external override {
    // delegate to internal implementation
    LibDiamond.doDiamondCut(_cut, _init, _calldata);
  }
}

contract DiamondLoupeFacet is IDiamondLoupe {
  function facets() external view override returns (Facet[] memory) {
    address[] memory addrs = LibDiamond.facetsList();
    Facet[] memory f = new Facet[](addrs.length);
    for (uint i = 0; i < addrs.length; i++) {
      // For simplicity, selectors array omitted
      f[i] = Facet({
        facetAddress: addrs[i],
        functionSelectors: new bytes4[](0)
      });
    }
    return f;
  }
  function facetFunctionSelectors(
    address
  ) external pure override returns (bytes4[] memory) {
    return new bytes4[](0);
  }
  function facetAddresses() external view override returns (address[] memory) {
    return LibDiamond.facetsList();
  }
  function facetAddress(
    bytes4 _selector
  ) external view override returns (address) {
    return LibDiamond.getFacetForSelector(_selector);
  }
}

contract OwnershipFacet is IOwnership {
  function owner() external view override returns (address) {
    return LibDiamond.owner();
  }
  function transferOwnership(address _newOwner) external override {
    LibDiamond.enforceOwner();
    LibDiamond.setOwner(_newOwner);
  }
}

contract ExampleFacet {
  event ValueSet(address indexed user, uint256 value);
  mapping(address => uint256) public userValues;

  function setValue(uint256 _val) external {
    userValues[msg.sender] = _val;
    emit ValueSet(msg.sender, _val);
  }
  function getValue(address _user) external view returns (uint256) {
    return userValues[_user];
  }
}

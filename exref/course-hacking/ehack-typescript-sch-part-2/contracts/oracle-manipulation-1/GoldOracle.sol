// SCH Course Copyright Policy (C): DO-NOT-SHARE-WITH-ANYONE
// https://smartcontractshacking.com/#copyright-policy
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

/**
 * @title GoldOracle
 * @author JohnnyTime (https://smartcontractshacking.com)
 */
contract GoldOracle {
    address[] sources;
    mapping(address => uint256) public getPriceBySource;

    modifier onlySource() {
        bool isSource = false;
        for (uint i = 0; i < sources.length; i++) {
            if (msg.sender == sources[i]) {
                isSource = true;
            }
        }
        require(isSource, "Not a source");
        _;
    }

    event PriceUpdated(
        address indexed source,
        uint256 oldPrice,
        uint256 newPrice
    );

    constructor(address[] memory _sources, uint[] memory _prices) {
        require(_sources.length > 0, "At least one source.");
        require(
            _sources.length == _prices.length,
            "source and prices array length should match"
        );

        for (uint256 i = 0; i < _sources.length; i++) {
            sources.push(_sources[i]);
            getPriceBySource[_sources[i]] = _prices[i];
        }
    }

    function postPrice(uint256 newPrice) external onlySource {
        _setPrice(msg.sender, newPrice);
    }

    function getPrice() external view returns (uint256) {
        return _computePrice();
    }

    function getAllSourcesPrices() public view returns (uint256[] memory) {
        uint256[] memory prices = new uint256[](sources.length);

        for (uint256 i = 0; i < sources.length; i++) {
            prices[i] = getPriceBySource[sources[i]];
        }

        return prices;
    }

    function getNumberOfSources() public view returns (uint256) {
        return sources.length;
    }

    function _setPrice(address source, uint256 newPrice) private {
        uint256 oldPrice = getPriceBySource[source];
        getPriceBySource[source] = newPrice;
        emit PriceUpdated(source, oldPrice, newPrice);
    }

    function _computePrice() private view returns (uint256) {
        uint256[] memory prices = _sort(getAllSourcesPrices());

        if (prices.length % 2 == 0) {
            uint256 leftPrice = prices[(prices.length / 2) - 1];
            uint256 rightPrice = prices[prices.length / 2];
            return (leftPrice + rightPrice) / 2;
        } else {
            return prices[prices.length / 2];
        }
    }

    function _sort(
        uint256[] memory arrayOfNumbers
    ) private pure returns (uint256[] memory) {
        for (uint256 i = 0; i < arrayOfNumbers.length; i++) {
            for (uint256 j = i + 1; j < arrayOfNumbers.length; j++) {
                if (arrayOfNumbers[i] > arrayOfNumbers[j]) {
                    uint256 tmp = arrayOfNumbers[i];
                    arrayOfNumbers[i] = arrayOfNumbers[j];
                    arrayOfNumbers[j] = tmp;
                }
            }
        }
        return arrayOfNumbers;
    }
}

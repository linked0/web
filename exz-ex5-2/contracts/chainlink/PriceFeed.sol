// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceFeed {
  AggregatorV3Interface internal dataFeed;

  constructor(address _dataFeed) {
    dataFeed = AggregatorV3Interface(_dataFeed);
  }

  /**
   * Returns the latest price
   */
  function getEthUsdPrice() public view returns (int) {
    // prettier-ignore
    (
        /* uint80 roundID */,
        int answer,
        /*uint startedAt*/,
        /*uint timeStamp*/,
        /*uint80 answeredInRound*/
    ) = dataFeed.latestRoundData();
    uint8 decimals = dataFeed.decimals();
    answer = answer / int(10 ** decimals);
    return answer;
  }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library JayTestLib {
  function isPrime(uint256 n) public returns (bool) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 == 0 || n % 3 == 0) return false;
    for (uint256 i = 5; i * i <= n; i += 6) {
      if (n % i == 0 || n % (i + 2) == 0) return false;
    }
    return true;
  }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./CarefulMath.sol";

/**
 * @title Exponential module for storing fixed-decision decimals
 * @author linked0
 * @notice Exp is a struct which stores decimals with a fixed precision of 18 decimal places.
 *         Thus, if we wanted to store the 5.1, mantissa would store 5.1e18. This is:
 *         `Exp({mantissa: 5100000000000000000})`
 */
contract Exponential is CarefulMath {
  uint constant expScale = 1e18;
  uint constant halfExpScale = expScale / 2;
  uint constant mantissaOne = expScale;

  struct Exp {
    uint mantissa;
  }

  /**
   * @dev Creates an exponential from numerator and denominator values.
   *      Note: Returns an error if (`num` * 10e18) > MAX_INT,
   *            of if `denom` is zero.
   */
  function getExp(
    uint num,
    uint denom
  ) public pure returns (MathError, Exp memory) {
    (MathError err0, uint scaledNumerator) = mulUInt(num, expScale);
    if (err0 != MathError.NO_ERROR) {
      return (err0, Exp({mantissa: 0}));
    }

    (MathError err1, uint rational) = divUInt(scaledNumerator, denom);
    if (err1 != MathError.NO_ERROR) {
      return (err1, Exp({mantissa: 0}));
    }

    return (MathError.NO_ERROR, Exp({mantissa: rational}));
  }
}

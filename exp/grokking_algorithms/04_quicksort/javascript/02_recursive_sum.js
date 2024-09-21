"use strict";

/**
 * Sums values in the array by recursive
 * @param {Array} array Array of numbers
 * @returns {number} Sum of the numbers
 */
function sumRecursive(arr) {
  if (arr.length == 0) return 0;
  return arr[0] + sumRecursive(arr.slice(1));
}

console.log(sumRecursive([1, 2, 3, 4])); // 10

function twoSum(nums, target) {
  // Create a hash map to store each number and its index
  const map = new Map();
  
  // Loop through the array
  for (let i = 0; i < nums.length; i++) {
    // Determine the number needed to reach the target
    const complement = target - nums[i];
    
    // If the complement exists in the map, return the indices
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    // Otherwise, store the current number and its index in the map
    map.set(nums[i], i);
  }
  
  // If no solution is found, which should not happen as the problem guarantees one solution
  return [];
}

// Example usage:
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target)); // Expected output: [0, 1]

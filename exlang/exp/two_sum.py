def two_sum(nums, target):
    # Dictionary to store number and its index
    num_to_index = {}
    
    # Iterate over the list with index and value
    for i, num in enumerate(nums):
        # Compute the complement needed to reach the target
        complement = target - num
        
        # If the complement is already in the dictionary, return the pair of indices
        if complement in num_to_index:
            return [num_to_index[complement], i]
        
        # Otherwise, store the current number with its index
        num_to_index[num] = i

    # If no solution is found (shouldn't happen as per problem constraints)
    return []

# Example usage:
if __name__ == '__main__':
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print(result)  # Expected output: [0, 1]

class BinarySearch():

  def search_iterative(self, list, item):
    # low and high keep track of which part of the list you'll search in.
    low = 0
    high = len(list) - 1

    # While you haven't narrowed it down to one element ...
    while low <= high:
      # ... check the middle element
      mid = (low + high) // 2
      guess = list[mid]
      # Found the item.
      if guess == item:
        return mid
      # The guess was too high.
      if guess > item:
        high = mid - 1
      # The guess was too low.
      else:
        low = mid + 1

    # Item doesn't exist
    return None

  def search_recursive(self, list, low, high, item):
    # Check base case 
    if high >= low: 
  
        mid = (high + low) // 2
        guess = list[mid]
  
        # If element is present at the middle itself 
        if guess == item:
            return mid 
  
        # If element is smaller than mid, then it can only 
        # be present in left subarray 
        elif guess > item: 
            return self.search_recursive(list, low, mid - 1, item) 
  
        # Else the element can only be present in right subarray 
        else: 
            return self.search_recursive(list, mid + 1, high, item) 
  
    else: 
        # Element is not present in the array 
        return None

if __name__ == "__main__":
  # We must initialize the class to use the methods of this class
  bs = BinarySearch()
  # my_list = [1, 3, 5, 7, 9]
  # my_list = [3, 9, 10, 11, 12, 13, 14, 17, 18, 19]
  my_list = [146, 161, 193, 217, 266, 276, 460, 487, 585, 756, 842, 889, 954, 985, 1061, 1114, 1169, 1256, 1509, 1533, 1680, 1829, 1917, 1995, 2013, 2085, 2134, 2182, 2249, 2261, 2306, 2499, 2543, 2723, 2731, 3196, 3253, 3271, 3351, 3514, 3557, 3629, 3755, 3884, 3935, 4163, 4236, 4296, 4298, 4420, 4661, 4764, 4901, 4912, 4943, 5043, 5224, 5247, 5444, 5485, 5569, 5742, 5778, 5862, 6064, 6096, 6122, 6425, 6455, 6472, 6493, 6656, 6764, 6778, 6946, 7126, 7165, 7208, 7211, 7283, 7407, 7584, 7675, 7827, 7992, 8155, 8309, 8439, 8482, 9180, 9198, 9292, 9335, 9383, 9509, 9537, 9631, 9727, 9780, 9795]
  
  print(bs.search_iterative(my_list, 3)) # => 1 for first list
  print(bs.search_iterative(my_list, 7584))

  # 'None' means nil in Python. We use to indicate that the item wasn't found.
  print(bs.search_iterative(my_list, -1)) # => None
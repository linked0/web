def solution(numbers, target):
    answer = 0
    
    def dfs(numbers, target):
      nonlocal answer
      if not numbers and target == 0:
        answer += 1
      elif numbers:
        dfs(numbers[1:], target - numbers[0])
        dfs(numbers[1:], target + numbers[0])

    dfs(numbers, target)
    return answer

if __name__ == '__main__':
    answer = solution([1, 1, 1, 1, 1], 3)
    print('{} == 5'.format(answer))
    answer = solution([4, 1, 2, 1], 4)
    print('{} == 2'.format(answer))
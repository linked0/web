def solution(nums):
    return int(min(len(set(nums)), len(nums)/2))

if __name__ == "__main__":
    answer = solution([3,1,2,3])
    print("answer is {} and should be 2".format(answer));
    answer = solution([3,3,3,2,2,4])
    print("answer is {} and should be 3".format(answer));
    answer = solution([3,3,3,2,2,2])
    print("answer is {} and should be 2".format(answer));

def solution(clothes):
    answer = 1
    hash_map = {}
    for cloth, type in clothes:
        hash_map[type] = hash_map.get(type, 0) + 1
    
    for type in hash_map:
        answer *= (hash_map[type] + 1)

    return answer - 1

if __name__ == "__main__":
    answer = solution([["yellow_hat", "headgear"], ["blue_sunglasses", "eyewear"], ["green_turban", "headgear"]])
    print("answer is {} and should be 5".format(answer));
    answer = solution([["crow_mask", "face"], ["blue_sunglasses", "face"], ["smoky_makeup", "face"]])
    print("answer is {} and should be 3".format(answer));
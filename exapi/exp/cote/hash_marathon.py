def solution(participant, completion):
    answer = ''
    hash_dict = {}
    sumHash = 0
    for i in participant:
        hash_dict[hash(i)] = i
        sumHash += hash(i)
    
    for j in completion:
        sumHash -= hash(j)

    answer = hash_dict[sumHash]
    return answer

if __name__ == "__main__":
    answer = solution(["leo", "kiki", "eden"], ["eden", "kiki"])
    print("answer is `{}` and should be `leo`".format(answer));
    answer = solution(["marina", "josipa", "nikola", "vinko", "filipa"], ["josipa", "filipa", "marina", "nikola"])
    print("answer is `{}` and should be `vinko`".format(answer));
    answer = solution(["mislav", "stanko", "mislav", "ana"], ["stanko", "ana", "mislav"]	)
    print("answer is `{}` and should be `mislav`".format(answer));
# 재귀적으로 조합 구현

def combination(arr, r):
    # 조합을 저장할 배열
    result = []
    
    # 실제 조합을 구하는 함수
    def combinate(c, index):
        if len(c) == r:
            result.append(c)
            return 
        
        for idx, data in enumerate(arr):
            # 중복되는 조합이 생성되지 않게 마지막으로 들어온 원소의 인덱스보다
            # 새로 추가하는 원소의 인덱스가 큰 경우만 조합을 생성한다.
            if idx > index:
                combinate(c + [data], idx)
    
    combinate([], -1)
    
    return result


    
# --- Result ---
'''
['A', 'B']
['A', 'C']
['A', 'D']
['B', 'C']
['B', 'D']
['C', 'D']
'''

if __name__ == '__main__':
  all_comb = combination(['A', 'B', 'C', 'D'], 3)
  print(all_comb)
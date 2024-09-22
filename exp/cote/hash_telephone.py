def solution(phone_book):
    answer = True
    phone_book = sorted(phone_book)
    for p1, p2 in zip(phone_book, phone_book[1:]):
        if p2.startswith(p1):
            answer = False
            break
    return answer

if __name__ == '__main__':
    answer = solution(["119", "97674223", "1195524421"])
    print('`{}` must be `False`'.format(answer))
    answer = solution(["123", "456", "789"])
    print('`{}` must be `True`'.format(answer))
    answer = solution(["12", "123", "1235", "567", "88"])
    print('`{}` must be `False`'.format(answer))
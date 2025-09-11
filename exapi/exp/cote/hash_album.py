from collections import defaultdict

def solution(genres, plays):
    answer = []
    genres_play_dict = {}
    play_dict = defaultdict(list)
    for i in range(len(plays)):
        play_dict[genres[i]].append((i, plays[i]))
        genres_play_dict[genres[i]] = genres_play_dict.get(genres[i], 0) + plays[i]
    genres_play_dict = sorted(genres_play_dict.items(), key=lambda x: x[1], reverse=True)
    for key, value in play_dict.items():
        play_dict[key] = sorted(value, key=lambda x: x[1], reverse=True)

    add_dict = defaultdict(list) 
    for genre, _ in genres_play_dict:
        for value in play_dict[genre]:
            if len(add_dict[genre]) < 2:
                add_dict[genre].append(value[0])
    
    for key, value in add_dict.items():
        for x in value:
            answer.append(x)
    return answer

if __name__ == '__main__':
    answer = solution(["classic", "pop", "classic", "classic", "pop"], [500, 600, 150, 800, 2500])
    print('`{}` must be `[4, 1, 3, 0]`'.format(answer))
    answer = solution(["classic", "pop", "pop", "classic", "classic", "pop"], [500, 600, 600, 150, 800, 2500])
    print('`{}` must be `[5, 1, 4, 0]`'.format(answer))
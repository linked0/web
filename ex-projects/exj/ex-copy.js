function solution(coin, cards) {
    var round = 0;
    var matchNum = cards.length + 1;
    console.log('matchNum', matchNum);
    const getWanted = ((curCards) => {
        wanted = []
        for (var i = 0; i < curCards.length; i++) {
            for (var j = 0; j < curCards.length; j++) {
                if (i == j) continue;
                if (curCards[i] + curCards[j] == matchNum) {
                    return [curCards[i], curCards[j]];
                }
            }
        }
        return wanted;
    });

    var myCards = cards.splice(0, cards.length / 3);
    var canContinue = true;
    var wanted = [];
    for (; canContinue && myCards.length > 0 && coin > 0; round++) {
        console.log('== myCards', myCards, 'cards', cards);
        var tempCard = cards.splice(0, 2);

        wanted = getWanted(myCards);
        if (wanted.length == 0) {
            if (coin > 0) {
                let sum = tempCard.reduce((acc, cur) => acc + cur, 0);
                if (sum == matchNum) {
                    coin -= 2;
                    myCards.push(tempCard);
                }
                else {
                    for (card of tempCard) {
                        for (card2 of myCards) {
                            if (card + card2 == matchNum) {
                                coin -= 1;
                                myCards.push(card);
                            }
                        }
                    }
                }
            }
        }
        wantend = getWanted(myCards);
        console.log('myCards', myCards, 'wantend', wantend, 'coin', coin, 'round', round);

        if (wantend == 0) {
            canContinue = false
        }
        else {
            // remove wanted cards from myCards
            for (const wantedCard of wantend) {
                const index = myCards.indexOf(wantedCard);
                if (index > -1) {
                    myCards.splice(index, 1);
                }
            }
            canContinue = true;
        }
    }
    return round;
}

console.log("RESULT:", solution(4, [3, 6, 7, 2, 1, 10, 5, 9, 8, 12, 11, 4]),
    "EXPECTED:", 5);
// console.log("RESULT:", solution(3, [1, 2, 3, 4, 5, 8, 6, 7, 9, 10, 11, 12]),
//     "EXPECTED:", 2);
// console.log("RESULT:", solution(2, [5, 8, 1, 2, 9, 4, 12, 11, 3, 10, 6, 7]),
//     "EXPECTED:", 4);
// console.log("RESULT:", solution(10, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]), "EXPECTED:", 1);

const dice = Math.floor(Math.random() * 6) + 1;

function customDice(sides) {

    const dice = Math.floor(Math.random() * sides) + 1;
    const message = {
        "message" : `주사위를 던져 ${dice} 이 나왔습니다.`,
        "result" : dice
    }
    return message;
}

function rollDice2(ea = 6) {

    // 주사위를 입력한 갯수 만큼 리스트에 저장
    let total = [];

    for (let i = 0; i < ea; i++) {
        const dice = Math.floor(Math.random() * 6) + 1;
        total.push(dice);
    }

    console.log(`주사위를 던져 ${total} 이 나왔습니다.`);
    const message = {
        "message" : `주사위를 던져 ${dice} 이 나왔습니다.`,
        "result" : dice
    }
    return message;
}

const result = customDice(10); // 10면체 주사위
console.log(result);

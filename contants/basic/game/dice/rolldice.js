const dice = Math.floor(Math.random() * 6) + 1;

function rollDice() {
    const dice = Math.floor(Math.random() * 6) + 1;
    console.log(`주사위를 던져 ${dice} 이 나왔습니다.`);
    return dice;
}
function rollDice2(ea = 6) {

    // 주사위를 입력한 갯수 만큼 리스트에 저장
    let total = [];

    for (let i = 0; i < ea; i++) {
        const dice = Math.floor(Math.random() * 6) + 1;
        total.push(dice);
    }

    console.log(`주사위를 던져 ${total} 이 나왔습니다.`);
    return total;
}


const result = rollDice();
console.log(result);
const result2 = rollDice2();
console.log(result2);
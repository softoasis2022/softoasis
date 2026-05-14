// 수정사항
// 1. 플레이어이름으로 결과 노출
// 2. 1.번에서 필요한 플레이어이름은 이전에 등록된 플레이어의 이름으로 노출


const fs = require("fs");
const path = require("path");

/**
 * 📁 DB 경로
 */
const DB_PATH = path.join(__dirname, "database");

// 폴더 없으면 생성
if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(DB_PATH);
}

/**
 * 📦 게임 저장
 */
function saveGame(game) {
    const filePath = path.join(DB_PATH, `game${game.gameId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(game));
}

/**
 * 📦 게임 불러오기 (조회 전용)
 */
function loadGame(gameId) {
    const filePath = path.join(DB_PATH, `${gameId}.json`);
    if (!fs.existsSync(filePath)) return null;

    const game = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // 결과가 있을 때만 출력
    if (game.status === "end" && game.result) {
        console.log("게임 결과:", game.result);
    } else {
        console.log("아직 결과 없음");
    }

    return game;
}

/**
 * 🎮 게임 생성
 */
function gamecreate(player1, player2) {

    const gameId = Date.now().toString();

    const game = {
        gameId: gameId,
        players: [
            { id: player1, choice: null },
            { id: player2, choice: null }
        ],
        status: "waiting", // waiting | end
        result: null,
        createdAt: new Date()
    };

    saveGame(game);

    console.log("게임 생성:", gameId);

    return game;
}

/**
 * ✋ 선택 처리 (핵심 로직)
 */
function setChoice(gameId, playerId, choice) {

    const game = loadGame(gameId);
    if (!game) {
        console.log("게임 없음");
        return;
    }

    const player = game.players.find(p => p.id === playerId);
    if (!player) {
        console.log("플레이어 없음");
        return;
    }

    // 이미 선택했으면 무시
    if (player.choice !== null) return;

    // 선택 저장
    player.choice = choice;

    console.log(`${playerId} 선택: ${choice}`);

    // 🔥 둘 다 선택했는지 확인
    const allSelected = game.players.every(p => p.choice !== null);

    if (allSelected) {
        game.status = "end";
        game.result = judge(game);

        console.log("게임 종료!");
        console.log("결과 : ",`${game.result["winner"]}가 ${game.result["type"]}` );
    }

    // 항상 저장
    saveGame(game);
}

/**
 * 🧠 승패 판정
 */
function judge(game) {

    const [p1, p2] = game.players;

    const c1 = p1.choice;
    const c2 = p2.choice;

    if (c1 === c2) {
        return { type: "draw" };
    }

    if (
        (c1 === "가위" && c2 === "보") ||
        (c1 === "바위" && c2 === "가위") ||
        (c1 === "보" && c2 === "바위")
    ) {
        return { winner: p1.id, type: "win" };
    }

    return { winner: p2.id, type: "win" };
}

/**
 * 🧪 테스트 실행
 */
function test() {

    // 게임 생성
    const game = gamecreate("player1", "player2");

    // 결과 확인 (아직 없음)
    loadGame(game.gameId);

    // 선택 1
    setChoice(game.gameId, "player1", "가위");

    // 결과 확인 (아직 없음)
    loadGame(game.gameId);

    // 선택 2
    setChoice(game.gameId, "player2", "바위");

    // 결과 확인 (이제 나옴)
    loadGame(game.gameId);
}

test();
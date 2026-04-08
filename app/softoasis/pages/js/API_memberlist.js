//페이지가 로드되면 맴버리스트 가지고 오기
//맴버 리스트 가직 오기
//경로 /softoasis/team
//post
//응답 예시
// const memberdata = {
//   "teams": [
//     {
//       "teamKey": "dev",
//       "teamName": "개발팀",
//       "members": [
//         {
//           "id": "00001",
//           "name": "한민섭",
//           "nickname": "이루미",
//           "old": 29,
//           "profileimg": "",
//           "skill": [
//             {
//               "skillname": "자바스크립트",
//               "skilllogoimgurl": "/image/UI/javascript.svg"
//             }
//           ]
//         }
//       ]
//     },
//     {
//       "teamKey": "hr",
//       "teamName": "인사팀",
//       "members": []
//     },
//     ...
//   ]
// }
//응답 받으면 id가 member인 script테그에 넣어줌

document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchMemberData();
    layoutcomplate(data);
});
async function fetchMemberData() {
    try {
        const res = await fetch("/softoasis/team", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        return await res.json();

    } catch (err) {
        console.error("데이터 로딩 실패:", err);
        return null;
    }
}
function layoutcomplate(data) {
    const container = document.querySelector(".teamlist");

    if (!data || !data.teams) return;

    container.innerHTML = ""; // 초기화

    data.teams.forEach(team => {

        // 🔹 팀 박스 생성
        const teamDiv = document.createElement("div");
        teamDiv.className = "team";

        // 🔹 팀 이름
        teamDiv.innerHTML = `
            <div class="teamname">
                <p>${team.teamName}</p>
            </div>
        `;

        // 🔹 멤버 리스트 생성
        const ul = document.createElement("ul");
        ul.className = "teammemberlist";

        team.members.forEach(member => {
            const li = document.createElement("li");

            li.onclick = () => {
                location.href = `/softoasis/team/info?id=${member.id}`;
            };

            li.innerHTML = `
                <div>
                    <img class="profileimg" src="${member.profileimg || ''}">
                </div>

                <ul class="info">
                    <li class="wrap_info">
                        <p>이름</p>
                        <p>${member.name}</p>
                    </li>

                    <li class="wrap_info">
                        <p>닉네임</p>
                        <p>${member.nickname}</p>
                    </li>

                    <li class="wrap_info">
                        <p>경력</p>
                        <p>${member.old}년</p>
                    </li>

                    <li class="wrap_info">
                        <p>주요 스킬</p>
                        <ul class="skilllist">
                            ${member.skill?.map(skill => `
                                    <li>
                                        <a href="/softoasis/team/info?id=${member.id}">
                                            <img src="${skill.skilllogoimgurl}" 
                                                 onerror="this.style.display='none'">
                                            <p>${skill.skillname}</p>
                                        </a>
                                    </li>
                                `).join("") || ""
                }
                        </ul>
                    </li>
                </ul>
            `;

            ul.appendChild(li);
        });

        teamDiv.appendChild(ul);
        container.appendChild(teamDiv);
    });
}
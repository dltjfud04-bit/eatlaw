let lawData = [];

// CSV 불러오기
fetch("law_data.csv")
    .then(response => response.text())
    .then(text => {

        const rows = text.trim().split("\n");

        for (let i = 1; i < rows.length; i++) {

            // 큰따옴표 안의 쉼표도 처리
            const cols = rows[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);

            if (!cols || cols.length < 3) continue;

            lawData.push({
                question: cols[0].replace(/"/g, "").trim(),
                keywords: cols[1].replace(/"/g, "").trim(),
                answer: cols.slice(2).join(",").replace(/"/g, "").trim()
            });
        }

        console.log("CSV 로드 완료");
        console.log(lawData);
    })
    .catch(error => {
        console.error("CSV를 불러오지 못했습니다.", error);
    });

function sendMessage() {

    const input = document.getElementById("userInput");
    const question = input.value.trim();

    if (question === "") return;

    const chat = document.getElementById("chat");

    // 사용자 질문 출력
    chat.innerHTML += `<div class="user">${question}</div>`;

    let bestAnswer = "죄송합니다. 관련된 정보를 찾지 못했습니다.";

    // 키워드 검색
    for (const item of lawData) {

        const keywords = item.keywords.split(",");

        for (const keyword of keywords) {

            if (question.includes(keyword.trim())) {
                bestAnswer = item.answer;
                break;
            }
        }

        if (bestAnswer !== "죄송합니다. 관련된 정보를 찾지 못했습니다.") {
            break;
        }
    }

    // 챗봇 답변 출력
    chat.innerHTML += `<div class="bot">${bestAnswer}</div>`;

    chat.scrollTop = chat.scrollHeight;

    input.value = "";
}
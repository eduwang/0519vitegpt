const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// 🔰 초기 프롬프트
const systemPrompt = `
너는 학생들이 저녁 메뉴를 고민할 때 도움을 주는 챗봇이야.
대화는 따뜻하고 친절한 어조로 이어가고, 학생의 오늘 점심 메뉴를 먼저 물어본 다음
그에 어울리는 저녁 메뉴를 추천해줘.
대화 맥락을 반영해서 자연스럽게 이어가도록 해.
`;

// 🧠 대화 맥락 저장
const conversationHistory = [
  { role: "system", content: systemPrompt },
  { role: "assistant", content: "안녕! 오늘 점심은 뭐 먹었어? 🍱" }
];

// 👉 메시지 출력
function addMessage(content, sender = "bot") {
  const message = document.createElement("div");
  message.className = sender === "user" ? "message user" : "message bot";
  message.textContent = content;
  chatbox.appendChild(message);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// 🟢 첫 질문 출력
addMessage("안녕! 오늘 점심은 뭐 먹었어? 🍱", "bot");

// 🚀 GPT 응답 호출
async function fetchGPTResponse() {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: conversationHistory,
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;
  conversationHistory.push({ role: "assistant", content: reply });
  addMessage(reply, "bot");
}

// ✉️ 메시지 전송
async function handleSend() {
  const input = userInput.value.trim();
  if (!input) return;

  addMessage(input, "user");
  conversationHistory.push({ role: "user", content: input });
  userInput.value = "";
  await fetchGPTResponse();
}

// 버튼 클릭 또는 엔터 입력
sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSend();
});

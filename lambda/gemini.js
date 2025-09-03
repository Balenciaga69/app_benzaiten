const { GoogleGenAI } = require('@google/genai')

// Lambda 中使用環境變數
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// 初始化 Gemini 客戶端
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

async function processUserInput(whatISaid) {
  const maxRetries = 3
  let attempt = 0
  let lastError = null

  while (attempt < maxRetries) {
    try {
      let prompt = `
將以下句子轉換成以下格式物件並直接返回有效的 JSON 陣列。不要包含任何額外的文字、解釋或程式碼區塊標記（例如 \`\`\`json）。

### 範例格式
[
   {
      "date": "2025-XX-XX",
      "theme": "WORK",
      "action": "Developed",
      "subject": "MarketData and Position Controllers",
      "additionalInfo": "Created C# controllers for market data and positions."
   },
   {
      "date": "2025-XX-XX",
      "theme": "STUDY",
      "action": "Studied",
      "subject": "AWS Lambda CORS",
      "additionalInfo": "Struggled with AWS LAMBDA CORS Header configuration, not solved yet."
   },
   {
      "date": "2025-XX-XX",
      "theme": "LIFE",
      "action": "Played",
      "subject": "Backpack Battles",
      "additionalInfo": ""
   },
   {
      "date": "2025-XX-XX",
      "theme": "UDEMY",
      "action": null,
      "subject": "Javascript Advanced",
      "additionalInfo": "Completed lesson 5."
   }
]

### 規則
1.  返回格式：必須且只能返回一個有效的 JSON 陣列。
2.  date：固定為 YYYY-MM-DD 格式。
3.  theme：必須從下方的主題列表中選取。
4.  action：必須從下方的動作列表中選取，並符合主題的對應規則。如果沒有動作，請填寫 null。
5.  subject：只能使用英文，SideProject 主題有特定限制。
6.  additionalInfo：必須是關於細節的英文敘述，且不帶主詞，使用過去簡單式。如果沒有細節，請留空字串 ""。

### THEME 主題與其規則
-   STUDY (下班學習): 必須搭配一個 ACTION。
-   LIFE (下班生活): 可搭配或不搭配 ACTION。
-   WORK (上班/工作): 必須搭配一個 ACTION。
-   LEET (刷題): 動作固定為 Solved 或 Practiced。
-   UDEMY (線上課程): 動作必須是 null。
-   SideProject (下班的個人項目): Subject 限制為 "Project: GeminiNotion" 或 "Project: AI ChatRoom"。

---

### ACTION 動作列表
-   WORK & STUDY 專用: Studied, Planned, Practiced。
-   WORK 專用: Communicated (開會或與人討論), Modified (修改或重構既有代碼), Tested (寫單元測試／整合測試), Developed (開發全新內容), Fixed (修復), OfficeChores (行政雜務), Easygoing (很閒或請假)。
-   LEET 專用: Solved, Practiced。
-   LIFE 專用: Played (玩遊戲), Hosted (接待訪客)。

---

句子: ${whatISaid}

請直接返回 JSON 陣列，不要加入任何其他文字。
      `

      // 如果不是第一次嘗試，添加修正指示
      if (attempt > 0) {
        prompt += `\n\n注意：你上次輸出不符合預期格式，請更正並直接返回有效的 JSON 陣列。`
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-001',
        contents: prompt
      })

      // 假設回應是 JSON 字串,解析它
      let text = response.text.trim()
      // 移除可能的 Markdown 代碼塊標記
      if (text.startsWith('```json')) {
        text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      }
      const jsonResponse = JSON.parse(text)
      for (const entry of jsonResponse) {
        entry.date = new Date().toISOString().split('T')[0]
      }
      return jsonResponse
    } catch (error) {
      lastError = error
      attempt++
      console.error(`嘗試 ${attempt} 失敗:`, error)
      if (attempt >= maxRetries) {
        throw new Error(`Failed to parse Gemini response after ${maxRetries} attempts: ${lastError.message}`)
      }
    }
  }
}

module.exports = { processUserInput }

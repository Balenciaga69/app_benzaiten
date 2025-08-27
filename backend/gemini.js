const { GoogleGenAI } = require('@google/genai')

// const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'
const GEMINI_API_KEY = 'AIzaSyDiwNO6-zPvSuO8fLF1U1OXJSe1gOGCx7Y'

// 初始化 Gemini 客戶端
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

async function testGemini() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001', // 或 'gemini-1.5-flash'
    contents: '早上好,你今天感覺如何？'
  })
  console.log('Gemini Response:', response.text)
}

async function processUserInput(whatISaid) {
  const prompt = `
將以下句子轉換成以下格式物件並直接返回JSON物件
### 範例格式:
[
   {
      date: '2025-XX-XX', // 默認今天
      theme: 'LIFE', // 參考 THEME 列表
      action: null, // 參考 ACTION 列表
      subject: 'Marvel Avengers', // 只能使用英文標題
      additionalInfo: 'Watched a movie analysis on Avengers' // 細節(只能用無主詞,英文過去簡單式敘述)
   },
   {
    "date": "2025-08-27",
    "theme": "WORK",
    "action": "Communicated",
    "subject": "tsconfig",
    "additionalInfo": "Fixed the tsconfig issue that a new front-end colleague didn't know how to use."
  }
]
### THEME 主題
- STUDY (學習): 必搭 ACTION。
- LIFE (生活): 可選 ACTION。
- WORK (工作): 必搭 ACTION。
- LEET (刷題): 只搭 ACTION: Solved。
- UDEMY (線上課程): 不搭 ACTION。
- SideProject (個人項目): Subject 限制是 "Project: GeminiNotion" 或 "Project: AI ChatRoom"。

---

### ACTION 動作
- STUDY & WORK 專用: Studied,Planned,Practiced。
- WORK 專用: Communicated,Modified,Tested,Developed,Fixed,OfficeChores,Easygoing。
- LEET 專用: Solved。
- LIFE 專用: Played (subject 為遊戲名,additionalInfo is empty),Hosted (subject is empty,info 固定為 "Hosted visitors"),Exhausted (已經廢棄，極少用)。

句子: ${whatISaid}
請直接返回 JSON 陣列,不要其他文字。
  `

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001',
    contents: prompt
  })

  // 假設回應是 JSON 字串,解析它
  try {
    let text = response.text.trim()
    // 移除可能的 Markdown 代碼塊標記
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    }
    const jsonResponse = JSON.parse(text)
    console.info('xZx JSON RESPONSE TO STRING', JSON.stringify(jsonResponse))
    return jsonResponse
  } catch (error) {
    console.error('解析 JSON 失敗:', error)
    return null
  }
}

module.exports = { testGemini, processUserInput }

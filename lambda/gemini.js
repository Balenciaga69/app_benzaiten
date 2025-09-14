const { GoogleGenAI } = require('@google/genai')
const fs = require('fs')
const path = require('path')

// Lambda 中使用環境變數
const GEMINI_API_KEY = process.env.GEMINI_API_KEY

// 初始化 Gemini 客戶端
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

const PROMPT_PATH_LOCAL = path.join(__dirname, 'gemini_prompt.txt')
const PROMPT_CACHE_TTL_MS = parseInt(process.env.PROMPT_CACHE_TTL_MS || '300000', 10) // 快取 TTL，預設 5 分鐘
let cachedPrompt = null
let cachedAt = 0

async function loadPromptTemplate() {
  const now = Date.now()
  if (cachedPrompt && now - cachedAt < PROMPT_CACHE_TTL_MS) {
    console.info('xZx loadPromptTemplate 觸發快取')
    return cachedPrompt
  }
  // 讀檔（若檔案不存在，會拋錯讓上層處理）
  const txt = await fs.promises.readFile(PROMPT_PATH_LOCAL, 'utf8')
  console.info('xZx loadPromptTemplate 重新讀檔')
  cachedPrompt = txt
  cachedAt = now
  return cachedPrompt
}

async function processUserInput(whatISaid) {
  const maxRetries = 3
  let attempt = 0
  let lastError = null

  while (attempt < maxRetries) {
    try {
      let template = await loadPromptTemplate()
      let prompt = `${template}\n\n句子: ${whatISaid}`

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

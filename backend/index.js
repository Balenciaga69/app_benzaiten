const { GoogleGenAI } = require('@google/genai')
const { Client } = require('@notionhq/client')

// 替換為你的 API 金鑰
// const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'
// const NOTION_TOKEN = 'YOUR_NOTION_TOKEN'
// const DATABASE_ID = 'YOUR_DATABASE_ID'
const GEMINI_API_KEY = 'AIzaSyDiwNO6-zPvSuO8fLF1U1OXJSe1gOGCx7Y'
const NOTION_TOKEN = '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'
const DATABASE_ID = '207a46fe9b4980829d03c9c502020e8a'

// 初始化客戶端
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })
const notion = new Client({ auth: NOTION_TOKEN })

// 測試 Gemini API（新版本）
async function testGemini() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-001', // 或 'gemini-1.5-flash'
    contents: '早上好，你今天感覺如何？'
  })
  console.log('Gemini Response:', response.text)
}

// 新增插入函式，接受資料物件
async function insertNotionPage(data) {
  const response = await notion.pages.create({
    parent: {
      database_id: DATABASE_ID
    },
    properties: {
      Date: {
        date: {
          start: data.date
        }
      },
      Theme: {
        select: {
          name: data.theme
        }
      },
      Action: {
        select: {
          name: data.action
        }
      },
      Subject: {
        title: [
          {
            text: {
              content: data.subject
            }
          }
        ]
      },
      AdditionalInfo: {
        rich_text: [
          {
            text: {
              content: data.additionalInfo
            }
          }
        ]
      }
    }
  })
  console.log('Inserted page ID:', response.id)
}

// 日誌資料（日期設為今天）
const logEntries = {
  date: '2025-08-27',
  theme: 'LIFE',
  action: 'Developed',
  subject: '測試主題',
  additionalInfo: '測試內容'
}

// 運行測試
async function runTests() {
  try {
    await insertNotionPage(logEntries)
    // await testGemini();
    console.log('All tests passed!')
  } catch (error) {
    console.error('Error:', error)
  }
}

runTests()

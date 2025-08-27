const { processUserInput } = require('./gemini')
const { insertNotionPage } = require('./notion')
const { handler } = require('./handler')
require('dotenv').config({ path: './.env' })

// 運行測試
async function runTestsLegacy() {
  try {
    const results = await processUserInput('在Coupang預定最新的Google Pixel手機')
    for (const entry of results) {
      await insertNotionPage(entry)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

async function runTests() {
  // 模擬 Lambda 事件
  const event = {
    userInput: '在Coupang預定最新的Google Pixel手機'
  }

  try {
    const result = await handler(event)
    console.log('Test result:', result)
  } catch (error) {
    console.error('Test error:', error)
  }
}

runTests()

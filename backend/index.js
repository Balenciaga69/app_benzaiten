const { processUserInput } = require('./gemini')
const { insertNotionPage } = require('./notion')

// 運行測試
async function runTests() {
  try {
    const results = await processUserInput('在Coupang預定最新的Google Pixel手機')
    for (const entry of results) {
      await insertNotionPage(entry)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

runTests()

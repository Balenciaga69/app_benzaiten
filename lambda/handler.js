const { processUserInput } = require('./gemini')
const { insertNotionPage } = require('./notion')

exports.handler = async (event) => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2))

    // 解析請求體
    let userInput
    if (event.body) {
      const body = JSON.parse(event.body)
      userInput = body.userInput
    } else {
      // 用於測試時直接傳入的情況
      userInput = event.userInput
    }

    if (!userInput) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'userInput is required' })
      }
    }

    console.log('Processing user input:', userInput)

    // 處理用戶輸入並寫入 Notion
    const results = await processUserInput(userInput)

    if (!results) {
      throw new Error('Failed to process user input')
    }

    for (const entry of results) {
      await insertNotionPage(entry)
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: `Successfully processed ${results.length} entries`,
        data: results
      })
    }
  } catch (error) {
    console.error('Lambda error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    }
  }
}

const { processUserInput } = require('./gemini')
const { insertNotionPage } = require('./notion')

exports.handler = async (event) => {
  // CORS 預檢請求處理
  if (event.requestContext?.http?.method === 'OPTIONS' || event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      body: ''
    }
  }

  try {
    console.log('Received event:', JSON.stringify(event, null, 2))

    // 驗證碼檢查
    const expectedAuthCode = process.env.AUTH_CODE
    const providedAuthCode = event.headers?.['x-auth-code'] || event.headers?.['X-Auth-Code']

    if (!expectedAuthCode || !providedAuthCode || expectedAuthCode !== providedAuthCode) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Unauthorized',
          message: 'Invalid or missing authentication code'
        })
      }
    }

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
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    }
  }
}

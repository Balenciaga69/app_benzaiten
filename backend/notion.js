const { Client } = require('@notionhq/client')

// 替換為你的 API 金鑰
// const NOTION_TOKEN = 'YOUR_NOTION_TOKEN'
// const DATABASE_ID = 'YOUR_DATABASE_ID'
const NOTION_TOKEN = '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'
const DATABASE_ID = '207a46fe9b4980829d03c9c502020e8a'

// 初始化 Notion 客戶端
const notion = new Client({ auth: NOTION_TOKEN })

// 新增插入函式，接受資料物件
async function insertNotionPage(data) {
  const properties = {
    Date: {
      date: {
        start: new Date().toISOString().split('T')[0] // 強制使用今天日期
      }
    }
  }

  // 只有當 theme 不為 null 或空時，才添加 Theme 屬性
  if (data.theme && data.theme.trim() !== '') {
    properties.Theme = {
      select: {
        name: data.theme
      }
    }
  }

  // 只有當 action 不為 null 時，才添加 Action 屬性
  if (data.action !== null) {
    properties.Action = {
      select: {
        name: data.action
      }
    }
  }

  // 只有當 subject 不為 null 或空時，才添加 Subject 屬性
  if (data.subject && data.subject.trim() !== '') {
    properties.Subject = {
      title: [
        {
          text: {
            content: data.subject
          }
        }
      ]
    }
  }

  // 只有當 additionalInfo 不為 null 或空時，才添加 AdditionalInfo 屬性
  if (data.additionalInfo && data.additionalInfo.trim() !== '') {
    properties.AdditionalInfo = {
      rich_text: [
        {
          text: {
            content: data.additionalInfo
          }
        }
      ]
    }
  }

  const response = await notion.pages.create({
    parent: {
      database_id: DATABASE_ID
    },
    properties: properties
  })
  console.log('Inserted page ID:', response.id)
}

module.exports = { insertNotionPage }

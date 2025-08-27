# AWS Lambda Deployment

這個資料夾包含準備部署到 AWS Lambda 的程式碼。

## 主要差異
- 移除了 `dotenv` 依賴
- 使用 Lambda 環境變數而非 `.env` 檔案
- 移除了本地測試程式碼

## 檔案說明
- `handler.js` - Lambda 主要進入點
- `gemini.js` - Google Gemini AI 處理邏輯
- `notion.js` - Notion API 操作
- `package.json` - 依賴管理（無 dotenv）

## 部署步驟
1. 安裝依賴：`npm install`
2. 打包：`npm run zip` 
3. 上傳到 AWS Lambda
4. 設定環境變數：
   - `GEMINI_API_KEY`
   - `NOTION_TOKEN` 
   - `DATABASE_ID`
5. 設定 Handler：`handler.handler`

## 環境變數
需要在 Lambda 控制台設定以下環境變數：
- `GEMINI_API_KEY=你的_Gemini_API_金鑰`
- `NOTION_TOKEN=你的_Notion_Token`
- `DATABASE_ID=你的_Database_ID`

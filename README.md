# Notion 日誌自動化助手

## 專案簡介
以最少維運成本，將「自然語句」一鍵轉為結構化日誌並寫入 Notion 資料庫。前端使用 React + Vite，後端為 AWS Lambda（Function URL）串接 Google Gemini 及 Notion API。

---

## 技術架構

### Frontend
- 框架: React 19 + TypeScript + Vite
- UI: Bootstrap 5
- 託管: GitHub Pages (以 gh-pages 套件 deploy 至 `dist`)

### Backend
- 執行: AWS Lambda (Node.js 20.x)
- 入口: Lambda Function URL (非 API Gateway)
- AI: Google Gemini (`@google/genai`)
- 資料庫: Notion Database (`@notionhq/client`)
- 機密: AWS 環境變數 /（可延伸）AWS Secrets Manager

### 主要流程
1. 使用者在前端輸入自然語句 + 授權碼
2. 前端送出 `POST` 至 Lambda Function URL，含表頭 `X-Auth-Code`
3. Lambda 驗證授權碼 → 呼叫 Gemini 進行語意轉換，輸出符合規則的 JSON 陣列
4. 逐筆寫入 Notion Database (日期統一使用執行當天)
5. 回傳處理成功筆數

---

## 轉換規則摘要（Gemini Prompt）
- 產出 JSON 陣列，每筆欄位: `date`, `theme`, `action`, `subject`, `additionalInfo`
- THEME: STUDY / LIFE / WORK / LEET / UDEMY / SideProject
- ACTION 規則（節錄）:
  - STUDY / WORK: Studied, Planned, Practiced
  - WORK 專屬: Communicated, Modified, Tested, Developed, Fixed, OfficeChores, Easygoing
  - LEET: Solved
  - LIFE: Played, Hosted (特別規則)
- SideProject 的 Subject 限制: `Project: GeminiNotion` 或 `Project: AI ChatRoom`

---

## 專案結構（節錄）
```
frontend/        # React + Vite 前端
  src/components/BenzaitenForm.tsx
lambda/          # Lambda 原始碼 (Gemini + Notion)
  handler.js
  gemini.js
  notion.js
scripts/         # 其他腳本(預留)
```

---

## 安裝與本地開發

### 1. 取得原始碼
```
 git clone <repo-url>
 cd app_benzaiten
```

### 2. 前端
```
 cd frontend
 pnpm install
 pnpm start      # 開發模式 (http://localhost:5173)
 pnpm build      # 產生 dist
 pnpm deploy     # 發佈到 GitHub Pages
```

### 3. Lambda
```
 cd lambda
 npm install
 npm run zip     # 產出 lambda-deployment.zip
```
上傳 zip 至 Lambda (Runtime: Node.js 20.x，Handler: handler.handler)。

---

## 環境變數 (Lambda)
| 名稱 | 說明 |
|------|------|
| GEMINI_API_KEY | Google Gemini API Key |
| AUTH_CODE | 前端呼叫時需附上的授權碼 (X-Auth-Code) |
| NOTION_TOKEN | Notion 整合金鑰 (Internal Integration Token) |
| DATABASE_ID | 目標 Notion Database ID |

> 建議改用 AWS Secrets Manager 或 Parameter Store 再於 Lambda 讀取。

---

## Frontend 呼叫範例
```
POST https://<lambda-function-id>.lambda-url.<region>.on.aws/
Headers: { "Content-Type": "application/json", "X-Auth-Code": <AUTH_CODE> }
Body: { "userInput": "今天下午修正 tsconfig 給新同事使用" }
```

回應（成功）
```
{
  "success": true,
  "message": "Successfully processed <n> entries",
  "data": [ ... ]
}
```

---

## 安全注意事項
- `AUTH_CODE` 僅簡單密碼驗證，請定期更換或升級為 JWT / Cognito 等機制。
- 前端不應硬編碼機密；本專案示範用途仍需再強化。
- 限制 Lambda CORS / 網域來源（目前程式碼中已註解，可按需開啟）。

---

## 後續可改進
- 以 Secrets Manager 自動載入機密
- 增加單元測試與整合測試
- 實作更嚴謹的 Schema 驗證 (e.g. Zod)
- 增加重送 / 失敗重試機制
- 前端顯示 AI 解析後的實際寫入細節

---

## 授權
尚未指定（預設保留所有權利）。

---

## 需求前置
- AWS 帳號
- Google Cloud (Gemini) API Key
- Notion 帳號 + Database + Integration
- Node.js 18+（本地開發） / Lambda Node.js 20.x

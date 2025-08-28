#

## 專案簡介

- 用於首次練習動手實作 AWS Lambda，同時試圖尋找能解決私人小需求的全免費方案。
  這個專案能夠將將我寫的人類話語，透過 Gemini API 轉換成符合 Notion Database 規則的 JSON 陣列，並自動寫入 Notion。

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
3. Lambda 驗證授權碼 → 呼叫 Gemini 進行語意轉換（若失敗最多重試三次並附加修正提示），輸出符合規則的 JSON 陣列
4. 逐筆寫入 Notion Database (日期統一使用執行當天)
5. 回傳生成內容

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

| 名稱           | 說明                                         |
| -------------- | -------------------------------------------- |
| GEMINI_API_KEY | Google Gemini API Key                        |
| AUTH_CODE      | 前端呼叫時需附上的授權碼 (X-Auth-Code)       |
| NOTION_TOKEN   | Notion 整合金鑰 (Internal Integration Token) |
| DATABASE_ID    | 目標 Notion Database ID                      |

## 安全注意事項

- `AUTH_CODE` 僅簡單密碼驗證，請定期更換或升級為 JWT / Cognito 等機制。
- 前端不應硬編碼機密；本專案示範用途仍需再強化。
- 限制 Lambda CORS / 網域來源（目前程式碼中已註解，可按需開啟）。

---

## 後續可改進

- 以 Secrets Manager 自動載入機密
- 增加單元測試與整合測試
- 實作更嚴謹的 Schema 驗證 (e.g. Zod)
- 已實現重送 / 失敗重試機制（最多三次，附加修正提示）
- 已實現前端顯示 AI 解析後的實際寫入細節（以表格形式呈現）

---

## 需求前置

- AWS 帳號
- Google Cloud (Gemini) API Key
- Notion 帳號 + Database + Integration
- Node.js 18+（本地開發） / Lambda Node.js 20.x

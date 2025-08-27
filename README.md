# Notion 日誌自動化助手

## 專案簡介
用於練習嘗試 AWS Serverless 架構，結合 Google Gemini API 與 Notion API

---

## 技術架構

本專案採用 **AWS Serverless 架構**，以最小化維護成本並實現高度自動化。

### 前端（Frontend）

- **託管平台**: **GitHub Pages**
- **技術**: HTML, CSS, JavaScript

### 後端（Backend）

- **API 層**: **AWS API Gateway**
- **運算層**: **AWS Lambda** (Node.js 20.x)
- **密鑰管理**: **AWS Secrets Manager**

### 核心服務

- **大型語言模型 (LLM)**: **Google Gemini API**
- **資料庫**: **Notion API**

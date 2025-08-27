目前:
- Notion API 與 Google Gemini API 皆已打通，確認 API 可以運行+
- 寫好Prompt，讓 Gemini 可以回傳符合 Notion API 格式的 JSON 物件
- 將機密資料移到安全處，不讓他跟著 Git Push (同時取得新的 API Key)
接下來要做:
- 我打算做 改造成 1 個 Lambda： parse+寫入 Notion（同步）
- AWS Secrets Manager (存放 API Key) - 確定免費才進行這一步。
- 測試這個lambda 可不可行 (用postman)

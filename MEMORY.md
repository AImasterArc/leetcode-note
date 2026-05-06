# 🧠 LeetCode Notes Project Memory

這份文件記錄了「日常紀錄 LeetCode 刷題筆記」專案的架構、功能與技術實作細節，方便未來維護與擴充。

## 🎯 專案目標
打造一個極具質感（Premium Dark Theme, Glassmorphism）、跨平台響應式（RWD）的 LeetCode 刷題紀錄與筆記閱讀網站。系統能自動掃描本地的程式碼與筆記檔案，並動態生成前端頁面。

---

## 🏗️ 系統架構與技術棧
- **後端 (Server)**: Node.js + Express.js (`server.js`)
  - 負責提供靜態檔案服務。
  - 動態掃描目錄結構，生成 JSON API 供前端使用。
  - 代理請求 LeetCode GraphQL API 以獲取題目描述，並具備本地快取機制。
- **前端 (Client)**: 原生 HTML / Vanilla CSS / Vanilla JavaScript
  - 不依賴大型框架（如 React/Vue），追求極致的載入速度與自訂性。
  - **Markdown 渲染**: `marked.js`
  - **程式碼高亮**: `prism.js`
- **資料儲存**:
  - 題解程式碼：`.py` 檔案存於 `/code/<分類>/` 目錄下。
  - 筆記文章：`.md` 檔案存於 `/note/<分類>/` 目錄下。
  - API 快取：`data/problems-cache.json`。

---

## ✨ 核心功能與實作方式

### 1. 📊 總覽儀表板 (Dashboard - `index.html`)
- **統計數據**:
  - 統計總題數以及 Easy / Medium / Hard 各難度的題數。
- **GitHub-style 熱力圖 (Heatmap)**:
  - **資料來源**: 後端讀取 `/code/` 目錄下所有 `.py` 檔案的 `birthtime`（檔案建立時間）來計算每日刷題數。
  - **渲染邏輯**: 前端 `main.js` 以 week-major（每週 7 天為一列）的方式動態生成 CSS Grid 格子，完美對齊左側的 Sun~Sat 標籤。
  - **自適應大小**: 根據容器寬度自動計算 `cellSize`，填滿畫面。
- **圖表分析**: 預留了難度分布與題型分布的區塊（可擴充 Chart.js）。
- **最新解題**: 顯示最近完成的題目列表。

### 2. 💻 題解頁面 (Solutions - `solutions.html`)
- **動態側邊欄 (Accordion)**:
  - 依據 `CATEGORY_META` 自動分類題目（如 Two Pointers, DP 等）。
  - 支援展開 / 收合動畫。
  - 支援即時搜尋功能，過濾題號、標題或難度。
- **題目描述 (LeetCode API Proxy)**:
  - 點擊題目時，前端呼叫 `/api/problem/:id`。
  - 後端會透過 `PROBLEM_TITLES` 對應的名稱轉換為 slug，打 LeetCode GraphQL API 抓取完整的 HTML 題目描述與標籤 (Tags)。
  - **快取機制**: 抓取成功後存入 `data/problems-cache.json`，下次請求瞬間回應。
  - **Fallback 機制**: 若 API 失敗或無對應 slug，會嘗試讀取該題 `.py` 檔案頂部的註解（`#` 開頭的內容）作為描述備案。
  - **安全渲染**: 前端利用 `DOMParser`（或建立虛擬 DOM）拔除 LeetCode 原始內容中的 `<script>` 與 `<style>` 防止 XSS 及跑版。
  - **UI 呈現**: 描述區塊放置於標題與程式碼之間，預設展開，支援點擊收起以節省空間。
- **多重解法切換 (Tabs)**:
  - 若一題有多個 `.py` 檔案（例如 `easy_70_1.py`, `easy_70_2.py`），會自動生成多個 Tab 供切換不同解法。
- **程式碼展示**:
  - 使用 Prism.js 高亮 Python 語法。
  - 支援一鍵複製程式碼功能。

### 3. 📝 筆記頁面 (Notes - `notes.html`)
- **多層級分類**:
  - 掃描 `/note/` 底下的子資料夾（如 `algorithms/`, `data-structures/` 等）自動建立分類。
- **高級搜尋 (Full-text Search)**:
  - 在前端記憶體中暫存已載入的內容（`contentCache`）。
  - 搜尋時同時比對：1. 標題 2. 後端傳來的預覽文字 (preview) 3. 已快取的完整 Markdown 內容。
  - 搜尋結果會在側邊欄即時呈現，並使用正規表達式高亮匹配的關鍵字。
- **Markdown 渲染與沉浸式閱讀**:
  - 使用 `marked.js` 解析 `.md`，並套用自訂的 Typography CSS（如引言區塊、表格、標題樣式）。
  - **動態目錄 (Sticky TOC & Scroll Spy)**: 自動掃描文章內的 `h2`, `h3` 標籤生成右側目錄。監聽滾動事件 (`scroll spy`) 即時高亮當前閱讀段落。
  - 帶有漸層光暈與 Meta 資訊的質感 Banner。

---

## 📂 目錄結構規範

```text
leetcode-note/
├── server.js              # Express 伺服器入口、API 邏輯
├── index.html             # 首頁 (Dashboard)
├── solutions.html         # 題解頁
├── notes.html             # 筆記頁
├── MEMORY.md              # 專案架構與記憶文件
├── data/
│   └── problems-cache.json # LeetCode 題目描述快取 (自動生成)
├── assets/
│   ├── css/
│   │   └── style.css      # 共用樣式與深色主題 CSS
│   └── js/
│       ├── main.js        # 首頁邏輯 (Heatmap, Stats)
│       ├── solutions.js   # 題解頁邏輯 (Tree view, LeetCode Desc, Tabs)
│       └── notes.js       # 筆記頁邏輯 (Markdown, TOC, Search)
├── code/                  # 程式碼根目錄
│   ├── linked-list/       # 分類資料夾
│   │   └── easy_21.py     # 命名規則: <難度>_<題號>[_<解法序號>].py
│   └── dynamic-programming/
└── note/                  # 筆記根目錄
    ├── algorithms/        # 分類資料夾
    │   └── greedy.md      # Markdown 筆記檔案
    └── data-structures/
```

---

## 🚀 部署與執行指南
- **開發/執行**: 在專案根目錄執行 `node server.js`
- **服務位置**: `http://localhost:3000`
- **注意事項**: 
  - 由於依賴 Node.js 的檔案系統 (`fs`) 進行動態掃描與 LeetCode API 代理，若未來要部署至完全靜態的環境（如 GitHub Pages），必須編寫一個 CI 預處理腳本，在部署前將 `/api/index` 與 `/api/problem/:id` 的輸出結果打包為靜態 JSON 檔案。

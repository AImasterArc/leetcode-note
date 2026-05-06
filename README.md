# ⚡ LeetCode 刷題筆記

> AImasterArc 的 LeetCode 刷題紀錄網站，部署於 GitHub Pages。

🔗 **[查看網站](https://AImasterArc.github.io/leetcode-note/)**

---

## 功能

- **主頁**: 解題統計、GitHub-style 熱力圖、題型分布圖
- **題解頁**: 按題型/難度快速導航，支援多解法切換，Python syntax highlight
- **筆記頁**: Markdown 渲染，解題技巧筆記
- **響應式設計**: 手機 + 電腦皆支援

## 目錄結構

```
leetcode-note/
├── index.html          # 主頁
├── solutions.html      # 題解頁
├── notes.html          # 筆記頁
├── assets/css/style.css
├── assets/js/
│   ├── main.js
│   ├── solutions.js
│   └── notes.js
├── code/               # 題解 .py 檔案
│   ├── linked-list/
│   ├── dynamic-programming/
│   ├── binary-search/
│   ├── tree/
│   ├── two-pointers/
│   └── math/
├── note/               # 筆記 .md 檔案
├── data/index.json     # 自動生成的索引
├── generate_index.py   # 索引生成腳本
└── scripts/auto_push.ps1
```

## 新增題目流程

1. 在對應的 `code/<題型>/` 目錄新增 `.py` 檔案
   - 命名格式: `easy_21.py` / `medium_322_1.py` (多解法加 `_1`, `_2`)
2. 執行索引生成腳本:
   ```bash
   python generate_index.py
   ```
3. Commit & push（或等自動排程在 22:00 / 00:00 執行）

## 新增筆記

在 `note/` 目錄新增 `.md` 檔案，網站會自動讀取並渲染。

## 自動推送設定 (Windows)

以管理員身份執行 PowerShell:

```powershell
$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NonInteractive -WindowStyle Hidden -File `"$PWD\scripts\auto_push.ps1`""

$t1 = New-ScheduledTaskTrigger -Daily -At "22:00"
$t2 = New-ScheduledTaskTrigger -Daily -At "00:00"

Register-ScheduledTask -TaskName "LeetCode-AutoPush-2200" -Action $action -Trigger $t1 -RunLevel Highest -Force
Register-ScheduledTask -TaskName "LeetCode-AutoPush-0000" -Action $action -Trigger $t2 -RunLevel Highest -Force
```

## GitHub Pages 設定

Repo Settings → Pages → Source: **Deploy from branch** → Branch: `main` → Folder: `/` (root)

## 本地預覽

```bash
python -m http.server 8080
# 開啟 http://localhost:8080
```

---

**Tech Stack**: HTML + Vanilla JS + CSS · Chart.js · Prism.js · marked.js
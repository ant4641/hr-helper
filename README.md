# HR Helper (React Vite Project)

這是一個基於 React 與 Vite 建立的專案，已經設定了 TailwindCSS 等常用套件。

## 系統需求

- [Node.js](https://nodejs.org/zh-tw/download/) (建議使用 v18 以上版本)

## 開發指南

### 1. 安裝套件
首先，請在專案根目錄下執行以下指令來安裝所需的套件：
```bash
npm install
```

### 2. 環境變數設定
將附帶的 `.env.example` 複製為本地環境變數檔案，並填入所需的 API 金鑰（例如 `GEMINI_API_KEY`）：
```bash
cp .env.example .env.local
```

### 3. 啟動開發伺服器
安裝完成後，執行以下指令啟動專案：
```bash
npm run dev
```
此指令會啟動開發伺服器（預設為 `http://localhost:3000`）。

## 部署上線 (GitHub Actions)

專案已內建 GitHub Actions 的設定檔 (`.github/workflows/deploy.yml`)，可用來自動化部署至 **GitHub Pages**。

1. 將程式碼推上 GitHub Repo 的 `main` 分支。
2. 進入該 Repo 的 **Settings** -> 左側選單 **Pages**。
3. 在 **Build and deployment** 區塊，將 **Source** 改為 **GitHub Actions**。
4. 之後每次推上 `main` 分支時，Action 就會自動 Build 並把打包好的 `dist/` 發布到 GitHub Pages。

> **注意**：如果你的 GitHub Pages 不是在根目錄（像是 `https://<username>.github.io/<repo-name>/`），請至 `package.json` 加入 `"homepage": "/<repo-name>/"`，以及 `vite.config.ts` 加入 `base: '/<repo-name>/'`。

## 版本控制設計
`.gitignore` 已經更新，排除了以下隱私/暫存檔：
- `node_modules/` 和 `dist/`：不必上傳的依賴與編譯後檔案。
- `.env.local` / `.env`：任何環境變數與金鑰。
- `.DS_Store` / IDE 暫存：常見系統與編輯器生成的無用垃圾。

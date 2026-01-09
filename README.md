<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HR Buddy - Smart Event Toolkit

這是一個專為人力資源管理設計的智慧工具箱，包含名單管理、獎品抽籤與自動分組功能。

## 🚀 快速開始 (Run Locally)

確保您已安裝 [Node.js](https://nodejs.org/) (建議 LTS 版本)。

1. **安裝依賴套件 (Install dependencies)**:
   ```bash
   npm install
   ```

2. **設定環境變數 (Environment Setup)**:
   
   **本機開發 (Local Development)**:
   在專案根目錄建立 `.env.local` 檔案 (此檔案不會被上傳到 GitHub)，並填入您的 API Key：
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

   **GitHub Actions (Production)**:
   若要讓自動部署的網站也能使用 API，請至 GitHub Repository Settings > Secrets > Actions 新增 Secret：
   - Name: `GEMINI_API_KEY`
   - Value: `your_api_key_here`

3. **啟動開發伺服器 (Start Dev Server)**:
   ```bash
   npm run dev
   ```
   伺服器將啟動於 `http://localhost:3000`。

## 📦 部署 (Deployment)

本專案已設定 GitHub Actions 自動部署至 **GitHub Pages**。

### 自動部署流程
1. 將程式碼 Push 到 `main` 或 `master` 分支。
2. GitHub Action 會自動觸發 `build-and-deploy` 任務。
3. 建置完成後，靜態檔案將被推送到 `gh-pages` 分支並發布。

### 手動建置
若需在本地產生部署檔案：
```bash
npm run build
# 檔案將生成於 dist/ 資料夾
```

## 🛠️ 專案結構
- **.github/workflows**: CI/CD 自動化設定
- **src/**: 原始程式碼
- **vite.config.ts**: Vite 建置設定


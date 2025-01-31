# Cookie Quick Copy

<p align="center">
  <img src="src/assets/icon/logo.svg" width="128" height="128" alt="logo">
</p>

<p align="center">
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-AGPL--3.0-blue.svg" alt="License">
  </a>
  <a href="https://v3.vuejs.org/">
    <img src="https://img.shields.io/badge/vue-3.0-brightgreen.svg" alt="Vue">
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/typescript-%5E4.0.0-blue.svg" alt="Typescript">
  </a>
</p>

简体中文 | [English](./README_EN.md)

## 📝 Introduction

A Chrome extension for quickly syncing website cookies to target sites, developed with Vue 3.0 + TypeScript + Ant Design Vue.

## ✨ Features

- ✅ Support full cookie synchronization to target websites
- ✅ Support automatic synchronization
- ✅ Bilingual support (Auto-detect browser language)
- ✅ Clean and intuitive interface

## 🚀 Installation

### Install from Chrome Web Store

1. Visit Chrome Web Store
2. Search for "Cookie Quick Copy"
3. Click "Add to Chrome"

### Manual Installation

1. Download the latest zip file
2. Extract the downloaded file
3. Open Chrome extensions page (chrome://extensions/)
4. Enable Developer Mode
5. Click "Load unpacked" and select the extracted folder

## 🔨 Development

### Project Structure

```
├── dist
│   ├── cookie-quick-copy        // Unpacked extension
│   ├── cookie-quick-copy.crx    // Packed crx file
│   ├── cookie-quick-copy.zip    // Packed zip file
├── src
│   ├── assets                   // Static assets
│   ├── extension                // Extension configs
│   ├── hooks                    // Common hooks
│   ├── locales                  // I18n files
│   ├── modules                  // Core modules
│   │   ├── popup                // Popup window
│   │   └── background           // Background scripts
│   ├── types                    // Type declarations
│   ├── utils                    // Utility functions
│   └── config.ts                // Configuration file
```

### Prerequisites

- Node.js >= 14
- Yarn >= 1.22

### Install Dependencies

```bash
yarn install
```

### Development

```bash
# Style debug mode
yarn serve

# Extension debug mode
yarn watch
```

### Build

```bash
# Build unpacked extension
yarn build

# Build zip file
yarn build:zip

# Build crx file
yarn build:crx

# Build all files
yarn build:all
```

## 📖 Documentation

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/reference/)

## 🤝 Contributing

Issues and suggestions are welcome!

## 📄 License

This project is open-sourced under the [AGPL-3.0](./LICENSE) license.

## 🙏 Acknowledgements

- Icon Design: [Crazy, XiaoYuan](https://www.iconfont.cn/user/detail?uid=56212) 

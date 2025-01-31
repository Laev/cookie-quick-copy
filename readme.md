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
## 📝 简介 | Introduction

一款快捷同步网站cookie至目标网站的谷歌插件，基于Vue 3.0 + TypeScript + Ant Design Vue开发。

A Chrome extension for quickly syncing website cookies to target sites, developed with Vue 3.0 + TypeScript + Ant Design Vue.

## ✨ 特性 | Features

- ✅ 支持cookie全量复制至目标网站 | Support full cookie synchronization to target websites
- ✅ 支持自动同步功能 | Support automatic synchronization
- ✅ 支持中英双语（自动跟随浏览器语言）| Bilingual support (Auto-detect browser language)
- ✅ 简洁直观的操作界面 | Clean and intuitive interface

## 🚀 安装 | Installation

### 从Chrome商店安装 | Install from Chrome Web Store

1. 访问Chrome网上应用店 | Visit Chrome Web Store
2. 搜索"Cookie Quick Copy" | Search for "Cookie Quick Copy"
3. 点击"添加至Chrome" | Click "Add to Chrome"

### 手动安装 | Manual Installation

1. 下载最新版本的zip文件 | Download the latest zip file
2. 解压下载的文件 | Extract the downloaded file
3. 打开Chrome扩展页面 (chrome://extensions/) | Open Chrome extensions page
4. 启用开发者模式 | Enable Developer Mode
5. 点击"加载已解压的扩展程序"并选择解压目录 | Click "Load unpacked" and select the extracted folder

## 🔨 开发 | Development

### 目录结构 | Project Structure

```
├── dist
│   ├── cookie-quick-copy        // 已解压的插件 | Unpacked extension
│   ├── cookie-quick-copy.crx    // 打包后的crx文件 | Packed crx file
│   ├── cookie-quick-copy.zip    // 打包后的zip文件 | Packed zip file
├── src
│   ├── assets                   // 静态资源 | Static assets
│   ├── extension                // 插件配置文件 | Extension configs
│   ├── hooks                    // 公共方法库 | Common hooks
│   ├── locales                  // 国际化文件 | I18n files
│   ├── modules                  // 核心模块 | Core modules
│   │   ├── popup                // 弹出窗口 | Popup window
│   │   └── background           // 后台脚本 | Background scripts
│   ├── types                    // 类型声明文件 | Type declarations
│   ├── utils                    // 工具函数 | Utility functions
│   └── config.ts                // 配置文件 | Configuration file
```

### 环境要求 | Prerequisites

- Node.js >= 14
- Yarn >= 1.22

### 安装依赖 | Install Dependencies

```bash
yarn install
```

### 开发调试 | Development

```bash
# 样式调试模式 | Style debug mode
yarn serve

# 插件调试模式 | Extension debug mode
yarn watch
```

### 构建 | Build

```bash
# 构建解压版本 | Build unpacked extension
yarn build

# 构建zip包 | Build zip file
yarn build:zip

# 构建crx文件 | Build crx file
yarn build:crx

# 构建所有文件 | Build all files
yarn build:all
```

## 📖 使用文档 | Documentation

- [Chrome扩展开发文档 | Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/reference/)

## 🤝 贡献 | Contributing

欢迎提交问题和改进建议！| Issues and suggestions are welcome!

## 📄 开源协议 | License

本项目基于 [AGPL-3.0](./LICENSE) 协议开源。

This project is open-sourced under the [AGPL-3.0](./LICENSE) license.

## 🙏 致谢 | Acknowledgements

- 图标设计: [Crazy、晓鸢](https://www.iconfont.cn/user/detail?uid=56212)
- Icon Design: [Crazy, XiaoYuan](https://www.iconfont.cn/user/detail?uid=56212)

<div align="center">

# 中国象棋 | Chinese Chess

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"/>
<img src="https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Android"/>

**A Cross-Platform Chinese Chess Game | 跨平台中国象棋游戏**

[English](#english) | [中文](#中文)

</div>

---

<a name="english"></a>
## 🎮 English

### Overview

A fully-featured Chinese Chess (Xiangqi) game built with pure HTML5, JavaScript, and CSS3. Features a traditional Chinese aesthetic with modern responsive design. Runs seamlessly in browsers and can be packaged as an Android APK using Cordova.

### ✨ Features

| Feature | Description |
|---------|-------------|
| 🏯 **Complete Rules** | Full implementation of official Chinese Chess rules including check, checkmate, and special moves |
| 🤖 **AI Opponent** | Alpha-Beta pruning algorithm with 3 difficulty levels |
| 👥 **Local Multiplayer** | Two-player mode on the same device |
| 📱 **Responsive Design** | Adaptive UI for all screen sizes - phones, tablets, and desktops |
| 💾 **Save/Load** | Preserve your game progress locally |
| ↩️ **Undo** | Take back your last 10 moves |
| 🎨 **Chinese Style** | Traditional wooden board texture with calligraphy-style pieces |

### 📸 Screenshots

<div align="center">
  <img src="docs/screenshots/gameplay.png" width="300" alt="Gameplay"/>
  <img src="docs/screenshots/menu.png" width="300" alt="Menu"/>
</div>

### 🚀 Quick Start

#### Web Browser
```bash
# Clone the repository
git clone https://github.com/yangfanconan/chinese-chess.git

# Open index.html in your browser
# Or use a local server:
npx http-server -p 8080
```

#### Android
Download the APK from [Releases](https://github.com/yangfanconan/chinese-chess/releases) and install on your Android device.

### 🛠️ Build from Source

```bash
# Install dependencies
npm install

# Build Android APK
npm run build:cordova
```

### 📋 Requirements

- **Web**: Modern browser (Chrome, Firefox, Safari, Edge)
- **Android**: Android 5.0+ (API 22+)

---

<a name="中文"></a>
## 🎮 中文

### 项目简介

一款基于 HTML5 + JavaScript + CSS3 开发的中国象棋游戏，采用传统中国风界面设计，支持现代响应式布局。既可直接在浏览器运行，也可通过 Cordova 打包为安卓 APK。

### ✨ 功能特性

| 功能 | 说明 |
|------|------|
| 🏯 **完整规则** | 严格遵循中国象棋国标规则，包括将军、将死、蹩马腿、塞象眼等 |
| 🤖 **人机对战** | 采用 Alpha-Beta 剪枝算法，支持简单/中等/困难三档难度 |
| 👥 **双人对战** | 本地同屏对战模式 |
| 📱 **响应式布局** | 自适应各种屏幕尺寸，完美适配手机、平板、桌面端 |
| 💾 **棋局保存** | 本地存储当前棋局，随时恢复对局 |
| ↩️ **悔棋功能** | 支持悔棋，最多回退10步 |
| 🎨 **中国风界面** | 仿木纹棋盘、书法字体棋子，传统与现代的完美融合 |

### 📸 游戏截图

<div align="center">
  <img src="docs/screenshots/gameplay.png" width="300" alt="游戏界面"/>
  <img src="docs/screenshots/menu.png" width="300" alt="菜单界面"/>
</div>

### 🚀 快速开始

#### 网页版
```bash
# 克隆仓库
git clone https://github.com/yangfanconan/chinese-chess.git

# 直接打开 index.html 或使用本地服务器
npx http-server -p 8080
```

#### 安卓版
从 [Releases](https://github.com/yangfanconan/chinese-chess/releases) 下载 APK 并安装。

### 🛠️ 编译打包

```bash
# 安装依赖
npm install

# 构建 Android APK
npm run build:cordova
```

### 📋 系统要求

- **网页版**：Chrome / Firefox / Safari / Edge 等现代浏览器
- **安卓版**：Android 5.0+ (API 22+)

---

## 📁 Project Structure | 项目结构

```
chinese-chess/
├── index.html              # Main page | 主页面
├── css/
│   └── style.css          # Styles | 样式文件
├── js/
│   ├── chessRules.js      # Game rules | 象棋规则核心
│   ├── chessUI.js         # UI rendering | 界面渲染
│   ├── chessAI.js         # AI engine | AI 引擎
│   ├── storage.js         # Data storage | 数据存储
│   └── main.js            # Main program | 主程序
├── www/                    # Cordova web assets | Cordova 资源
├── config.xml             # Cordova config | Cordova 配置
└── package.json           # npm config | npm 配置
```

## 🔧 Tech Stack | 技术栈

- **Frontend**: HTML5 Canvas, ES6+ JavaScript, CSS3
- **AI Algorithm**: Alpha-Beta Pruning with position evaluation
- **Cross-Platform**: Apache Cordova
- **Storage**: localStorage / Cordova Storage

## 🗺️ Roadmap | 后续规划

- [ ] Online multiplayer | 在线联机对战
- [ ] Puzzle mode | 残局挑战模式
- [ ] Game replay | 棋谱回放
- [ ] Tutorial mode | 新手教程
- [ ] Internationalization (i18n) | 多语言支持

## 📄 License | 许可证

[MIT License](LICENSE)

## 🤝 Contributing | 贡献

Contributions are welcome! Feel free to submit issues and pull requests.

欢迎提交 Issue 和 Pull Request！

---

<div align="center">

**Made with ❤️ by [Yang Fan](https://github.com/yangfanconan)**

</div>

# 中国象棋 - 跨平台游戏

一款基于 HTML5 + JavaScript + CSS 开发的跨平台中国象棋游戏，支持浏览器运行和安卓打包。

## 项目结构

```
chinese-chess/
├── index.html              # 主页面
├── css/
│   └── style.css          # 样式文件
├── js/
│   ├── chessRules.js      # 象棋规则核心
│   ├── chessUI.js         # 界面渲染
│   ├── storage.js         # 数据存储
│   └── main.js            # 主程序
├── res/
│   ├── audio/             # 音效资源（需自行添加）
│   └── images/            # 图片资源
├── package.json           # npm 配置
├── config.xml             # Cordova 配置
└── capacitor.config.json  # Capacitor 配置（备选）
```

## 网页端运行

### 方法一：直接打开
直接在浏览器中打开 `index.html` 文件即可运行。

### 方法二：使用本地服务器
```bash
# 安装依赖
npm install

# 启动本地服务器
npm run serve

# 访问 http://localhost:8080
```

## 安卓打包

### 使用 Cordova

1. 安装 Cordova CLI：
```bash
npm install -g cordova
```

2. 添加安卓平台：
```bash
cordova platform add android
```

3. 构建安卓应用：
```bash
# 调试版本
npm run build:cordova

# 发布版本
npm run build:cordova:release
```

4. 生成的 APK 位于：
```
platforms/android/app/build/outputs/apk/
```

### 使用 Capacitor（备选方案）

1. 安装 Capacitor：
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

2. 初始化 Capacitor：
```bash
npx cap init
```

3. 添加安卓平台：
```bash
npx cap add android
```

4. 同步并打开 Android Studio：
```bash
npx cap sync
npx cap open android
```

## 功能特性

### 基础功能
- 完整的中国象棋规则实现
- 双人本地对战
- 走子高亮提示
- 将军/将死判定
- 悔棋功能（最多10步）
- 棋局保存/加载

### 视觉效果
- 中国风界面设计
- 棋盘仿木纹效果
- 棋子书法字体
- 走子动画效果

### 音效系统
- 走子音效
- 吃子音效
- 将军音效
- 胜利音效
- 音效开关

## 音效资源说明

项目预留了音效接口，如需添加音效，请在 `res/audio/` 目录下放置以下文件：
- `move.mp3` - 走子音效
- `capture.mp3` - 吃子音效
- `check.mp3` - 将军音效
- `victory.mp3` - 胜利音效

推荐音效来源：
- [Freesound](https://freesound.org/) - 免费音效库
- [爱给网](https://www.aigei.com/) - 中文音效资源

## 扩展功能建议

### 1. 人机对战
实现思路：
- 使用 Alpha-Beta 剪枝算法
- 添加棋子价值评估函数
- 实现不同难度的 AI 等级

### 2. 在线联机
实现思路：
- 使用 WebSocket 实现实时通信
- 搭建房间匹配系统
- 添加排行榜功能

### 3. 棋谱回放
实现思路：
- 记录完整棋谱数据
- 实现前进/后退功能
- 支持棋谱导入/导出

### 4. 更多功能
- 残局挑战模式
- 学习模式（规则教学）
- 成就系统
- 多语言支持

## 技术说明

### 规则实现
- 严格遵循中国象棋国标规则
- 支持所有棋子的合法走法判断
- 实现蹩马腿、塞象眼等特殊规则
- 支持将帅照面（飞将）判定

### 性能优化
- 使用 Canvas 绘制，减少 DOM 操作
- 数据驱动的位置计算
- 事件委托处理用户交互

### 兼容性
- 支持主流浏览器（Chrome/Firefox/Safari）
- 支持触摸屏操作
- 自适应不同屏幕尺寸

## 许可证

MIT License

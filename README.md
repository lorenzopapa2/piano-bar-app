# PianoBar - 互动钢琴应用

一个基于React的互动钢琴应用，支持鼠标和键盘演奏，包含预设歌曲功能。

## 功能特点

- 🎹 可通过鼠标点击或键盘演奏的虚拟钢琴
- 🎵 内置3首经典歌曲（生日快乐、小星星、玛丽有只小羊羔）
- 🌍 多语言支持（自动检测浏览器语言）
- ✨ 演奏时的视觉反馈动画
- 🎮 键盘映射（A-L键对应白键，W-P键对应黑键）

## 本地运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 打开浏览器访问 http://localhost:5173

## 部署到网页

### 方法1：GitHub Pages

1. 修改 `vite.config.ts` 中的 `base` 配置为你的仓库名：
```typescript
base: '/your-repo-name/'
```

2. 运行部署命令：
```bash
npm run deploy
```

### 方法2：Vercel（推荐）

1. 安装Vercel CLI：
```bash
npm i -g vercel
```

2. 运行部署：
```bash
vercel
```

3. 按提示操作即可

### 方法3：Netlify

1. 构建项目：
```bash
npm run build
```

2. 将 `dist` 文件夹拖拽到 [Netlify Drop](https://app.netlify.com/drop)

### 方法4：静态服务器

构建后的文件在 `dist` 目录，可以部署到任何静态文件服务器。

## 使用说明

### 演奏歌曲

1. 在输入框中输入歌曲名称（支持：happy birthday、twinkle twinkle little star、mary had a little lamb）
2. 点击"Parse song"按钮
3. 应用会自动播放歌曲

### 键盘快捷键

- 白键：A S D F G H J K L ;
- 黑键：W E T Y U O P

## 技术栈

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Web Audio API
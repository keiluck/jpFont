# 日语跟读学习网站 (MVP版本)

一个基于React + TypeScript + Vite的日语跟读学习平台，支持音频播放、实时高亮同步等功能。

## 📋 项目功能

- ✅ 日语文章展示（分句显示）
- ✅ 音频播放/暂停控制
- ✅ 根据音频时间自动高亮当前句子
- ✅ 中文翻译显示
- ✅ 现代化UI设计
- 🔜 录音功能 (后续版本)
- 🔜 AWS集成 (后续版本)

## 🏗️ 项目结构

```
proFont/
├── public/                 # 静态资源
├── src/
│   ├── components/        # React 组件
│   │   ├── AudioPlayer/   # 音频播放器组件
│   │   ├── SentenceItem/  # 单句组件
│   │   └── SentenceList/  # 句子列表组件
│   ├── pages/            # 页面组件
│   │   └── ReaderPage/   # 跟读页面
│   ├── services/         # 服务层
│   │   ├── api.ts        # API请求
│   │   └── mockData.ts   # 模拟数据
│   ├── types/            # TypeScript类型定义
│   │   └── index.ts      # 通用类型
│   ├── App.tsx           # 主应用组件
│   ├── main.tsx          # 应用入口
│   └── index.css         # 全局样式
├── index.html            # HTML入口
├── vite.config.ts        # Vite配置
├── tsconfig.json         # TypeScript配置
├── package.json          # 项目依赖
└── README.md            # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖
```bash
cd proFont
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:5173

### 生产构建
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 📦 主要依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| react | ^18.2.0 | UI框架 |
| react-dom | ^18.2.0 | React DOM |
| typescript | ^5.2.2 | 类型检查 |
| vite | ^5.0.8 | 构建工具 |
| axios | ^1.4.0 | HTTP请求 |

## 🎯 核心组件说明

### ReaderPage (读者页面)
主页面组件，负责：
- 加载和管理文章数据
- 同步音频播放时间和句子高亮
- 协调各子组件的交互

```typescript
// 根据currentTime查找激活的句子
const findActiveSentence = (currentTime: number) => {
  return article.sentences.find(
    (sentence) =>
      currentTime >= sentence.startTime && currentTime < sentence.endTime
  )
}
```

### AudioPlayer (音频播放器)
提供音频播放功能：
- 播放/暂停控制
- 进度条拖拽
- 实时时间显示
- 时间更新回调

关键事件监听：
- `timeupdate` - 音频时间更新时触发
- `play` / `pause` - 播放状态变化
- `loadedmetadata` - 音频元数据加载完成

### SentenceList (句子列表)
句子列表容器组件，接收：
- `sentences` - 句子数据数组
- `activeSentenceId` - 当前激活句子的ID

### SentenceItem (句子项)
单个句子的展示组件，特点：
- 当前句子显示为蓝色背景
- 支持中文翻译显示
- 平滑过渡动画

## 🔌 API集成

### 接口定义
已在 `src/services/api.ts` 中定义，支持以下接口：

```typescript
// 获取文章列表
GET /api/articles

// 获取单个文章详情
GET /api/articles/{id}
```

### 响应格式
```typescript
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
```

### 当前开发方式
使用 `src/services/mockData.ts` 提供模拟数据，便于前端开发。

## 🎨 样式架构

- 使用 CSS Module 方式组织样式
- 每个组件自带独立的CSS文件
- 全局样式在 `index.css` 中定义
- 响应式设计支持移动端

## 📝 使用示例

### 集成API
替换 ReaderPage 中的模拟数据调用：

```typescript
// 从
const data = getMockArticle()

// 改为
const { data } = await getArticleById('1')
```

### 扩展句子高亮逻辑
在 `ReaderPage.tsx` 的 `findActiveSentence` 方法中修改。

## 🔄 数据流

```
AudioPlayer (获取currentTime)
    ↓
ReaderPage (处理timeUpdate事件)
    ↓
findActiveSentence (查找激活句子)
    ↓
setActiveSentenceId (更新状态)
    ↓
SentenceList (接收activeSentenceId)
    ↓
SentenceItem (根据isActive显示样式)
```

## 📱 响应式设计

- 桌面版 (>768px) - 全功能展示
- 平板版 (480-768px) - 优化布局
- 手机版 (<480px) - 紧凑显示

## 🛠️ 后续开发计划

### Phase 2
- [ ] 用户认证系统
- [ ] 用户学习进度保存
- [ ] 标签系统
- [ ] 搜索功能

### Phase 3
- [ ] 录音功能
- [ ] 发音评分 (AWS Polly / Google Speech)
- [ ] 生词本
- [ ] 学习统计

### Phase 4
- [ ] 社区功能
- [ ] 用户分享
- [ ] 排行榜

## 🐛 常见问题

### Q: 如何更换音频源？
A: 修改 `mockData.ts` 中的 `audioUrl` 字段，或者通过API返回的数据更新。

### Q: 如何调整句子时间区间？
A: 在 `mockData.ts` 中修改每个句子的 `startTime` 和 `endTime`。

### Q: 如何代理到后端API？
A: 已在 `vite.config.ts` 中配置，请求 `/api` 路径会自动转发到 `http://localhost:8080`

## 📄 License

MIT

## 👥 贡献指南

欢迎提交 Issue 和 Pull Request！

---

**更新时间**: 2024-01-19

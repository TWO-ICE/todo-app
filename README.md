# 📝 Todo App

一个功能完整、美观现代的 Todo 应用，使用 React 18 + Vite 5 + TypeScript 5 + Tailwind CSS 构建。

## ✨ 功能特性

### 核心功能
- ✅ **增删改查**：添加、编辑、删除、标记完成任务
- 🎯 **优先级管理**：支持 Low、Medium、High 三个优先级
- 🔍 **搜索过滤**：实时搜索和多重过滤
- 💾 **本地存储**：使用 localStorage 持久化数据
- 📊 **统计信息**：显示总数、已完成、进行中的任务数量

### 用户体验
- 🎨 **简洁美观**：现代 UI 设计，渐变背景
- 📱 **响应式设计**：适配各种屏幕尺寸
- ⚡ **流畅交互**：实时反馈和动画效果
- 🎭 **优先级标签**：不同颜色区分优先级
- ✏️ **双击编辑**：双击任务即可编辑

## 🚀 技术栈

- **框架**: React 19.2.4
- **构建工具**: Vite 8.0.0
- **语言**: TypeScript 5.9.3
- **样式**: Tailwind CSS 3.3.0
- **图标**: Lucide React
- **工具**: clsx

## 📦 安装与运行

### 安装依赖
```bash
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

### 预览构建
```bash
npm run preview
```

## 🎯 使用说明

### 添加任务
1. 在输入框中输入任务内容
2. 选择优先级（Low/Medium/High）
3. 点击 ➕ 按钮或按 Enter 键

### 管理任务
- **完成任务**：点击任务左侧的圆圈
- **编辑任务**：双击任务文本，修改后点击 Save 或按 Enter
- **删除任务**：点击任务右侧的 🗑️ 按钮

### 搜索与过滤
- **搜索**：在搜索框输入关键词，实时过滤
- **状态过滤**：All / Active / Completed
- **优先级过滤**：All / High / Medium / Low

## 📁 项目结构

```
src/
├── components/
│   └── ui/
│       ├── button.tsx      # 按钮组件
│       └── input.tsx       # 输入框组件
├── hooks/
│   └── useTodos.ts         # Todo 状态管理 Hook
├── types/
│   └── todo.ts             # TypeScript 类型定义
├── lib/
│   └── utils.ts            # 工具函数
├── App.tsx                 # 主应用组件
├── main.tsx                # 应用入口
└── index.css               # 全局样式
```

## 🎨 设计特点

- **渐变背景**：从蓝色到靛蓝的渐变
- **卡片设计**：白色圆角卡片，带阴影效果
- **优先级颜色**：
  - High：红色背景
  - Medium：黄色背景
  - Low：绿色背景
- **交互反馈**：hover 效果和过渡动画

## 💾 数据持久化

所有任务数据保存在浏览器的 localStorage 中，刷新页面不会丢失数据。

数据存储键：`todos`

## 📝 License

MIT

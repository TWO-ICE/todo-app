# 🚀 Todo App 部署规划书

**制定时间**：2026-03-15
**制定者**：中书省
**项目**：Todo App (React + Vite + TypeScript)

---

## 📋 项目概览

### 技术栈
- **框架**：React 19.2.4
- **构建工具**：Vite 8.0.0
- **语言**：TypeScript 5.9.3
- **样式**：Tailwind CSS 3.4.19
- **项目类型**：纯静态前端应用

### 项目特点
- ✅ 客户端渲染（CSR）
- ✅ 无需后端服务
- ✅ 数据存储在 localStorage
- ✅ 构建产物为静态文件（dist/ 目录）

---

## 🎯 部署目标

1. **GitHub 发布**：创建公开仓库，推送完整代码
2. **Vercel 部署**：自动部署，获得可访问的生产环境 URL
3. **持续集成**：实现 Git 推送自动触发部署

---

## 📦 第一阶段：GitHub 发布方案

### 步骤 1：本地 Git 初始化

**操作命令**：
```bash
cd /home/node/.openclaw/workspace/todo-app
git init
git add .
git commit -m "Initial commit: Todo App with React + Vite + TypeScript"
```

**注意事项**：
- ✅ .gitignore 已正确配置（排除 node_modules、dist 等）
- ✅ 首次提交应包含完整源代码
- ✅ 提交信息清晰描述项目内容

---

### 步骤 2：创建 GitHub 仓库

**方案 A：使用 GitHub CLI（推荐）**

```bash
# 安装 gh CLI（如未安装）
# 使用 GitHub token 认证
echo "YOUR_GITHUB_TOKEN" | gh auth login --with-token

# 创建公开仓库
gh repo create todo-app --public --source=. --remote=origin --push
```

**方案 B：手动创建 + 关联**

1. 访问 https://github.com/new
2. 仓库名：`todo-app`
3. 可见性：Public
4. **不要**初始化 README、.gitignore、license
5. 创建后执行：

```bash
git remote add origin https://YOUR_GITHUB_TOKEN@github.com/[YOUR_USERNAME]/todo-app.git
git branch -M main
git push -u origin main
```

---

### 步骤 3：验证 GitHub 发布

**检查项**：
- [ ] 仓库地址：https://github.com/[USERNAME]/todo-app
- [ ] 代码已推送成功
- [ ] README.md 正常显示
- [ ] 文件结构完整

---

## 🌐 第二阶段：Vercel 部署方案

### 方案选择

**方案 A：通过 Vercel CLI（推荐，适合自动化）**
- ✅ 命令行操作，可脚本化
- ✅ 适合 CI/CD 集成

**方案 B：通过 Vercel Dashboard（GUI 操作）**
- ✅ 可视化界面，简单直观
- ✅ 适合首次部署

**推荐**：使用方案 B（Dashboard）首次部署，后续可通过 Git 自动部署

---

### 步骤 1：准备 Vercel 配置文件

**创建 vercel.json**（在项目根目录）：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**说明**：
- `buildCommand`：构建命令
- `outputDirectory`：Vite 默认输出到 dist
- `rewrites`：确保 SPA 路由正常工作（所有路径指向 index.html）

---

### 步骤 2：通过 Vercel Dashboard 部署

#### 2.1 连接 GitHub

1. 访问 https://vercel.com/new
2. 选择 "Continue with GitHub"
3. 授权 Vercel 访问 GitHub 仓库

#### 2.2 导入项目

1. 选择仓库：`todo-app`
2. 配置项目：

**Project Name**：`todo-app`
**Framework Preset**：Vite（自动检测）
**Root Directory**：`./`
**Build Command**：`npm run build`
**Output Directory**：`dist`

#### 2.3 环境变量（此项目无需配置）

**此项目特点**：
- ✅ 纯前端应用
- ✅ 无 API 密钥
- ✅ 无需环境变量

#### 2.4 部署

1. 点击 "Deploy"
2. 等待构建（约 30-60 秒）
3. 获得部署 URL：`https://todo-app.vercel.app`

---

### 步骤 3：验证部署

**检查项**：
- [ ] 访问 Vercel 提供的 URL
- [ ] 页面正常加载
- [ ] Todo 功能正常（增删改查）
- [ ] 响应式设计正常（移动端测试）
- [ ] Console 无错误

---

## 🔄 第三阶段：持续集成方案

### 自动部署流程

**原理**：Vercel 自动监听 GitHub 分支变化

**流程**：
```
本地代码修改
  ↓
git add . && git commit -m "feat: xxx"
  ↓
git push origin main
  ↓
Vercel 自动检测到 push
  ↓
自动触发构建部署
  ↓
新版本生效
```

**无需任何配置**，Vercel 默认启用 Git 集成！

---

## 📝 完整部署流程总结

### 阶段一：本地准备
```bash
# 1. 进入项目目录
cd /home/node/.openclaw/workspace/todo-app

# 2. 创建 vercel.json 配置
cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF

# 3. 初始化 Git
git init
git add .
git commit -m "Initial commit: Todo App with React + Vite + TypeScript"
```

### 阶段二：推送到 GitHub
```bash
# 使用 GitHub CLI
echo "YOUR_GITHUB_TOKEN" | gh auth login --with-token
gh repo create todo-app --public --source=. --remote=origin --push
```

### 阶段三：Vercel 部署
1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库 `todo-app`
3. 确认配置（Vite 框架会自动检测）
4. 点击 Deploy
5. 获得生产 URL

---

## ⚠️ 注意事项

### GitHub Token 安全
- ⚠️ **已提供的 token 将用于认证**
- ✅ 建议部署后删除 token 或更新权限
- ✅ 后续操作使用个人访问令牌或 SSH 密钥

### 构建优化建议
- ✅ 当前配置已优化（.gitignore 正确）
- ✅ Vite 默认开启代码分割和 Tree Shaking
- ✅ Tailwind CSS 使用 PostCSS 自动清理未使用样式

### 域名绑定（可选）
如果需要自定义域名：
1. 在 Vercel Dashboard → Settings → Domains
2. 添加自定义域名
3. 配置 DNS 记录

---

## 🎉 预期结果

### 交付物

1. **GitHub 仓库**
   - URL：`https://github.com/[USERNAME]/todo-app`
   - 包含完整源代码和 README

2. **Vercel 生产环境**
   - URL：`https://todo-app.vercel.app`（或自定义域名）
   - 自动 HTTPS
   - 全球 CDN 加速

3. **自动化能力**
   - Git 推送自动触发部署
   - 零配置持续集成

---

## 📊 后续维护

### 日常开发流程
```bash
# 1. 修改代码
# 2. 测试
npm run dev

# 3. 提交并推送
git add .
git commit -m "feat: xxx"
git push origin main

# 4. Vercel 自动部署 🎉
```

### 监控
- Vercel Dashboard → Deployments：查看部署历史
- Vercel Analytics：查看访问统计（需启用）

---

## 📌 规划总结

✅ **GitHub 发布**：标准 Git 工作流
✅ **Vercel 部署**：零配置自动检测 Vite 项目
✅ **持续集成**：基于 Git 推送的自动化部署
✅ **预期时间**：15-20 分钟完成首次部署

---

**制定完成**，现交由门下省审核！

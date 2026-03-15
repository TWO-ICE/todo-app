# 🚀 Todo 应用部署规划

**制定机构**：中书省  
**制定日期**：2026-03-15  
**规划性质**：部署方案规划（不包含执行）

---

## 📊 项目现状分析

### ✅ 已完成配置
- [x] 本地 Git 仓库已初始化
- [x] GitHub 远程仓库已关联：`https://github.com/TWO-ICE/todo-app.git`
- [x] Vercel 配置文件已创建：`vercel.json`
- [x] 最新提交：`0d39b3d chore: add Vercel configuration`
- [x] 分支状态：main 分支，工作目录干净

### 📦 项目技术栈
- **框架**: React 19.2.4
- **构建工具**: Vite 8.0.0
- **语言**: TypeScript 5.9.3
- **样式**: Tailwind CSS 3.4.19
- **构建输出**: `dist/` 目录

---

## 🎯 部署目标

1. **GitHub 公开发布**：将代码推送到 GitHub 仓库，供公开访问
2. **Vercel 自动部署**：通过 Vercel 平台实现自动化部署
3. **生产环境验证**：确保应用在生产环境正常运行

---

## 📋 方案一：GitHub 发布方案

### 1.1 当前状态确认
```
✅ 本地仓库：已初始化
✅ 远程仓库：已关联到 TWO-ICE/todo-app
✅ 分支名称：main
❓ 推送状态：需确认 origin/main 是否为最新
```

### 1.2 GitHub 仓库优化建议

#### A. 仓库设置
- **可见性**: Public（公开）
- **描述**: A modern, full-featured Todo app built with React 19 + TypeScript + Vite + Tailwind CSS
- **主题标签**: `react`, `typescript`, `vite`, `tailwindcss`, `todo-app`, `productivity`

#### B. README.md 优化（建议添加）
- [ ] 添加演示截图
- [ ] 添加在线 Demo 链接（部署后添加）
- [ ] 添加 GitHub Actions 徽章（可选）
- [ ] 添加 License 文件

#### C. .gitignore 检查
确保以下内容已忽略：
```
node_modules/
dist/
.env
.env.local
.DS_Store
```

### 1.3 GitHub 推送执行步骤

**前置检查**：
```bash
# 1. 确认当前分支
git branch

# 2. 查看本地和远程差异
git log origin/main..main
# 如果有输出，说明本地有未推送的提交

# 3. 或者使用 status
git status
```

**推送命令**：
```bash
# 如果本地有未推送的提交
git push origin main

# 如果远程有更新需要先拉取
git pull origin main --rebase
git push origin main
```

**验证推送成功**：
```bash
# 检查远程分支最新提交
git log origin/main -1

# 访问 GitHub 仓库确认
# https://github.com/TWO-ICE/todo-app
```

---

## 📋 方案二：Vercel 部署方案

### 2.1 部署方式选择

**推荐方式：通过 GitHub 自动导入**

优势：
- ✅ 自动化部署：每次 push 到 main 分支自动触发部署
- ✅ 零配置：利用现有 `vercel.json`
- ✅ 预览部署：每个 PR 自动生成预览链接
- ✅ 回滚支持：一键回滚到历史版本
- ✅ 自定义域名：支持绑定自定义域名（可选）

### 2.2 Vercel 项目配置

#### A. 项目导入设置
```
Import Git Repository → GitHub → TWO-ICE/todo-app
```

#### B. 构建配置（使用 vercel.json）
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite"
}
```

#### C. 环境变量
- 本项目无需环境变量配置

#### D. 部署设置建议
- **生产环境分支**: `main`
- **Node.js 版本**: `18.x` 或 `20.x`（Vercel 默认）
- **构建超时**: 默认即可
- **自动部署**: ✅ 启用

### 2.3 Vercel 部署执行步骤

#### 步骤 1：登录 Vercel
```bash
# 方式 A：通过网页登录（推荐）
https://vercel.com/login

# 方式 B：通过 CLI
npm install -g vercel
vercel login
```

#### 步骤 2：导入项目
1. 访问：`https://vercel.com/new`
2. 选择 **Import Git Repository**
3. 选择 GitHub 账号
4. 找到并选择 `TWO-ICE/todo-app` 仓库
5. Vercel 会自动检测配置（读取 vercel.json）

#### 步骤 3：配置项目（手动确认）
```
Project Name: todo-app (或自定义)
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 步骤 4：部署
点击 **Deploy** 按钮，等待构建完成（通常 1-2 分钟）

#### 步骤 5：获取部署 URL
部署成功后，Vercel 会提供：
- **生产环境 URL**: `https://todo-app-xxx.vercel.app`
- **自动生成的域名**: 可在项目设置中查看

### 2.4 自定义域名配置（可选）

如果需要使用自定义域名：

1. 在 Vercel 项目设置中添加域名
2. 在域名提供商处添加 DNS 记录：
   ```
   类型: CNAME
   名称: @ (或 www)
   值: cname.vercel-dns.com
   ```
3. 等待 DNS 生效（通常 5-30 分钟）

---

## 📋 方案三：完整执行流程

### 阶段一：GitHub 发布（工部执行）

```bash
# 1. 进入项目目录
cd /home/node/.openclaw/workspace/todo-app

# 2. 确认分支状态
git status

# 3. 查看未推送的提交（如果有）
git log origin/main..main

# 4. 推送到 GitHub
git push origin main

# 5. 验证推送成功
git remote -v
git branch -a
```

**验证点**：
- [ ] GitHub 仓库显示最新提交
- [ ] README.md 显示正常
- [ ] 仓库文件完整

### 阶段二：Vercel 部署（工部执行）

#### 方式 A：通过 Vercel 网页（推荐）

1. **登录 Vercel**
   - 访问：`https://vercel.com/login`
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 **Add New** → **Project**
   - 选择 `TWO-ICE/todo-app` 仓库
   - 点击 **Import**

3. **配置确认**
   - Project Name: `todo-app`
   - Framework: `Vite`（自动检测）
   - Build Command: `npm run build`（自动读取）
   - Output Directory: `dist`（自动读取）

4. **开始部署**
   - 点击 **Deploy**
   - 等待构建完成（约 1-2 分钟）

5. **获取部署 URL**
   - 成功后会显示：`https://todo-app-[hash].vercel.app`

#### 方式 B：通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录
vercel login

# 3. 进入项目目录
cd /home/node/.openclaw/workspace/todo-app

# 4. 部署到 Vercel（首次会询问配置）
vercel

# 5. 部署到生产环境
vercel --prod
```

**CLI 交互问题**：
```
? Set up and deploy "~/todo-app"? [Y/n] Y
? Which scope do you want to deploy to? [选择账号]
? Link to existing project? [y/N] N
? What's your project's name? todo-app
? In which directory is your code located? ./
? Want to override the settings? [y/N] N
```

### 阶段三：部署验证（工部执行）

#### 3.1 功能测试清单

**基础功能**：
- [ ] 页面能正常加载
- [ ] 可以添加新任务
- [ ] 可以编辑任务
- [ ] 可以删除任务
- [ ] 可以标记任务完成/未完成
- [ ] 可以搜索任务
- [ ] 可以按状态过滤
- [ ] 可以按优先级过滤
- [ ] 数据在刷新后保持（localStorage）

**UI/UX 测试**：
- [ ] 响应式布局（移动端、平板、桌面）
- [ ] 动画效果流畅
- [ ] 颜色主题正确
- [ ] 图标显示正常

**性能测试**：
- [ ] 页面加载速度 < 3秒
- [ ] Lighthouse 性能评分 > 90（可选）

#### 3.2 部署信息记录

部署完成后，记录以下信息：

```markdown
## 🎉 部署成功

### GitHub 仓库
- 仓库地址: https://github.com/TWO-ICE/todo-app
- 分支: main
- 最新提交: [commit-hash]

### Vercel 部署
- 生产环境: https://todo-app-[hash].vercel.app
- 部署时间: 2026-03-15
- 构建时间: ~1-2分钟
- 状态: ✅ 成功

### 备用信息
- Git Commit: [提交哈希]
- Vercel 项目 ID: [项目ID]
```

---

## 🔍 风险评估与注意事项

### 潜在风险点

1. **GitHub Token 权限**
   - 风险：token 可能权限不足
   - 解决：确认 token 有 `repo` 和 `workflow` 权限

2. **Vercel 构建失败**
   - 风险：依赖安装失败或类型错误
   - 解决：本地先运行 `npm run build` 验证

3. **环境变量缺失**
   - 风险：如果后续添加环境变量
   - 解决：在 Vercel 项目设置中添加

4. **自定义域名 DNS**
   - 风险：DNS 解析延迟
   - 解决：提前配置，预留等待时间

### 注意事项

1. **不要在公开仓库中提交敏感信息**
   - API Keys
   - 密码
   - 个人 Token

2. **Vercel 免费版限制**
   - 带宽：100GB/月
   - 构建时间：6000分钟/月
   - 对小项目足够

3. **GitHub 仓库可见性**
   - Public：代码公开，适合开源项目
   - Private：代码私有，需要付费转为 Vercel 私有部署

---

## 📌 后续优化建议

部署完成后可以考虑：

1. **添加 CI/CD**
   - GitHub Actions 自动化测试
   - 自动化 Lint 检查

2. **SEO 优化**
   - 添加 meta 标签
   - 生成 sitemap

3. **监控与分析**
   - Vercel Analytics
   - Google Analytics

4. **PWA 支持**
   - 添加 manifest.json
   - 注册 Service Worker

5. **测试覆盖**
   - 添加单元测试
   - E2E 测试

---

## ✅ 规划完成确认

本规划已包含：

- ✅ GitHub 发布完整方案
- ✅ Vercel 部署详细步骤
- ✅ 完整执行流程
- ✅ 风险评估与注意事项
- ✅ 验证测试清单
- ✅ 后续优化建议

**下一步**：提交门下省审核，审核通过后交由工部执行。

---

**制定人**：中书省  
**日期**：2026-03-15  
**状态**：✅ 规划完成，待审核

#!/bin/bash

# ============================================
# Todo App 部署执行脚本
# 制定机构：尚书省
# 制定日期：2026-03-15
# ============================================

set -e  # 遇到错误立即退出

PROJECT_DIR="/home/node/.openclaw/workspace/todo-app"
GITHUB_REPO="TWO-ICE/todo-app"

echo "=========================================="
echo "Todo App 部署脚本"
echo "=========================================="

# 检查项目目录
if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 错误：项目目录不存在: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

# ============================================
# 阶段一：GitHub 推送
# ============================================
echo ""
echo "【阶段一】推送到 GitHub..."
echo "----------------------------------------"

# 检查当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 当前分支: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  警告：当前不在 main 分支"
fi

# 显示待推送的提交
echo ""
echo "📤 待推送的提交："
git log origin/main..main --oneline 2>/dev/null || git log --oneline -5

echo ""
echo "正在推送到 GitHub..."

# 使用 SSH 推送（已配置）
if git push origin main; then
    echo "✅ GitHub 推送成功"
else
    echo "❌ GitHub 推送失败"
    echo ""
    echo "可能的原因："
    echo "1. SSH 密钥未正确配置"
    echo "2. 网络连接问题"
    echo "3. 仓库权限问题"
    echo ""
    echo "请检查："
    echo "- SSH 配置: ~/.ssh/config"
    echo "- 网络连接: ssh -T git@github.com"
    exit 1
fi

# ============================================
# 阶段二：Vercel 部署
# ============================================
echo ""
echo "【阶段二】部署到 Vercel..."
echo "----------------------------------------"

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "📦 正在安装 Vercel CLI..."
    npm install -g vercel
fi

echo "🚀 开始部署..."

# 使用环境变量或提示输入
if [ -z "$VERCEL_TOKEN" ]; then
    echo "请输入 Vercel Token（或设置 VERCEL_TOKEN 环境变量）:"
    read -s VERCEL_TOKEN
fi

# 部署到生产环境
vercel --prod --token "$VERCEL_TOKEN" --yes

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo ""
echo "🌐 访问你的应用: https://todo-app.vercel.app"
echo ""
echo "📚 后续步骤："
echo "1. 配置自定义域名（可选）"
echo "2. 设置环境变量（如需要）"
echo "3. 配置自动部署"
echo ""

#!/bin/bash

echo "🎹 PianoBar 部署脚本"
echo "==================="
echo ""
echo "请选择部署方式："
echo "1) GitHub Pages"
echo "2) Vercel"
echo "3) Netlify"
echo "4) 仅构建"
echo ""

read -p "请输入选项 (1-4): " choice

case $choice in
  1)
    echo "部署到 GitHub Pages..."
    read -p "请输入GitHub仓库名（例如：pianobar-app）: " repo_name
    
    # 更新 vite.config.ts
    sed -i '' "s|base: './'|base: '/$repo_name/'|" vite.config.ts
    
    # 构建和部署
    npm run build
    npm run deploy
    
    echo "✅ 部署完成！访问地址：https://[your-username].github.io/$repo_name"
    ;;
    
  2)
    echo "部署到 Vercel..."
    if ! command -v vercel &> /dev/null; then
      echo "安装 Vercel CLI..."
      npm i -g vercel
    fi
    vercel
    ;;
    
  3)
    echo "构建项目用于 Netlify..."
    npm run build
    echo ""
    echo "✅ 构建完成！"
    echo "请将 dist 文件夹拖拽到 https://app.netlify.com/drop"
    ;;
    
  4)
    echo "构建项目..."
    npm run build
    echo "✅ 构建完成！文件在 dist 目录"
    ;;
    
  *)
    echo "无效选项"
    exit 1
    ;;
esac
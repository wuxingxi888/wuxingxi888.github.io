const fs = require('fs');
const path = require('path');

// 文章分类映射
const categoryMapping = {
  // 前端基础
  'javascript': '前端基础',
  'js': '前端基础',
  'css': '前端基础',
  'es6': '前端基础',
  'BFC': '前端基础',
  '闭包': '前端基础',
  '深浅拷贝': '前端基础',
  '原型': '前端基础',
  '事件循环': '前端基础',
  
  // 前端框架
  'vue': '前端框架',
  'element': '前端框架',
  'vue-cli': '前端框架',
  'webpack': '前端框架',
  'vite': '前端框架',
  'axios': '前端框架',
  'pinia': '前端框架',
  'svg': '前端框架',
  
  // 后端技术
  'nodejs': '后端技术',
  'express': '后端技术',
  'mysql': '后端技术',
  '数据库': '后端技术',
  'sequelize': '后端技术',
  'docker': '后端技术',
  
  // 工程化
  'npm': '工程化',
  'pnpm': '工程化',
  'monorepo': '工程化',
  'cdn': '工程化',
  'nvm': '工程化',
  'git': '工程化',
  'github': '工程化',
  'jsdelivr': '工程化',
  'picgo': '工程化',
  '部署': '工程化',
  '优化': '工程化',
  '构建': '工程化',
  
  // 移动开发
  'android': '移动开发',
  'ios': '移动开发',
  'webview': '移动开发',
  '小程序': '移动开发',
  
  // 实用技巧
  'mac': '实用技巧',
  '工具': '实用技巧',
  '面试': '实用技巧',
};

// 文章目录
const postsDir = path.join(__dirname, '../source/_posts');

// 获取所有文章文件
const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

console.log(`找到 ${postFiles.length} 篇文章`);

// 处理每篇文章
postFiles.forEach(file => {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 提取原有的分类和标签
  const categoryMatch = content.match(/categories:\s*(.*)/);
  const tagMatch = content.match(/tags:\s*(.*)/);
  
  if (!categoryMatch && !tagMatch) return;
  
  // 确定新的分类
  let newCategory = '其他';
  let tags = [];
  
  if (tagMatch) {
    tags = tagMatch[1].split(/\s+/).filter(t => t.trim());
    
    // 根据标签确定新分类
    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      if (categoryMapping[lowerTag]) {
        newCategory = categoryMapping[lowerTag];
        break;
      }
      
      // 检查是否包含关键字
      for (const [key, cat] of Object.entries(categoryMapping)) {
        if (lowerTag.includes(key)) {
          newCategory = cat;
          break;
        }
      }
      
      if (newCategory !== '其他') break;
    }
  }
  
  // 如果通过分类找不到，尝试通过文件名判断
  if (newCategory === '其他') {
    const lowerFileName = file.toLowerCase();
    for (const [key, cat] of Object.entries(categoryMapping)) {
      if (lowerFileName.includes(key)) {
        newCategory = cat;
        break;
      }
    }
  }
  
  // 更新内容
  if (categoryMatch) {
    content = content.replace(/categories:\s*.*/, `categories: ${newCategory}`);
  } else {
    // 如果没有categories，在tags后面添加
    if (tagMatch) {
      content = content.replace(/(tags:\s*.*)/, `$1\ncategories: ${newCategory}`);
    }
  }
  
  // 写回文件
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('文章分类整理完成');
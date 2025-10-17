const fs = require('fs');
const path = require('path');

// 更详细的文章分类映射
const detailedCategoryMapping = {
  // JavaScript基础
  'javascript': '前端基础',
  'js': '前端基础',
  'es6': '前端基础',
  '闭包': '前端基础',
  '深浅拷贝': '前端基础',
  '原型': '前端基础',
  '事件循环': '前端基础',
  'apply': '前端基础',
  'call': '前端基础',
  'bind': '前端基础',
  'var': '前端基础',
  'let': '前端基础',
  'const': '前端基础',
  '数据类型': '前端基础',
  '循环': '前端基础',
  
  // CSS相关
  'css': '前端基础',
  'hover': '前端基础',
  'bfc': '前端基础',
  
  // 前端框架
  'vue': '前端框架',
  'element': '前端框架',
  'vue-cli': '前端框架',
  'webpack': '前端框架',
  'vite': '前端框架',
  'axios': '前端框架',
  'pinia': '前端框架',
  'svg': '前端框架',
  'websocket': '前端框架',
  '路由': '前端框架',
  
  // 后端技术
  'nodejs': '后端技术',
  'express': '后端技术',
  'mysql': '后端技术',
  '数据库': '后端技术',
  'sequelize': '后端技术',
  'docker': '后端技术',
  '连接池': '后端技术',
  
  // 工程化和工具
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
  '骨架屏': '工程化',
  'cli': '工程化',
  '打包': '工程化',
  
  // 移动开发
  'android': '移动开发',
  'ios': '移动开发',
  'webview': '移动开发',
  '小程序': '移动开发',
  
  // 实用技巧
  'mac': '实用技巧',
  '工具': '实用技巧',
  '面试': '实用技巧',
  'zip': '实用技巧',
  '加密': '实用技巧',
  '解密': '实用技巧',
  '马赛克': '实用技巧',
  '图床': '实用技巧',
};

// 标签优化映射
const tagOptimization = {
  'javascript': ['javascript', 'js'],
  'css': ['css'],
  'vue': ['vue', 'vuejs'],
  'nodejs': ['nodejs', 'node'],
  'mysql': ['mysql', 'database'],
  '工程化': ['engineering', 'tooling'],
  '部署': ['deployment'],
  '优化': ['optimization'],
};

// 文章目录
const postsDir = path.join(__dirname, '../source/_posts');

// 获取所有文章文件
const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

console.log(`处理 ${postFiles.length} 篇文章`);

// 处理每篇文章
postFiles.forEach(file => {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 提取文件名中的关键词（不含扩展名）
  const fileName = path.basename(file, '.md').toLowerCase();
  
  // 提取原有的分类和标签
  const categoryMatch = content.match(/categories:\s*(.*)/);
  const tagMatch = content.match(/tags:\s*(.*)/);
  
  // 确定新的分类
  let newCategory = '其他';
  let tags = [];
  
  // 从现有标签中提取
  if (tagMatch) {
    tags = tagMatch[1].split(/\s+/).filter(t => t.trim());
    
    // 根据标签确定新分类
    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      if (detailedCategoryMapping[lowerTag]) {
        newCategory = detailedCategoryMapping[lowerTag];
        break;
      }
      
      // 检查是否包含关键字
      for (const [key, cat] of Object.entries(detailedCategoryMapping)) {
        if (lowerTag.includes(key)) {
          newCategory = cat;
          break;
        }
      }
      
      if (newCategory !== '其他') break;
    }
  }
  
  // 如果通过标签找不到，尝试通过文件名判断
  if (newCategory === '其他') {
    for (const [key, cat] of Object.entries(detailedCategoryMapping)) {
      if (fileName.includes(key)) {
        newCategory = cat;
        break;
      }
    }
  }
  
  // 优化标签
  let newTags = [...new Set(tags)]; // 去重
  
  // 如果分类确定了，添加相关标签
  if (newCategory !== '其他' && tagOptimization[newCategory]) {
    newTags = [...new Set([...newTags, ...tagOptimization[newCategory]])];
  }
  
  // 添加技术标签
  if (newCategory !== '其他') {
    newTags = [...new Set([...newTags, newCategory.toLowerCase()])];
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
  
  if (tagMatch && newTags.length > 0) {
    content = content.replace(/tags:\s*.*/, `tags: ${newTags.join(' ')}`);
  }
  
  // 写回文件
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('文章分类和标签优化完成');
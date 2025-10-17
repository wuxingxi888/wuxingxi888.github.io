const fs = require('fs');
const path = require('path');

// 文章目录
const postsDir = path.join(__dirname, '../source/_posts');

// 获取所有文章文件
const postFiles = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

// 统计数据
const categoryStats = {};
const tagStats = {};
const yearStats = {};

console.log(`分析 ${postFiles.length} 篇文章`);

// 处理每篇文章
postFiles.forEach(file => {
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 提取日期
  const dateMatch = content.match(/date:\s*(.+)/);
  if (dateMatch) {
    const dateStr = dateMatch[1].trim();
    const date = new Date(dateStr);
    const year = date.getFullYear();
    yearStats[year] = (yearStats[year] || 0) + 1;
  }
  
  // 提取分类
  const categoryMatch = content.match(/categories:\s*(.*)/);
  if (categoryMatch) {
    const categories = categoryMatch[1].split(/\s+/).filter(c => c.trim());
    categories.forEach(category => {
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });
  }
  
  // 提取标签
  const tagMatch = content.match(/tags:\s*(.*)/);
  if (tagMatch) {
    const tags = tagMatch[1].split(/\s+/).filter(t => t.trim());
    tags.forEach(tag => {
      tagStats[tag] = (tagStats[tag] || 0) + 1;
    });
  }
});

// 输出统计报告
console.log('\n=== 分类统计 ===');
Object.entries(categoryStats)
  .sort(([,a], [,b]) => b - a)
  .forEach(([category, count]) => {
    console.log(`${category}: ${count} 篇`);
  });

console.log('\n=== 标签统计 ===');
Object.entries(tagStats)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 20) // 只显示前20个标签
  .forEach(([tag, count]) => {
    console.log(`${tag}: ${count} 篇`);
  });

console.log('\n=== 年度发布统计 ===');
Object.keys(yearStats)
  .sort()
  .forEach(year => {
    console.log(`${year}年: ${yearStats[year]} 篇`);
  });

// 保存报告到文件
const report = `
# 博客文章统计报告

## 分类统计
${Object.entries(categoryStats)
  .sort(([,a], [,b]) => b - a)
  .map(([category, count]) => `- ${category}: ${count} 篇`)
  .join('\n')}

## 标签统计 (前20个)
${Object.entries(tagStats)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 20)
  .map(([tag, count]) => `- ${tag}: ${count} 篇`)
  .join('\n')}

## 年度发布统计
${Object.keys(yearStats)
  .sort()
  .map(year => `- ${year}年: ${yearStats[year]} 篇`)
  .join('\n')}
`;

fs.writeFileSync(path.join(__dirname, '../source/_posts_report.md'), report, 'utf8');
console.log('\n报告已保存到 source/_posts_report.md');
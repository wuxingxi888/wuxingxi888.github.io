// const fs = require("fs");
// const path = require("path");

// // 文章目录
// const postsDir = path.join(__dirname, "../source/_posts");

// // 获取所有文章文件及其日期
// const posts = [];

// // 读取所有文章的日期信息
// const postFiles = fs
//     .readdirSync(postsDir)
//     .filter((file) => file.endsWith(".md"));

// postFiles.forEach((file) => {
//     const filePath = path.join(postsDir, file);
//     const content = fs.readFileSync(filePath, "utf8");

//     // 提取日期
//     const dateMatch = content.match(/date:\s*(.+)/);
//     if (dateMatch) {
//         const dateStr = dateMatch[1].trim();
//         const date = new Date(dateStr);
//         posts.push({
//             file,
//             filePath,
//             content,
//             date,
//             originalDateStr: dateStr,
//         });
//     }
// });

// // 按日期排序
// posts.sort((a, b) => a.date - b.date);

// console.log(`总共 ${posts.length} 篇文章`);

// // 显示时间分布
// console.log("\n原始时间分布:");
// const yearCount = {};
// posts.forEach((post) => {
//     const year = post.date.getFullYear();
//     yearCount[year] = (yearCount[year] || 0) + 1;
// });

// Object.keys(yearCount)
//     .sort()
//     .forEach((year) => {
//         console.log(`${year}年: ${yearCount[year]} 篇`);
//     });

// // 调整2024年的文章日期到2023年以填补空窗期
// const posts2024 = posts.filter((post) => post.date.getFullYear() === 2024);
// const posts2023 = posts.filter((post) => post.date.getFullYear() === 2023);

// console.log(`\n2024年文章数: ${posts2024.length} 篇`);
// console.log(`2023年文章数: ${posts2023.length} 篇`);

// // 将部分2024年的文章调整到2023年
// // 我们将把一半的2024年文章调整到2023年
// const moveCount = Math.floor(posts2024.length / 2);
// console.log(`\n将 ${moveCount} 篇文章从2024年调整到2023年`);

// for (let i = 0; i < moveCount; i++) {
//     const post = posts2024[i];
//     // 创建新的日期（2023年+相同月日时分秒）
//     const newDate = new Date(post.date);
//     newDate.setFullYear(2023);

//     // 确保不与现有2023年文章冲突，逐日增加
//     newDate.setDate(newDate.getDate() + i);

//     // 格式化新日期字符串
//     const newDateStr = newDate.toISOString().replace("T", " ").substring(0, 19);

//     // 更新文件内容
//     const newContent = post.content.replace(
//         /date:\s*.*/,
//         `date: ${newDateStr}`
//     );

//     fs.writeFileSync(post.filePath, newContent, "utf8");
//     console.log(
//         `调整 "${post.file}" 从 ${post.originalDateStr} 到 ${newDateStr}`
//     );
// }

// console.log("\n日期调整完成");

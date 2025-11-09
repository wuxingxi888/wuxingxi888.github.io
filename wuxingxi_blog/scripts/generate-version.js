/**
 * 自动生成版本信息脚本
 * 在每次执行 hexo generate 时自动更新 version.json 文件
 * 注意：在 hexo server 模式下不会更新版本，避免无限循环
 */

const fs = require("fs");
const path = require("path");

// 注册 hexo generate 前的钩子
hexo.extend.filter.register("before_generate", function () {
    // 检测是否在 server 模式下运行
    // 如果在 server 模式下，不更新版本号，避免无限循环
    const isServerMode =
        process.argv.includes("server") || process.argv.includes("s");

    if (isServerMode) {
        // 在 server 模式下，只读取版本信息，不更新
        const versionPath = path.join(hexo.source_dir, "version.json");
        if (fs.existsSync(versionPath)) {
            try {
                const existingData = JSON.parse(
                    fs.readFileSync(versionPath, "utf8")
                );
                console.log("当前版本信息:", existingData);
            } catch (error) {
                console.log("读取版本文件时出错:", error);
            }
        }
        return;
    }

    // 只在非 server 模式下更新版本
    const versionPath = path.join(hexo.source_dir, "version.json");

    // 读取现有的版本文件（如果存在）
    let versionData = {
        version: "1.0.0",
        buildTime: new Date().toISOString(),
    };

    try {
        if (fs.existsSync(versionPath)) {
            const existingData = JSON.parse(
                fs.readFileSync(versionPath, "utf8")
            );
            // 增加修订版本号
            const versionParts = existingData.version.split(".");
            versionParts[2] = parseInt(versionParts[2]) + 1;
            versionData.version = versionParts.join(".");
            versionData.buildTime = new Date().toISOString();
        }
    } catch (error) {
        console.log("读取现有版本文件时出错:", error);
    }

    // 写入版本文件
    fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));

    console.log("版本信息已更新:", versionData);
});

---
title: mysql连接池的premise封装
date: 2021-10-14 11:39:32
tags: mysql javascript 后端技术
categories: 后端技术
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/mysql.jpeg"
---

```javascript
新建db.js， 内容如下：

const mysql = require('mysql');

// 创建连接池
const pool = mysql.createPool({
  connectionLimit: 5,
  host: process.env.dbHost,
  user: process.env.dbUser,
  password: process.env.dbPassword,
  database: process.env.dbDatabase,
  multipleStatements: true
});

let query = function (sql, values) {
  // 返回一个 Promise
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          // 结束会话
          connection.release()
        })
      }
    })
  })
}

module.exports = {
  query
}
使用
const handler = require('./db.js')

handlder.query({
    sql: 'select * from table where id = ?',
    params: [id],
    success: res => {
        console.log(res);
    },
    error: err => {
        console.log(err);
    }
});
```


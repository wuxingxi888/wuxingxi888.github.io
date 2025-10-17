---
title: element-ui之dialog组件封装
date: 2020-05-09 11:36:00
tags: element vue 前端框架
categories: 前端框架
top_img:
cover: "https://wuxingxi-blog.oss-cn-beijing.aliyuncs.com/images/elementUI.jpeg"
---

```html
组件封装：
<template>
  <span>
    <span class="resetPass" @click="openDialog">修改密码</span>
    <el-dialog
      :visible.sync="DialogVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      title="修改密码"
      width="30%"
      append-to-body
      center
      @close="resetForm('ruleForm')">
      <span>this is a dialog</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
export default {
  name: 'ResetPassword',
  data() {
    return {
      DialogVisible: false,
    }
  },
  methods: {
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          
        } else {
        
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    openDialog() {
      this.DialogVisible = true
    }
  }
}
</script>

组件使用：
<template>
    <div>
     <reset-Password/>
    </div>
</template>

<script>
import ResetPassword from '../../components/dialog/resetPassword'
export default {
  name: 'AppMain',
  components: {ResetPassword},
  data () {
       return {};
        },
   methods: {},
   };
</script>

```


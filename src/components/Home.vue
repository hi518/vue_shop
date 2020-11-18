<!-- 主页部分 -->
<template>
  <div>
    <el-button @click="logout" type="info">退出</el-button>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
    }
  },
  methods: {
    logout() {
      // 清空 token
      window.sessionStorage.clear();
      // 跳转至登录页
      this.$router.push('/login');
    }
  }
}
</script>

<style  lang='less' scoped>

</style>

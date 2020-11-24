<!-- 主页部分 -->
<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理平台</span>
      </div>
      <el-button @click="logout" type="info" class="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#359BFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-submenu
            :index="menuItem.id + ''"
            v-for="menuItem in munuList"
            :key="menuItem.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconfontObj[menuItem.id]"></i>
              <span>{{ menuItem.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subMenuItem.path"
              v-for="subMenuItem in menuItem.children"
              :key="subMenuItem.id"
              @click="saveNavState('/' + subMenuItem.path)"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ subMenuItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      // 左侧菜单数据
      munuList: [],
      iconfontObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: '',
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清空 token
      window.sessionStorage.clear()
      // 跳转至登录页
      this.$router.push('/login')
    },
    // 获取菜单数据函数
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.munuList = res.data
      // console.log(res)
    },
    // 点击按钮，折叠菜单栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 点击二级菜单，保存链接的状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
}
</script>

<style  lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  color: #fff;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  user-select: none;
  .toggle-button {
    line-height: 24px;
    background-color: #4a5064;
    font-size: 10px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
  }
  .el-menu {
    border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
</style>

<template>
  <el-container class="admin-home">
    <el-header class="admin-header">
      <!-- 头部区域 -->
      <div class="admin-header-left">
        <img src="../../assets/test.jpg" alt="后台管理logo">
        <span>后台电商管理系统</span>
      </div>
      <el-button
        type="info"
        class="admin-logout"
        @click="logout"
      >退出</el-button></el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px' " class="admin-aside">
        <div class="toggle-botton" @click="toggleCollapse"><i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" /></div>
        <!-- 侧边栏菜单区 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          router
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="admin-aideIcon">
                <svg class="defined-icon" aria-hidden="true">
                  <use :xlink:href="iconsObj[item.id]" />
                </svg>
              </i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="itemChildren in item.children" :key="itemChildren.id" :index="'/'+itemChildren.path + ''">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu" />
                <!-- 文本 -->
                <span>{{ itemChildren.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main class="admin-main">
          <router-view />
        </el-main>
        <!-- <el-footer class="admin-footer">Footer</el-footer> -->
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 侧边菜单数据
      menuList: [],
      iconsObj: {
        '125': '#icon-username',
        '103': '#icon-quanxian',
        '101': '#icon-shopping',
        '102': '#icon-order',
        '145': '#icon-baobiao'
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 侧边栏的折叠
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style scoped lang="scss">
.admin-home {
  height: 100%;

  .admin-header {
    background: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .admin-header-left {
      display: flex;
      align-items: center;
      color: #fff;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
    .admin-logout {
      height: 40px;
    }
  }
  .admin-aside {
    background: #333744;
    .admin-aideIcon{margin-right:5px;line-height:5px;}
    .el-menu{border-right:none;}
    .toggle-botton{background:#4a5064;color:#fff;cursor:pointer;font-size:20px;line-height: 24px;text-align: center;letter-spacing:.2em;}
  }
  .admin-main {
    background: #eaedf1;
  }

  .admin-footer {
    background: #373d41;
    color: #fff;
  }
}
</style>

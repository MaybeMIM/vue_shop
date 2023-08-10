<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="danger" @click="logout">退出</el-button></el-header
    >
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="active"
        >
          <!-- this.$router.currentRoute.path -->
          <!-- 一级菜单 -->
          <el-submenu
            :index="'/' + item.path"
            v-for="item in menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[item.authName]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script>
import { genMenuList } from "../api";
export default {
  name: "Home",
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      iconList: {
        用户管理: "el-icon-user-solid",
        权限管理: "el-icon-star-on",
        商品管理: "el-icon-s-goods",
        订单管理: "el-icon-s-order",
        数据统计: "el-icon-document-copy",
      },
      // 折叠属性
      isCollapse: false,
      active: "",
    };
  },
  methods: {
    logout() {
      // 清空
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    // 点击菜单切换折叠展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 点击子菜单高亮显示
    saveNavState(path) {
      if (this.$route.path == path) {
        this.active = path;
      }
    },
  },

  mounted() {
    genMenuList().then(({ data }) => {
      // 将data从promise对象中解构出来
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
      this.menuList = data.data;
      // console.log(this.menuList);
    });
  },
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
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
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border: 0;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>>

<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/homelogo.jpg" />
        <span>秒杀系统管理后台</span>
      </div>

      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <el-menu-item index="/dashboard" @click="saveNavState('/dashboard')">
            <img :src="require(`../assets/dashboard.png`)" class="iconSize" />
            <span slot="title">仪表盘</span>
          </el-menu-item>
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
              <template slot="title">
                <img :src="require(`../assets/${item.icon}`)" class="iconSize" />
                <span slot="title">{{item.description}}</span>
              </template>
              <el-menu-item
                :index="subItem.url"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="saveNavState(subItem.url)"
              >
                <template slot="title">
                  <img :src="require(`../assets/${subItem.icon}`)" class="iconSize" />
                  <span>{{subItem.description}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      isCollapse: false,
      //被激活的连接地址
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      this.menulist = JSON.parse(window.sessionStorage.getItem("data"));
      console.log(this.menulist)
      this.menulist.shift()
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
    }
  }
};
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    width: 250px;
    height: 50px;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button {
  background-color: #4a5064;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.iconSize {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}
</style>
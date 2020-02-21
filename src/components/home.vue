<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/homelogo.jpg" alt />
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
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span slot="title">{{item.description}}</span>
            </template>
            <el-menu-item
              :index="subItem.url"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState(subItem.url)"
            >
              <template slot="title">
                <i :class="subIconsObj[subItem.id]"></i>
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
      iconsObj: {
        "125": "el-icon-menu",
        "103": "el-icon-s-shop",
        "101": "el-icon-s-flag",
        "102": "el-icon-s-opportunity",
        "145": "el-icon-video-camera-solid"
      },
      subIconsObj: {
        "110": "el-icon-goods",
        "111": "el-icon-magic-stick",
        "112": "el-icon-user",
        "104": "el-icon-monitor",
        "115": "el-icon-lock",
        "121": "el-icon-camera",
        "107": "el-icon-video-camera",
        "146": "el-icon-mouse"
      },
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
      // const { data: res } = await this.$http.get("menus");
      // if (res.code !== 200) return this.$message.error('获取左侧菜单数据失败！');
      // this.menulist = res.data;
      // console.log(res)

      this.menulist = JSON.parse(window.sessionStorage.getItem("data"));
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      // this.activePath = activePath
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
</style>
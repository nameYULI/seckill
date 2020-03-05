<template>
  <el-container>
    <el-header>
      <div class="title">
        <img src="../assets/homelogo.jpg" />
        <span>秒杀系统管理后台</span>
      </div>

      <div class="header-right">
        <div class="header-user-con">
          <div class="btn-fullscreen" @click="handleFullScreen">
            <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
              <i class="el-icon-rank"></i>
            </el-tooltip>
          </div>
          <!-- 用户头像 -->
          <div class="user-avator">
            <img src="../assets/logo1.jpg" />
          </div>

          <!-- 用户名下拉菜单 -->
          <el-dropdown class="user-name" trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">{{username}}</span>
            <i class="el-icon-caret-bottom"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command>修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <!-- <el-button type="info" @click="logout">退出</el-button> -->
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
          <el-menu-item v-if="hasDashboard" index="/dashboard" @click="saveNavState('/dashboard')">
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
      hasDashboard: false,
      fullscreen: false,
      username: "",
      menulist: [],
      isCollapse: false,
      //被激活的连接地址
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
    this.username = window.sessionStorage.getItem("username");
  },
  methods: {
    //用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "logout") {
        window.sessionStorage.clear();
        this.$router.push("/login");
      }
    },
    //全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullScreen) {
          document.msExitFullScreen();
        }
      } else {
        if (element.requestFullScreen) {
          element.requestFullScreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullScreen) {
          element.msRequestFullScreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },

    getMenuList() {
      this.menulist = JSON.parse(window.sessionStorage.getItem("data"));
      // console.log(this.menulist);
      if (this.menulist[0].children.length == 0) {
        this.menulist.shift();
        this.hasDashboard = true;
      }
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
.header-right {
  width: 145px;
  float: right;
  .header-user-con {
    display: flex;
    align-items: center;
    height: 50px;
    img {
      margin-left: 10px;
      width: 35px;
      height: 35px;
    }
    .btn-fullscreen {
      font-size: 24px;
    }
    .el-dropdown-link {
      font-size: 16px;
      color: white;
    }
  }
  &div {
    display: inline-block;
    margin-right: 15px;
    font-size: 16px !important;
  }
}
.el-container {
  height: 100%;
}
.title {
  font-size: 20px;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
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
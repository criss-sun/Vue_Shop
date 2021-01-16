<template>
  <el-container class="home-container">
    <el-header>
      <div class="header-left">
        <img src="../assets/images/logo.png" alt="logo">
        <span>黑叶猴管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '250px'">
        <div class="collapse" @click="isCollapse = !isCollapse" :style="{'letterSpacing': isCollapse ? '1px': '4px'}">|||</div>
        <!-- 菜单 -->
        <el-menu :default-active="defaultActive" text-color="#fff" background-color="#323744" active-text-color="#3977da" :collapse="isCollapse" :collapse-transition="false">
          <!-- 一级菜单 -->
          <el-submenu v-for="menu1 in menus" :key="menu1.id" :index="menu1.id + ''">
            <!-- icon和描述 -->
            <template slot="title"><i :class="menuIcons[menu1.id]"></i><span>{{ menu1.authName }}</span></template>
            <!-- 二级菜单 -->
            <el-menu-item :index="menu2.id + ''" v-for="menu2 in menu1.children" :key="menu2.id" @click="jump(menu2.path, menu2.id)">
              <template slot="title"><i :class="menuIcons[menu2.id]"></i><span>{{ menu2.authName }}</span></template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenus();
    const menuId = sessionStorage.getItem("menuId");
    this.defaultActive = menuId;
  },
  data() {
    return {
      menus: [],
      defaultActive: "",
      isCollapse: false,
      menuIcons: {
        125: "el-icon-user",
        103: "el-icon-box",
        101: "el-icon-shopping-bag-2",
        102: "el-icon-s-order",
        145: "el-icon-data-line",
        110: "el-icon-menu",
        111: "el-icon-menu",
        112: "el-icon-menu",
        115: "el-icon-menu",
        121: "el-icon-menu",
        104: "el-icon-menu",
        107: "el-icon-menu",
        146: "el-icon-menu",
      },
    };
  },
  methods: {
    logout() {
      sessionStorage.removeItem("token");
      this.$message({
        type: "success",
        message: "退出成功",
      });
      this.$router.push("/login");
    },
    async getMenus() {
      const { data } = await this.$http.get("/menus");
      if (data.meta.status == 200) {
        this.menus = data.data;
        this.$message.success("获取菜单列表成功");
      } else {
        this.$message.error("获取菜单列表失败");
      }
    },
    jump(path, id) {
      sessionStorage.setItem("menuId", id);
      this.$router.push("/home/" + path);
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;

  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 2px;
    background-color: #373c41;

    .header-left {
      display: flex;
      align-items: center;
      img {
        border-radius: 50%;
        width: 60px;
        height: 60px;
      }
      span {
        padding-left: 10px;
        font-size: 20px;
        color: #e2e9e0;
      }
    }
  }

  .el-aside {
    background-color: #323744;
    .el-menu {
      border-right: 0;
    }
    .collapse {
      font-size: 10px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
      background-color: #485164;
    }
  }

  .el-main {
    background: #eaedf2;
  }
}
</style>
<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限模块</el-breadcrumb-item>
      <el-breadcrumb-item>人员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button size="medium" type="primary" @click="showAddDialog">添加</el-button>
        </el-col>
        <el-col :span="2">
          <el-button size="medium" type="danger" @click="deleteAdmin">删除</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="adminList"
        @selection-change="handleSelectionChange"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="管理员id"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="realName" label="真实姓名"></el-table-column>
        <el-table-column label="是否为超管">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.isSuper===true">是</el-tag>
            <el-tag size="small" type="success" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="editAdmin(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加管理人员的对话框 -->
      <el-dialog
        title="添加人员"
        :visible.sync="addAdminDialogVisible"
        width="40%"
        @close="addAdminDialogClosed"
      >
        <el-form
          status-icon
          :model="addAdminForm"
          :rules="addAdminFormRules"
          ref="addAdminFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addAdminForm.username"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="addAdminForm.realName"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-tree
              :data="rolesList"
              show-checkbox
              node-key="id"
              :default-checked-keys="[1]"
              :default-expand-all = false
              :props="rolesTreeProps"
              ref="treeRef"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addAdminDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSure">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      adminList: [],
      addAdminDialogVisible: false,
      addAdminForm: {
        username: "",
        realName: ""
      },
      addAdminFormRules: {},

      //树形控件的属性绑定对象
      rolesTreeProps: {
        label: "label",
        children: "children"
      },
      rolesList: [
        {
          id: 1,
          label: "仪表盘",
          children: [
          ]
        },{
          id: 2,
          label: "业务模块",
          children: [
            {
              id: 3,
              label: "商品管理"
            },
            {
              id: 4,
              label: "订单管理"
            }
          ]
        },
        {
          id: 5,
          label: "日志模块",
          children: [
            {
              id: 6,
              label: "管理员监控日志"
            }
          ]
        },
        {
          id: 7,
          label: "权限模块",
          children: [
            {
              id: 8,
              label: "人员管理"
            },
             {
              id: 9,
              label: "角色管理"
            }
          ]
        },
        {
          id: 10,
          label: "系统管理模块",
          children: [
            {
              id: 11,
              label: "系统配置"
            }
          ]
        }
      ],
      multipleSelection: [],
      ids: "",
      addAdminFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        realName: [
          {
            required: true,
            message: "请输入真实姓名",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getAdminList();
  },
  methods: {
    async getAdminList() {
      const { data: res } = await this.$http.post("/api/administrator/list");
      if (res.code !== "200") {
        return this.$message.error("获取人员列表失败");
      }
      this.adminList = res.data;
    },
    async showAddDialog() {
      const { data: res } = await this.$http.post("/api/perms/findAll");
      // this.rolesList = res.data;
      this.addAdminDialogVisible = true;
    },
    addAdminDialogClosed() {
      this.$refs.addAdminFormRef.resetFields();
    },
    addSure() {
      var roldIds = this.$refs.treeRef.getCheckedKeys()
      console.log(roldIds)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.ids = "";
      this.multipleSelection.forEach(data => {
        this.ids += data.id + ",";
      });
      if (this.ids.length > 0) {
        this.ids = this.ids.substr(0, this.ids.length - 1);
      }
    },
    async deleteAdmin() {
      const confirmResult = await this.$confirm(
        "此操作将永久删除所选人员，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.post(
        "/api/administrator/delete",
        qs.stringify({ ids: this.ids }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      if (res.code !== "200") {
        return this.$message.error("删除人员失败");
      }
      this.$message.success("删除成功!");
      this.getAdminList();
    },
    editAdmin() {}
  }
};
</script>

<style lang="less" scoped>
</style>
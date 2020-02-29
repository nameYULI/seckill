<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限模块</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button size="medium" type="primary" @click="showAddDialog">添加</el-button>
        </el-col>
        <el-col :span="2">
          <el-button size="medium" type="danger" @click="deleteRole">删除</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="roleList"
        @selection-change="handleSelectionChange"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="角色id"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="editRole(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加人员"
        :visible.sync="addRoleDialogVisible"
        width="40%"
        @close="addRoleDialogClosed"
      >
        <el-form
          status-icon
          :model="addRoleForm"
          :rules="addRoleFormRules"
          ref="addAdminFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="addRoleForm.description"></el-input>
          </el-form-item>
          <el-form-item label="拥有权限">
            <el-tree
              :data="rolesList"
              :props="rolesTreeProps"
              show-checkbox
              node-key="id"
              default-expand-all
              :default-checked-keys="defKeys"
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
      roleList: [],
      roleForm: {},
      addRoleDialogVisible: false,
      addRoleForm: {
        roleName: "",
        description: ""
      },
      addRoleFormRules: {},
      rolesList: [],
      //树形控件的属性绑定对象
      rolesTreeProps: {
        label: "",
        children: "children"
      },
      //默认选中的节点id值数组
      defKeys: [],
      multipleSelection: [],
      ids: ""
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.post("/api/role/list");
      if (res.code !== "200") {
        return this.$message.error("获取角色列表失败");
      }
      this.roleList = res.data;
    },
    showAddDialog() {
      this.addRoleDialogVisible = true;
    },
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields();
    },
    addSure() {},
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
    async deleteRole() {
      const confirmResult = await this.$confirm(
        "此操作将永久删除所选角色，是否继续?",
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
        "/api/role/delete",
        qs.stringify({ ids: this.ids }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      if (res.code !== "200") {
        return this.$message.error("删除角色失败");
      }
      this.$message.success("删除成功!");
      this.getAdminList();
    },
    editRole() {}
  }
};
</script>

<style lang="less" scoped>
</style>
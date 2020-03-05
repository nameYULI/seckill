<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
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
            <el-button type="success" size="mini" @click="editRole(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色的对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialogVisible"
        width="40%"
        @close="addRoleDialogClosed"
      >
        <el-form
          status-icon
          :model="addRoleForm"
          :rules="addRoleFormRules"
          ref="addRoleFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRoleForm.description"></el-input>
          </el-form-item>
          <el-form-item label="拥有权限">
            <el-tree
              :data="rolesList"
              :props="rolesTreeProps"
              show-checkbox
              node-key="id"
              default-expand-all
              ref="treeRef"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSure">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色的对话框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editRoleDialogVisible"
        width="40%"
        @close="editRoleDialogClosed"
      >
        <el-form
          status-icon
          :model="editRoleForm"
          :rules="addRoleFormRules"
          ref="editRoleFormRef"
          label-width="100px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRoleForm.description"></el-input>
          </el-form-item>
          <el-form-item label="拥有权限">
            <el-tree
              :data="rolesList"
              :props="rolesTreeProps"
              show-checkbox
              node-key="id"
              default-expand-all
              :default-checked-keys="ownRolesList"
              ref="treeRef"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSure">确 定</el-button>
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
        description: "",
        permIds: "",
        type: 0
      },
      addRoleFormRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
            trigger: "blur"
          }
        ]
      },
      editRoleForm: {
        id: 0,
        roleName: "",
        description: "",
        permIds: "",
        type: 0
      },
      editRoleDialogVisible: false,
      ownRolesList: [],
      rolesList: [],
      //树形控件的属性绑定对象
      rolesTreeProps: {
        label: "description",
        children: "children"
      },
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
    async showAddDialog() {
      const { data: res } = await this.$http.post("/api/perms/findAll");
      this.rolesList = res.data;
      this.addRoleDialogVisible = true;
    },
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields();
    },
    addSure() {
      this.addRoleForm.permIds = this.$refs.treeRef.getCheckedKeys().toString();
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/api/role/add",
          this.addRoleForm
        );
        if (res.code !== "200") {
          return this.$message.error("添加角色失败！");
        }
        this.$message.success("添加成功！");
        this.addRoleDialogVisible = false;
        this.getRoleList();
      });
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
      this.getRoleList();
    },
    async editRole(row) {
      const { data: res1 } = await this.$http.post("/api/perms/findAll");
      this.rolesList = res1.data;
      var ids = [];
      const { data: res } = await this.$http.post(
        "/api/perms/findByRoleId",
        qs.stringify({ roleId: row.id }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      res.data.forEach(function(value, index) {
        if (value.children.length == 0) {
          ids.push(value.id);
        }
        value.children.forEach(function(val, index) {
          ids.push(val.id);
        });
      });
      this.ownRolesList = ids;
      console.log(this.ownRolesList);
      this.editRoleForm.roleName = row.roleName;
      this.editRoleForm.description = row.description;
      this.editRoleForm.id = row.id;
      this.editRoleDialogVisible = true;
    },
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields();
    },
    editSure() {
      this.editRoleForm.permIds = this.$refs.treeRef
        .getCheckedKeys()
        .toString();
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/api/role/update",
          this.editRoleForm
        );
        if (res.code !== "200") {
          return this.$message.error("修改角色失败！");
        }
        this.$message.success("修改成功！");
        this.editRoleDialogVisible = false;
        this.getRoleList();
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
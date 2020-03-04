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
            <el-button type="success" size="mini" @click="editAdmin(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加管理人员的对话框 -->
      <el-dialog
        title="添加人员"
        :visible.sync="addAdminDialogVisible"
        width="512px"
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
            <el-select v-model="addAdminForm.roleIds" multiple placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addAdminDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSure">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑管理人员的对话框 -->
      <el-dialog
        title="编辑人员"
        :visible.sync="editAdminDialogVisible"
        width="512px"
        @close="editAdminDialogClosed"
      >
        <el-form
          status-icon
          :model="editAdminForm"
          :rules="addAdminFormRules"
          ref="editAdminFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editAdminForm.username"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="editAdminForm.realName"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="ownRolesList" multiple placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editAdminDialogVisible = false">取 消</el-button>
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
      adminList: [],
      addAdminDialogVisible: false,
      addAdminForm: {
        username: "",
        realName: "",
        roleIds: []
      },

      editAdminDialogVisible: false,
      editAdminForm: {
        id: 0,
        isSuper: false,
        realName: "",
        roleIds: "",
        username: ""
      },
      ownRolesList: [],

      rolesList: [],
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
    async getRoles() {
      const { data: res } = await this.$http.post("/api/role/list");
      const data1 = [];
      res.data.forEach(function(value, index) {
        data1.push({
          value: value.id,
          label: value.roleName
        });
      });
      this.rolesList = data1;
    },
    showAddDialog() {
      this.getRoles();
      this.addAdminDialogVisible = true;
    },
    addAdminDialogClosed() {
      this.$refs.addAdminFormRef.resetFields();
    },
    addSure() {
      this.addAdminForm.roleIds = this.addAdminForm.roleIds.toString();
      this.$refs.addAdminFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/api/administrator/add",
          this.addAdminForm
        );
        if (res.code !== "200") {
          return this.$message.error("添加管理员失败！");
        }
        this.$message.success("添加成功！");
        this.addAdminDialogVisible = false;
        this.getAdminList();
      });
    },
    editAdminDialogClosed() {
      this.$refs.editAdminFormRef.resetFields();
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
    async editAdmin(row) {
      this.getRoles();
      var ids = [];
      const { data: res } = await this.$http.post(
        "/api/role/findByAdminId",
        qs.stringify({ id: row.id }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      res.data.forEach(function(value, index) {
        ids.push(value.id);
      });
      console.log(ids);
      this.ownRolesList = ids;
      this.editAdminForm = row;
      this.editAdminDialogVisible = true;
    },
    editSure() {
      this.ownRolesList = this.ownRolesList.toString();
      this.editAdminForm.roleIds = this.ownRolesList;
      this.$refs.editAdminFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/api/administrator/update",
          this.editAdminForm
        );
        if (res.code !== "200") {
          return this.$message.error("修改管理员失败！");
        }
        this.$message.success("修改成功！");
        this.editAdminDialogVisible = false;
        this.getAdminList();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-select {
  display: block;
  width: 372px !important;
}
</style>
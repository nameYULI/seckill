<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>业务模块</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="2">
          <el-button size="medium" type="primary" @click="showAddDialog">添加</el-button>
        </el-col>
        <el-col :span="2">
          <el-button size="medium" type="danger" @click="deleteCommodity">删除</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.commodityName"
            clearable
            @clear="getCommodityList"
          >
            <template slot="prepend">商品名称</template>
          </el-input>
        </el-col>
        <el-col :span="5" style="margin:10px 0 0;width:148px;">
          <div class="spanText">是否仅展示秒杀商品</div>
        </el-col>
        <el-col :span="3">
          <el-select v-model="queryInfo.sec" placeholder="请选择">
            <el-option label="否" :value="false"></el-option>
            <el-option label="是" :value="true"></el-option>
          </el-select>
        </el-col>
        <el-col :span="2" style="margin:10px 0 0;">
          <el-button type="primary" icon="el-icon-search" @click="getCommodityList"></el-button>
        </el-col>
      </el-row>

      <el-table
        :data="commodityList"
        @selection-change="handleSelectionChange"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="ID" width="80px"></el-table-column>
        <el-table-column prop="commodityName" label="商品名称" width="120px"></el-table-column>
        <el-table-column prop="price" label="价格" width="100px"></el-table-column>
        <el-table-column prop="stock" label="库存" width="100px"></el-table-column>
        <el-table-column prop="description" label="商品描述" width="180px"></el-table-column>
        <el-table-column label="是否为秒杀商品" width="120px">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.sec===true">是</el-tag>
            <el-tag size="small" type="success" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              v-if="scope.row.sec===false"
              @click="setAsSec(scope.row)"
            >设为秒杀商品</el-button>
            <el-button
              type="danger"
              size="mini"
              v-if="scope.row.sec===true"
              @click="underCarriage(scope.row.id)"
            >下架</el-button>
            <el-button
              type="warning"
              size="mini"
              v-if="scope.row.sec===true"
              @click="modifyCommodity(scope.row.id)"
            >修改</el-button>
            <el-button type="success" size="mini" @click="showEditCommodityDialog(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[5, 10, 15,20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加商品的对话框 -->
      <el-dialog
        title="添加商品"
        :visible.sync="addCommodityDialogVisible"
        width="40%"
        @close="addCommodityDialogClosed"
      >
        <el-form
          status-icon
          :model="addCommodityForm"
          :rules="addCommodityFormRules"
          ref="addCommodityFormRef"
          label-width="100px"
        >
          <el-form-item label="商品名称" prop="commodityName">
            <el-input v-model="addCommodityForm.commodityName"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="addCommodityForm.price"></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input v-model="addCommodityForm.stock"></el-input>
          </el-form-item>
          <el-form-item label="商品描述" prop="description">
            <el-input v-model="addCommodityForm.description"></el-input>
          </el-form-item>
          <el-form-item label="商品图片路径" prop="image">
            <el-input v-model="addCommodityForm.image"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCommodityDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSure">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑商品的对话框 -->
      <el-dialog
        title="编辑商品"
        :visible.sync="editCommodityDialogVisible"
        width="40%"
        @close="editCommodityDialogClosed"
      >
        <el-form
          status-icon
          :model="editForm"
          :rules="addCommodityFormRules"
          ref="editCommodityFormRef"
          label-width="100px"
        >
          <el-form-item label="商品名称" prop="commodityName">
            <el-input v-model="editForm.commodityName"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="editForm.price"></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input v-model="editForm.stock"></el-input>
          </el-form-item>
          <el-form-item label="商品描述" prop="description">
            <el-input v-model="editForm.description"></el-input>
          </el-form-item>
          <el-form-item label="商品图片路径" prop="image">
            <el-input v-model="editForm.image"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCommodityDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSure">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 设为秒杀商品的对话框 -->
      <el-dialog
        title="设置秒杀商品"
        :visible.sync="setAsSecDialogVisible"
        width="40%"
        @close="setAsSecDialogClosed"
      >
        <el-form
          status-icon
          :model="setAsSecForm"
          :rules="setAsSecFormRules"
          ref="setAsSecFormRef"
          label-width="140px"
        >
          <el-form-item label="秒杀商品名称" prop="name">
            <el-input v-model="setAsSecForm.name"></el-input>
          </el-form-item>
          <el-form-item label="秒杀商品原价" prop="c_price">
            <el-input v-model="setAsSecForm.c_price"></el-input>
          </el-form-item>
          <el-form-item label="秒杀商品现价" prop="sk_price">
            <el-input v-model="setAsSecForm.sk_price"></el-input>
          </el-form-item>
          <el-form-item label="秒杀商品库存数量" prop="sk_stock">
            <el-input v-model="setAsSecForm.sk_stock"></el-input>
          </el-form-item>
          <el-form-item label="秒杀开始时间" prop="startTime">
            <el-date-picker v-model="setAsSecForm.startTime" type="datetime" placeholder="选择秒杀开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="秒杀结束时间" prop="endTime">
            <el-date-picker v-model="setAsSecForm.endTime" type="datetime" placeholder="选择秒杀结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="秒杀商品描述" prop="description">
            <el-input v-model="setAsSecForm.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setAsSecDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="setSure">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改秒杀商品的对话框 -->
      <el-dialog
        title="修改秒杀商品"
        :visible.sync="editSecDialogVisible"
        width="40%"
        @close="editSecDialogClosed"
      >
        <el-form
          status-icon
          :model="editSecForm"
          :rules="setAsSecFormRules"
          ref="editSecFormRef"
          label-width="140px"
        >
          <el-form-item label="秒杀商品名称" prop="name">
            <el-input v-model="editSecForm.name"></el-input>
          </el-form-item>
          <el-form-item label="秒杀商品原价" prop="c_price">
            <el-input v-model="editSecForm.c_price"></el-input>
          </el-form-item>
          <el-form-item label="秒杀商品现价" prop="sk_price">
            <el-input v-model="editSecForm.sk_price"></el-input>
          </el-form-item>
          <el-form-item label="秒杀商品库存数量" prop="sk_stock">
            <el-input v-model="editSecForm.sk_stock"></el-input>
          </el-form-item>
          <el-form-item label="秒杀开始时间" prop="startTime">
            <el-date-picker v-model="editSecForm.startTime" type="datetime" placeholder="选择秒杀开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="秒杀结束时间" prop="endTime">
            <el-date-picker v-model="editSecForm.endTime" type="datetime" placeholder="选择秒杀结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="秒杀商品描述" prop="description">
            <el-input v-model="editSecForm.description"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setAsSecDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editSecSure">确 定</el-button>
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
      //获取用户列表的参数对象
      queryInfo: {
        commodityName: "",
        sec: false,
        pageNo: 1,
        pageSize: 5
      },
      total: 0,
      commodityList: [],
      addCommodityDialogVisible: false,
      addCommodityForm: {
        commodityName: "",
        price: "",
        stock: "",
        description: "",
        image: ""
      },
      addCommodityFormRules: {
        commodityName: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur"
          }
        ],
        stock: [
          {
            required: true,
            message: "请输入商品库存",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "请输入商品描述",
            trigger: "blur"
          }
        ]
      },
      editCommodityDialogVisible: false,
      editForm: {},
      multipleSelection: [],
      ids: "",
      setAsSecDialogVisible: false,
      setAsSecForm: {
        name: "",
        c_price: "",
        sk_price: "",
        sk_stock: "",
        startTime: "",
        endTime: "",
        description: "",
        id: "",
        image: ""
      },
      setAsSecFormRules: {
        name: [
          {
            required: true,
            message: "请输入秒杀商品名称",
            trigger: "blur"
          }
        ],
        c_price: [
          {
            required: true,
            message: "请输入秒杀商品原价",
            trigger: "blur"
          }
        ],
        sk_price: [
          {
            required: true,
            message: "请输入秒杀商品现价",
            trigger: "blur"
          }
        ],
        sk_stock: [
          {
            required: true,
            message: "请输入秒杀商品库存数量",
            trigger: "blur"
          }
        ],
        startTime: [
          {
            required: true,
            message: "请输入秒杀开始时间",
            trigger: "blur"
          }
        ],
        endTime: [
          {
            required: true,
            message: "请输入秒杀结束时间",
            trigger: "blur"
          }
        ]
      },
      editSecForm: {},
      editSecDialogVisible: false
    };
  },
  created() {
    this.getCommodityList();
  },
  methods: {
    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      this.getCommodityList();
    },

    handleCurrentChange(val) {
      this.queryInfo.pageNo = val;
      this.getCommodityList();
    },

    async getCommodityList() {
      const { data: res } = await this.$http.post(
        "/api/commodity/list",
        this.queryInfo
      );
      if (res.code !== "200") {
        return this.$message.error("获取商品列表失败！");
      }
      this.total = 6;
      this.commodityList = res.data;
    },
    showAddDialog() {
      this.addCommodityDialogVisible = true;
    },
    addCommodityDialogClosed() {
      this.$refs.addCommodityFormRef.resetFields();
    },
    addSure() {
      this.$refs.addCommodityFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/api/commodity/add",
          this.addCommodityForm
        );
        if (res.code !== "200") {
          return this.$message.error("添加商品失败！");
        }
        this.$message.success("添加商品成功！");
        this.addCommodityDialogVisible = false;
        this.getCommodityList();
      });
    },
    showEditCommodityDialog(row) {
      this.editForm = row;
      this.editCommodityDialogVisible = true;
    },
    editCommodityDialogClosed() {
      this.$refs.editCommodityFormRef.resetFields();
    },
    editSure() {
      this.$refs.editCommodityFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/api/commodity/update",
          this.editForm
        );
        if (res.code !== "200") {
          return this.$message.error("修改商品信息失败！");
        }

        this.editCommodityDialogVisible = false;
        //重新获取用户列表
        this.getCommodityList();
        this.$message.success("修改商品信息成功！");
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
    async deleteCommodity() {
      const confirmResult = await this.$confirm(
        "此操作将永久删除所选商品，是否继续?",
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
        "/api/commodity/delete",
        qs.stringify({ ids: this.ids }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      if (res.code !== "200") {
        return this.$message.error("删除商品失败");
      }
      this.$message.success("删除成功!");
      this.getCommodityList();
    },
    async setAsSec(row) {
      this.setAsSecForm.id = row.id;
      this.setAsSecForm.image = row.image;
      this.setAsSecDialogVisible = true;
    },
    setAsSecDialogClosed() {
      this.$refs.setAsSecFormRef.resetFields();
    },
    setSure() {
      // this.setAsSecForm.startTime =
      //   this.setAsSecForm.startTime + 3600 * 1000 * 8 + 1;
      // this.setAsSecForm.endTime =
      //   this.setAsSecForm.endTime + 3600 * 1000 * 8 + 1;
      this.$refs.setAsSecFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/api/commodity/addSK",
          this.setAsSecForm
        );
        if (res.code !== "200") {
          this.$message.error("设置秒杀商品失败！");
        }
        this.$message.success("设置成功！");
        this.getCommodityList();
      });
    },
    async underCarriage(id) {
      const confirmResult = await this.$confirm(
        "此操作将下架所选秒杀商品，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消下架");
      }
      const { data: res } = await this.$http.post(
        "/api/commodity/deleteSK",
        qs.stringify({ id: id }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      if (res.code !== "200") {
        return this.$message.error("下架秒杀商品失败");
      }
      this.$message.success("下架成功!");
      this.getCommodityList();
    },
    async modifyCommodity(id) {
      const { data: res } = await this.$http.post(
        "/api/commodity/findByCId",
        qs.stringify({ cId: id }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      if (res.code !== "200") {
        this.$message.error("查询秒杀商品失败！");
      }
      this.editSecForm = res.data;
      this.editSecDialogVisible = true;
    },
    editSecDialogClosed() {
      this.$refs.editSecFormRef.resetFields();
    },
    editSecSure() {
      this.$refs.editSecFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "/api/commodity/updateSK",
          this.editSecForm
        );
        if (res.code !== "200") {
          this.$message.error("修改秒杀商品失败！");
        }
        this.$message.success("修改成功！");
        this.getCommodityList();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-input {
  margin-top: 10px;
}
.el-select {
  margin-top: 10px;
}
.spanText {
  background-color: #f5f7fa;
  color: #909399;
  vertical-align: middle;
  display: table-cell;
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
  height: 38px;
  font-size: 14px;
  white-space: nowrap;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 325.34px;
}
</style>

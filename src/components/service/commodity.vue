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
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getCommodityList"
          >
            <template slot="prepend">商品名称</template>
            <el-button slot="append" icon="el-icon-search" @click="getCommodityList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option label="否" value="0"></el-option>
            <el-option label="是" value="1"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-table :data="commodityList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="ID" width="100px"></el-table-column>
        <el-table-column prop="commodityName" label="商品名称" width="120px"></el-table-column>
        <el-table-column prop="price" label="价格" width="100px"></el-table-column>
        <el-table-column prop="stock" label="库存" width="100px"></el-table-column>
        <el-table-column prop="description" label="商品描述"></el-table-column>
        <el-table-column label="是否为秒杀商品">
          <template slot-scope="scope">{{scope.row.isSec}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },

      commodityList: [],
      selectValue: "0"
    };
  },
  created() {
    this.getCommodityList();
  },
  methods: {
    showAddDialog() {},
    deleteCommodity() {},

    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getGoodsList();
    },

    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getGoodsList();
    },

    async getCommodityList() {
      const { data: res } = await this.$http.post("/api/commodity/list", {
        params: this.queryInfo
      });
      // if (res.meta.status !== 200) {
      //   return this.$message.error("获取商品列表失败！");
      // }
      this.commodityList = res.data;
    },
    showEditDialog() {},
    deleteGoods() {}
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
</style>
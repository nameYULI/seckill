<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>业务模块</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="15">
        <el-col :span="9">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getOrderList">
            <template slot="prepend">订单编号</template>
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="订单编号"></el-table-column>
        <el-table-column prop="userId" label="用户编号"></el-table-column>
        <el-table-column prop="commodityId" label="商品名称"></el-table-column>
        <el-table-column prop="totalPrice" label="订单总价"></el-table-column>
        <el-table-column prop="createTime" label="下单日期"></el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="queryInfo.pageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pageNo: 1,
        pageSize: 5
      },
      orderList: [],
      total: 0
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.post("/api/order/list", {
        params: this.queryInfo
      });
      if (res.code !== "200") {
        return this.$message.error("获取订单列表失败");
      }
      this.orderList = res.data;
    },
    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val;
      this.getOrderList();
    }
  }
};
</script>

<style lang="less" scoped>
</style>
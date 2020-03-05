<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>日志模块</el-breadcrumb-item>
      <el-breadcrumb-item>管理员监控日志</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="15">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.operatorName"
            clearable
            @clear="getAdminLogList"
          >
            <template slot="prepend">操作人员名称</template>
          </el-input>
        </el-col>
        <el-col :span="5" style="width:78px;">
          <div class="spanText">时间范围</div>
        </el-col>
        <el-col :span="9" style="width:365px;">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="dateValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
          ></el-date-picker>
          <!-- <template slot="prepend">时间范围</template> -->
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="getAdminLogList"></el-button>
        </el-col>
      </el-row>

      <el-table :data="adminLogList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="id" label="日志id" width="250px"></el-table-column>
        <el-table-column prop="operatorName" label="操作人员名称" width="120px"></el-table-column>
        <el-table-column prop="typeInfo" label="日志类型"></el-table-column>
        <el-table-column prop="requestIp" label="请求ip"></el-table-column>
        <el-table-column prop="createTime" label="创建日期"></el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNo"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
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
        operatorName: "",
        pageNo: 1,
        pageSize: 5,
        startTime: "",
        endTime: ""
      },
      dateValue: [],
      total: 0,
      adminLogList: []
    };
  },
  created() {
    this.getAdminLogList();
  },
  computed: {},
  methods: {
    async getAdminLogList() {
      this.queryInfo.startTime = this.dateValue[0];
      this.queryInfo.endTime = this.dateValue[1];

      const { data: res } = await this.$http.post(
        "/api/log/list",
        this.queryInfo
      );
      if (res.code !== "200") {
        return this.$message.error("获取日志列表失败");
      }
      this.total = res.data.total;
      this.adminLogList = res.data.list;
    },
    dateChange(value) {
      if (value == null) {
        this.dateValue = "";
        this.getAdminLogList();
      }
    },
    handleSizeChange(val) {
      this.queryInfo.pageSize = val;
      this.getAdminLogList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pageNo = val;
      this.getAdminLogList();
    }
  }
};
</script>

<style lang="less" scoped>
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
</style>
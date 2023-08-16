<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 1000px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getCross } from "../../api";
export default {
  name: "Report",
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  mounted() {
    // 初始化
    var myChart = echarts.init(document.getElementById("main"));

    getCross().then(({ data }) => {
      if (data.meta.status !== 200) {
        return this.$message.error("获取折线图失败");
      }
      // 展示数据
      const result = { ...this.options, ...data.data };
      myChart.setOption(result);
    });
  },
};
</script>

<style>
</style>
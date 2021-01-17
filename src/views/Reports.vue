<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 600px; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>
// npm i v-echarts
import echarts from "echarts";
import _ from "lodash";

export default {
  created() {},
  async mounted() {
    const myChart = echarts.init(document.getElementById("main"));
    const { data } = await this.$http.get("reports/type/1");
    if (data.meta.status == 200) {
      myChart.setOption(_.merge(data.data, this.options));
    } else {
      this.$message.error("获取报表数据失败");
    }
  },
  data() {
    return {
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
  methods: {},
};
</script>

<style lang="less" scoped>
</style>
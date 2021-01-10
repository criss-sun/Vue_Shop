<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="rightList" border style="width: 100%" row-key="id">
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="!scope.row.pid">一级</el-tag>
            <el-tag v-else-if="scope.row.pid.length == 7" type="warning">三级</el-tag>
            <el-tag v-else type="success">二级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightList();
  },
  data() {
    return {
      rightList: [],
    };
  },
  methods: {
    async getRightList() {
      const { data } = await this.$http.get("/rights/tree");
      if (data.meta.status == 200) {
        this.rightList = data.data;
        this.$message.success("获取权限列表成功");
        console.log(data);
      } else {
        this.$message.error("获取权限列表失败");
      }
    },
  },
};
</script>

<style scoped>
</style>
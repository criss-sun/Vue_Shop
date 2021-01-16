<template>
  <div class="goods-list">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-input placeholder="请输入搜索内容" v-model.trim.lazy="query" clearable @clear="getGoodsList">
        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
      </el-input>
      <el-button type="primary" class="add-good-btn" @click="addGood">添加商品</el-button>
      <el-table border :data="goodList">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column label="商品名称" prop="goods_name">
        </el-table-column>
        <el-table-column label="商品价格(元)" width="120" prop="goods_price">
        </el-table-column>
        <el-table-column label="商品重量" width="120" prop="goods_weight">
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template v-slot="scope">
            {{scope.row.add_time | format('yyyy-MM-dd hh:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="getEditGoodId(scope.row.goods_id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteGoodId(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="updatePagesize" @current-change="updatePagenum" :current-page="paginationInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="paginationInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsList();
  },
  data() {
    return {
      query: "",
      goodList: [],
      paginationInfo: {
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
    };
  },
  methods: {
    async getGoodsList() {
      const { data } = await this.$http.get("goods", {
        params: {
          query: this.query,
          pagenum: this.paginationInfo.pagenum,
          pagesize: this.paginationInfo.pagesize,
        },
      });
      if (data.meta.status == 200) {
        this.total = data.data.total;
        this.goodList = data.data.goods;
      }
    },
    // 分页
    updatePagesize(newPagesize) {
      this.paginationInfo.pagesize = newPagesize;
      this.getGoodsList();
    },
    updatePagenum(newPagenum) {
      this.paginationInfo.pagenum = newPagenum;
      this.getGoodsList();
    },
    addGood() {
      this.$router.push("/home/goods/add");
    },
    getEditGoodId() {},
    deleteGoodId(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(
          async function () {
            const { data } = await this.$http.delete(`goods/${id}`);
            if (data.meta.status == 200) {
              this.$message.success("删除成功");
              this.getGoodsList()
            } else {
              this.$message.error("删除失败");
            }
          }.bind(this)
        )
        .catch(
          function () {
            this.$message.info("已取消删除");
          }.bind(this)
        );
    },
  },
  filters: {
    format(val, fmt) {
      let date = new Date(val);
      var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    },
  },
};
</script>

<style lang="less" scoped>
.goods-list {
  min-width: 1500px;
  .el-card {
    .el-input {
      width: 350px;

      .el-button {
        width: 70px;
      }
    }

    .add-good-btn {
      margin-left: 26px;
    }

    .el-table {
      margin: 20px 0;
    }
  }
}
</style>
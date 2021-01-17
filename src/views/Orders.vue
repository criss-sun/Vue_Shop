<template>
  <div class="order-list">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-input placeholder="请输入搜索内容" v-model.trim.lazy="paginationInfo.query" clearable @clear="getOrderList">
        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
      </el-input>
      <el-table border :data="orderList">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" width="140" prop="order_price">
        </el-table-column>
        <el-table-column label="是否付款" width="140">
          <template v-slot="scope">
            <el-tag v-if="scope.row.pay_status !=='0'">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="140" prop="is_send">
        </el-table-column>
        <el-table-column label="下单时间" width="180">
          <template v-slot="scope">
            {{scope.row.create_time | format('yyyy-MM-dd hh:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editAddress(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-location"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="updatePagesize" @current-change="updatePagenum" :current-page="paginationInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="paginationInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="修改地址" :visible.sync="editAddressDialogVisible" width="50%">
      <el-form :model="editAddressForm" :rules="editAddressRules" ref="editAddressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="city">
          <el-cascader v-model="editAddressForm.city" :options="cityData" :props="{ expandTrigger: 'hover' }" @change="newCity" style="width: 100%"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="editAddressForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddressDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "../assets/js/citydata";
export default {
  created() {
    this.getOrderList();
  },
  data() {
    return {
      orderList: [],
      paginationInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      editAddressDialogVisible: false,
      cityData: cityData,
      editAddressForm: {
        city: [],
        address: "",
      },
      editAddressRules: {
        city: [{ required: true, message: "请输入参数名称", trigger: "blur" }],
        address: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getOrderList() {
      const { data } = await this.$http.get("orders", {
        params: this.paginationInfo,
      });
      if (data.meta.status == 200) {
        this.orderList = data.data.goods;
        this.total = data.data.total;
      } else {
        this.$message.error("获取订单列表失败");
      }
    },
    // 分页
    updatePagesize(newPagesize) {
      this.paginationInfo.pagesize = newPagesize;
      this.getOrderList();
    },
    updatePagenum(newPagenum) {
      this.paginationInfo.pagenum = newPagenum;
      this.getOrderList();
    },
    editAddress(row) {
      this.editAddressDialogVisible = true;
    },
    newCity() {
      console.log(this.editAddressForm.city);
    }
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
.order-list {
  min-width: 1500px;
  .el-card {
    .el-input {
      width: 350px;

      .el-button {
        width: 70px;
      }
    }
    .el-table {
      margin: 20px 0;
    }
  }
}
</style>
<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary">添加角色</el-button>
      <el-table :data="roleList" border style="width: 100%">
        <el-table-column type="expand" width="50">
          <template v-slot="scope">
            <!-- 第一个row -->
            <el-row v-for="(item1, index1) in scope.row.children" :key="item1.id" :class="[{ bt: !index1 }, 'bb', 'col-center']">
              <!-- 第一个col -->
              <el-col :span="5">
                <el-tag closable @close="tagClose(scope.row.id, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第二个col -->
              <el-col :span="19">
                <!-- 第二个row -->
                <el-row v-for="(item2, index2) in item1.children" :key="item2.id" :class="{ bt: index2 !== 0 }" class="col-center">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="tagClose(scope.row.id, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="tagClose(scope.row.id, item3.id)">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
                <!-- 第二个col结束 -->
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="distributionRight(scope.row.id)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="distributionRightDialogVisible" width="50%">
      <el-tree :data="rightList" :props="rightProps" show-checkbox node-key="id" :default-checked-keys="defaultCheckedId" ref="rightTree"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributionRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList();
  },
  data() {
    return {
      roleList: [],
      rightList: [],
      defaultCheckedId: [],
      rightProps: {
        children: "children",
        label: "authName",
      },
      roleId: 0,
      distributionRightDialogVisible: false,
      // i:0
    };
  },
  methods: {
    async getRoleList() {
      const { data } = await this.$http.get("roles");
      if (data.meta.status == 200) {
        this.roleList = data.data;
      }
    },
    tagClose(roleId, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(
          async function () {
            const { data } = await this.$http.delete(
              `roles/${roleId}/rights/${rightId}`
            );
            if (data.meta.status == 200) {
              this.roleList.some(
                function (item) {
                  if (roleId == item.id) {
                    item.children = data.data;
                    return true;
                  }
                }.bind(this)
              );
              this.$message.success("删除成功");
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
    async distributionRight(id) {
      this.roleId = id;
      this.defaultCheckedId = [];
      this.roleList.some(
        function (item) {
          if (item.id == id) {
            this.getLevel3Right(item.children);
            return true;
          }
        }.bind(this)
      );
      const { data } = await this.$http.get("/rights/tree");
      this.rightList = data.data;
      this.distributionRightDialogVisible = true;
    },
    getLevel3Right(list) {
      // this.i++
      // 递归调用了14次函数
      // console.log(this.i);
      list.forEach(
        function (item) {
          if (item.children) {
            this.getLevel3Right(item.children);
          } else {
            this.defaultCheckedId.push(item.id);
          }
        }.bind(this)
      );
    },
    async updateRight() {
      this.distributionRightDialogVisible = false;
      const getCheckedKeys = this.$refs.rightTree.getCheckedKeys();
      const getHalfCheckedKeys = this.$refs.rightTree.getHalfCheckedKeys();
      const keys = [...getCheckedKeys, ...getHalfCheckedKeys].join(",");
      const { data } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: keys,
      });
      if (data.meta.status == 200) {
        this.$message.success("更新权限成功");
        this.getRoleList();
      } else {
        this.$message.error("更新权限失败");
      }
    },
  },
};
</script>

<style scoped>
.el-button {
  margin-bottom: 20px;
}

.col-center {
  display: flex;
  align-items: center;
}

.el-tag {
  margin: 7px;
}

.bb {
  border-bottom: 1px solid #eeeeee;
}

.bt {
  border-top: 1px solid #eeeeee;
}
.roles {
  min-width: 1030px;
}
</style>
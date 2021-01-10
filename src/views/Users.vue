<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="user-card">
      <el-input placeholder="请输入搜索内容" v-model.trim.lazy="query" clearable @clear="getUserList">
        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
      </el-input>
      <el-button type="primary" class="add-user-btn" @click="addUserDialogFormVisible = true">添加用户</el-button>
      <el-table border :data="userList">
        <el-table-column type="index" label="#" width="57">
        </el-table-column>
        <el-table-column label="姓名" width="255" prop="username">
        </el-table-column>
        <el-table-column label="邮箱" width="255" prop="email">
        </el-table-column>
        <el-table-column label="电话" width="255" prop="mobile">
        </el-table-column>
        <el-table-column label="角色" width="255" prop="role_name">
        </el-table-column>
        <el-table-column label="状态" width="255">
          <template v-slot="scope">
            <el-switch active-color="#13ce66" inactive-color="#ff4949" v-model="scope.row.mg_state" @change="switchChange(scope.row.id, scope.row.mg_state)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="255">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="getEditUserId(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="getDeleteUserId(scope.row.id)"></el-button>
            <el-button type="warning" icon="el-icon-setting" @click="getdistributionUserId(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[1, 2, 3, 4, 5]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户dialog -->
    <el-dialog title="添加用户" :visible.sync="addUserDialogFormVisible">
      <el-form :model="addUserDialogForm" :rules="addUserDialogFormRules" ref="addUserDialogFormRef">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="addUserDialogForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="addUserDialogForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="addUserDialogForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="100px" prop="mobile">
          <el-input v-model="addUserDialogForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户dialog -->
    <el-dialog title="修改用户" :visible.sync="editUserDialogFormVisible">
      <el-form :model="editUserDialogForm" :rules="editUserDialogFormRules" ref="editUserDialogFormRef">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="editUserDialogForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="editUserDialogForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="100px" prop="mobile">
          <el-input v-model="editUserDialogForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogFormCancel">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分配角色" :visible.sync="distributionRoleDialogVisible" width="50%">
      <div>
        <p>当前的用户:{{username}}</p>
        <p>当前的角色:{{roleName}}</p>
        <el-select v-model="rid" clearable placeholder="可分配的角色">
          <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributionRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="distributionRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList();
    this.getRoleList();
  },
  data() {
    return {
      userList: [],
      // 查询参数
      query: "",
      // 第几页
      pagenum: 1,
      // 每页显示几条数据
      pagesize: 5,
      // 总数据条数
      total: 0,
      // 添加用户代码
      addUserDialogFormVisible: false,
      addUserDialogForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addUserDialogFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          {
            required: false,
            type: "email",
            message: "请输入正确的邮箱格式",
            trigger: "blur",
          },
          {
            min: 8,
            max: 20,
            message: "长度在 8 到 20 个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度在 11 个字符", trigger: "blur" },
        ],
      },
      // 编辑用户代码
      editUserDialogFormVisible: false,
      editUserDialogForm: {
        username: "",
        email: "",
        mobile: "",
      },
      editUserDialogFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: false,
            type: "email",
            message: "请输入正确的邮箱格式",
            trigger: "blur",
          },
          {
            min: 8,
            max: 20,
            message: "长度在 8 到 20 个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: false, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度在 11 个字符", trigger: "blur" },
        ],
      },
      editUserId: 0,
      distributionRoleDialogVisible: false,
      // 分配角色代码
      username: "",
      roleName: "",
      roleList: [],
      rid: "",
      userId: 0,
    };
  },
  methods: {
    async getUserList() {
      const { data } = await this.$http.get("/users", {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize,
        },
      });
      if (data.meta.status == 200) {
        this.userList = data.data.users;
        this.total = data.data.total;
        this.$message.success("获取用户列表成功");
      } else {
        this.$message.error("获取用户列表失败");
      }
    },
    handleSizeChange(pagesize) {
      this.pagesize = pagesize;
      this.getUserList();
    },
    handleCurrentChange(pagenum) {
      this.pagenum = pagenum;
      this.getUserList();
    },
    async switchChange(id, mg_state) {
      const { data } = await this.$http.put(`users/${id}/state/${mg_state}`);
      if (data.meta.status == 200) {
        if (mg_state) {
          this.$message.success("用户状态已打开");
        } else {
          this.$message.warning("用户状态已关闭");
        }
      } else {
        this.$message.error("用户状态修改失败");
      }
    },
    // 添加用户代码
    addUser() {
      this.$refs.addUserDialogFormRef.validate(
        async function (valid) {
          if (valid) {
            const { data } = await this.$http.post(
              "/users",
              this.addUserDialogForm
            );
            if (data.meta.status == 201) {
              this.getUserList();
              this.$message.success("添加用户成功");
              this.$refs.addUserDialogFormRef.resetFields();
              this.addUserDialogFormVisible = false;
            } else {
              this.$message.error("添加用户失败");
            }
          }
        }.bind(this)
      );
    },
    addUserDialogFormCancel() {
      this.$refs.addUserDialogFormRef.resetFields();
      this.addUserDialogFormVisible = false;
    },
    // 编辑用户代码
    editUserDialogFormCancel() {
      this.$refs.editUserDialogFormRef.resetFields();
      this.editUserDialogFormVisible = false;
    },
    editUser() {
      this.$refs.editUserDialogFormRef.validate(
        async function (valid) {
          if (valid) {
            const { data } = await this.$http.put(
              `/users/${this.editUserId}`,
              this.editUserDialogForm
            );
            if (data.meta.status == 200) {
              this.getUserList();
              this.$message.success("修改用户成功");
              this.$refs.editUserDialogFormRef.resetFields();
              this.editUserDialogFormVisible = false;
            } else {
              this.$message.error("修改用户失败");
            }
          }
        }.bind(this)
      );
    },
    getEditUserId(id) {
      this.editUserId = id;
      this.editUserDialogFormVisible = true;
    },
    // 删除用户代码
    getDeleteUserId(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(
          async function () {
            const { data } = await this.$http.delete(`/users/${id}`);
            if (data.meta.status == 200) {
              this.$message.success("删除成功");
              this.getUserList();
            } else {
              this.$message.error("删除失败");
            }
          }.bind(this)
        )
        .catch(
          function () {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          }.bind(this)
        );
    },
    // 分配角色代码
    async getRoleList() {
      const { data: rolesData } = await this.$http.get("/roles");
      rolesData.data.forEach(
        function (item) {
          this.roleList.push({ id: item.id, roleName: item.roleName });
        }.bind(this)
      );
    },
    async getdistributionUserId(data) {
      this.userId = data.id;
      this.username = data.username;
      this.roleName = data.role_Name;
      this.distributionRoleDialogVisible = true;
    },
    async distributionRole() {
      const { data } = await this.$http.put(`users/${this.userId}/role`, {
        rid: this.rid,
      });
      if (data.meta.status == 200) {
        this.getUserList();
        this.$message.success("分配角色成功");
      } else {
        this.$message.error("分配角色失败");
      }
      this.distributionRoleDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.user-card {
  .el-input {
    width: 350px;
    .el-button {
      width: 70px;
    }
  }
  .add-user-btn {
    margin-left: 26px;
  }

  .el-table {
    margin: 20px 0;
  }
}
</style>
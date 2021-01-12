<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-button type="primary" class="add_cate_btn" @click="addCategoryDialogVisible = true">添加分类</el-button>
      <el-table :data="category_list" style="width: 100%; margin-bottom: 20px;" row-key="cat_id" border :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="400">
        </el-table-column>
        <el-table-column label="是否有效" width="400">
          <template v-slot="scope">
            <i v-if="!scope.row.cat_deleted" class="el-icon-circle-check" style="color: lightgreen"></i>
            <i v-else class="el-icon-circle-close" style="color: red"></i>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template v-slot="scope">
            <el-tag v-if="!scope.row.cat_level">一级</el-tag>
            <el-tag v-else-if="scope.row.cat_level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" @click="getEditCategotyParams(scope.row.cat_id, scope.row.cat_name)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteCategoty(scope.row.cat_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="updatePagesize" @current-change="updatePagenum" :current-page="paginationInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="paginationInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="addCategoryDialogVisible" width="50%">
      <el-form :model="addCategoryForm" :rules="addCategoryFormRules" ref="addCategoryFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="分类层级">
          <el-cascader :options="AllCategories" v-model="category_seleted" :props="{label: 'cat_name', value: 'cat_id', children: 'children', checkStrictly: true, expandTrigger: 'hover'}" @change="categoryCascaderChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改分类" :visible.sync="editCategoryDialogVisible" width="50%">
      <el-form :model="editCategoryForm" :rules="editCategoryFormRules" ref="editCategoryFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCategoryForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategoty">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCategories();
    this.getAllCategories();
  },
  data() {
    return {
      // 渲染数据&分页
      category_list: [],
      paginationInfo: {
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      // 添加分类
      addCategoryDialogVisible: false,
      addCategoryForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addCategoryFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      AllCategories: [],
      category_seleted: [],
      // 编辑分类
      editCategoryDialogVisible: false,
      editCategoryForm: {
        cat_id: 0,
        cat_name: "",
      },
      editCategoryFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getCategories() {
      const { data } = await this.$http.get("categories", {
        params: this.paginationInfo,
      });
      if (data.meta.status == 200) {
        this.category_list = data.data.result;
        this.total = data.data.total;
        this.$message.success("获取商品分类列表成功");
      } else {
        this.$message.error("获取商品分类列表失败");
      }
    },
    updatePagesize(pagesize) {
      this.paginationInfo.pagesize = pagesize;
      this.getCategories();
    },
    updatePagenum(pagenum) {
      this.paginationInfo.pagenum = pagenum;
      this.getCategories();
    },
    // 添加分类
    async getAllCategories() {
      const { data } = await this.$http.get("categories");
      if (data.meta.status == 200) {
        this.AllCategories = data.data;
      } else {
        this.$message.error("获取商品分类列表失败");
      }
    },
    addCategory() {
      this.$refs.addCategoryFormRef.validate(
        async function (valid) {
          if (valid) {
            const { data } = await this.$http.post(
              "categories",
              this.addCategoryForm
            );
            if (data.meta.status == 201) {
              this.$message.success("添加分类成功");
              this.addCategoryDialogVisible = false;
              this.getCategories();
            } else {
              this.$message.error("添加分类失败");
            }
          }
        }.bind(this)
      );
    },
    categoryCascaderChange() {
      if (this.category_seleted.length > 0) {
        this.addCategoryForm.cat_level = this.category_seleted.length;
        this.addCategoryForm.cat_pid = this.category_seleted[
          this.category_seleted.length - 1
        ];
      } else {
        this.addCategoryForm.cat_level = 0;
        this.addCategoryForm.cat_pid = 0;
      }
    },
    deleteCategoty(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(
          async function () {
            const { data } = await this.$http.delete(`categories/${id}`);
            if (data.meta.status == 200) {
              this.getCategories();
              this.getAllCategories();
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
    getEditCategotyParams(cat_id, cat_name) {
      this.editCategoryForm.cat_id = cat_id;
      this.editCategoryForm.cat_name = cat_name;
      this.editCategoryDialogVisible = true;
    },
    editCategoty() {
      this.$refs.editCategoryFormRef.validate(
        async function (valid) {
          if (valid) {
            const { data } = await this.$http.put(
              `categories/${this.editCategoryForm.cat_id}`,
              {
                cat_name: this.editCategoryForm.cat_name,
              }
            );
            if (data.meta.status == 200) {
              this.getCategories();
              this.$message.success("修改分类成功");
              this.editCategoryDialogVisible = false
            } else {
              this.$message.error("修改分类失败");
            }
          }
        }.bind(this)
      );
    },
  },
};
</script>

<style lang=less scoped>
.add_cate_btn {
  margin-bottom: 20px;
}
</style>
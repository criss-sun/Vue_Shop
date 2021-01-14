<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意 : 只允许为第三级分类设置相关参数 !" type="warning" show-icon>
      </el-alert>
      <div class="select_goods_category">
        <span>选择商品分类: </span>
        <el-cascader :options="categoryList" v-model="category_seleted" :props="{label: 'cat_name', value: 'cat_id', children: 'children', expandTrigger: 'hover', emitPath: false}" @change="getParamList" clearable></el-cascader>
      </div>
      <el-tabs v-model="paramsType" @tab-click="getParamList">
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="!category_seleted" type="primary" class="add_params" @click="addParamsDialogVisible = true">添加参数</el-button>
          <el-table :data="attrValList" border style="width: 100%">
            <el-table-column type="expand" width="60">
              <template v-slot="scope">
                <el-tag v-show="scope.row.attr_vals" v-for="(item, index) in scope.row.attr_vals.split(',')" :key="index" closable class="params_tag" @close="removeTag(scope.row, index)">{{ item }}</el-tag>
                <el-button v-if="newTagVisible" class="button-new-tag" size="small" @click="addManyNewTagFocus">+ New Tag</el-button>
                <el-input v-else v-model.trim.lazy="newTagValue" style="width: 100px;" @blur="addManyNewTag(scope.row)" @keyup.enter.native="addManyNewTag(scope.row)" ref="manyNewTagRef"></el-input>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="60">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" @click="getEditParamID(scope.row.cat_id, scope.row.attr_id, scope.row.attr_name)">修改</el-button>
                <el-button type="danger" @click="removeParam(scope.row.cat_id, scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="!category_seleted" type="primary" class="add_params" @click="addParamsDialogVisible = true">添加属性</el-button>
          <el-table :data="attrValList" border style="width: 100%">
            <el-table-column type="expand" width="60">
              <template v-slot="scope">
                <el-tag v-show="scope.row.attr_vals" v-for="(item, index) in scope.row.attr_vals.split(',')" :key="index" closable class="params_tag" @close="removeTag(scope.row, index)">{{ item }}</el-tag>
                <el-button v-if="newTagVisible" class="button-new-tag" size="small" @click="addManyNewTagFocus">+ New Tag</el-button>
                <el-input v-else v-model.trim.lazy="newTagValue" style="width: 100px;" @blur="addManyNewTag(scope.row)" @keyup.enter.native="addManyNewTag(scope.row)" ref="manyNewTagRef"></el-input>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="60">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary" @click="editParamsDialogVisible = true">修改</el-button>
                <el-button type="danger" @click="removeParam(scope.row.cat_id,scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog :title="paramsType=='many' ? '添加参数':'添加属性'" :visible.sync="addParamsDialogVisible" width="50%">
      <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="paramsType=='many' ? '动态参数':'静态属性'" prop="params">
          <el-input v-model="addParamsForm.params"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="paramsType=='many' ? '修改参数':'修改属性'" :visible.sync="editParamsDialogVisible" width="50%">
      <el-form :model="addParamsForm" :rules="addParamsRules" ref="editParamsFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="paramsType=='many' ? '动态参数':'静态属性'" prop="params">
          <el-input v-model="addParamsForm.params"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCategories();
  },
  data() {
    return {
      categoryList: [],
      category_seleted: "",
      paramsType: "many",
      attrValList: [],
      newTagVisible: true,
      newTagValue: "",
      // 添加参数
      addParamsDialogVisible: false,
      addParamsForm: {
        params: "",
      },
      addParamsRules: {
        params: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 编辑参数
      editParamsDialogVisible: false,
      editParamInfo: {
        cat_id: 0,
        attr_id: 0,
      },
    };
  },
  methods: {
    async getCategories() {
      const { data } = await this.$http.get("categories");
      if (data.meta.status == 200) {
        this.categoryList = data.data;
      } else {
        this.$message.error("获取商品分类列表失败");
      }
    },
    async getParamList() {
      if (!this.category_seleted) {
        this.attrValList = [];
        return;
      }
      const { data } = await this.$http.get(
        `/categories/${this.category_seleted}/attributes`,
        {
          params: {
            sel: this.paramsType,
          },
        }
      );
      if (data.meta.status == 200) {
        this.attrValList = data.data;
      }
    },
    async editOrDeleteNewTag(row) {
      let attr_vals;
      // 如果input输入框有值就是追加, 没有就是删除
      if (this.newTagValue) {
        // 如果row.attr_vals有值就在前面加逗号,没有就不加
        if (row.attr_vals) {
          attr_vals = row.attr_vals + "," + this.newTagValue;
        } else {
          attr_vals = this.newTagValue;
        }
      } else {
        attr_vals = row.attr_vals;
      }
      const { data } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: attr_vals,
        }
      );
      if (data.meta.status == 200) {
        this.$message.success("添加属性值成功");
        this.attrValList.some(
          function (item) {
            if (item.attr_id == data.data.attr_id) {
              item.attr_vals = data.data.attr_vals;
              return true;
            }
          }.bind(this)
        );
        this.newTagValue = "";
      } else {
        this.$message.error("添加属性值失败");
      }
    },
    async addManyNewTag(row) {
      this.newTagVisible = true;
      if (!this.newTagValue) return;
      this.editOrDeleteNewTag(row);
    },
    addManyNewTagFocus() {
      this.newTagVisible = false;
      this.$nextTick(function () {
        this.$refs.manyNewTagRef.$refs.input.focus();
      });
    },
    removeTag(row, i) {
      const attr_vals = row.attr_vals.split(",");
      attr_vals.splice(i, 1);
      row.attr_vals = attr_vals.join(",");
      this.editOrDeleteNewTag(row);
    },
    addParams() {
      this.$refs.addParamsFormRef.validate(
        async function (valid) {
          if (valid) {
            const { data } = await this.$http.post(
              `categories/${this.attrValList[0].cat_id}/attributes`,
              {
                attr_name: this.addParamsForm.params,
                attr_sel: this.paramsType,
                attr_vals: "",
              }
            );
            if (data.meta.status == 201) {
              this.$message.success("添加参数成功");
              this.getParamList();
              this.addParamsDialogVisible = false;
              this.addParamsForm = {};
            } else {
              this.$message.error("添加参数失败");
            }
          }
        }.bind(this)
      );
    },
    removeParam(cat_id, attr_id) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(
          async function () {
            const { data } = await this.$http.delete(
              `categories/${cat_id}/attributes/${attr_id}`
            );
            if (data.meta.status == 200) {
              this.$message.success("删除成功");
              this.getParamList();
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
    getEditParamID(cat_id, attr_id, attr_name) {
      this.addParamsForm.params = attr_name;
      this.editParamInfo.cat_id = cat_id;
      this.editParamInfo.attr_id = attr_id;
      this.editParamsDialogVisible = true;
    },
    editParams() {
      this.$refs.editParamsFormRef.validate(
        async function (valid) {
          if (valid) {
            const { data } = await this.$http.put(
              `categories/${this.editParamInfo.cat_id}/attributes/${this.editParamInfo.attr_id}`,
              {
                attr_name: this.addParamsForm.params,
                attr_sel: this.paramsType,
                attr_vals: "",
              }
            );
            if (data.meta.status == 200) {
              this.$message.success("修改参数成功");
              this.getParamList();
              this.editParamsDialogVisible = false;
              this.addParamsForm = {};
            } else {
              this.$message.error("修改参数失败");
            }
          }
        }.bind(this)
      );
    },
  },
};
</script>

<style lang="less" scoped>
.select_goods_category {
  margin: 20px 0;
}
.add_params {
  margin-bottom: 20px;
}
.params_tag {
  margin: 0 10px 20px 0;
}
</style>
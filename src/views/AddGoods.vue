<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="消息提示的文案" type="info" center show-icon>
      </el-alert>
      <el-steps :active="stepActive" align-center class="add_goods_steps">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="basicInfoForm" :rules="basicInfoFormRules" ref="basicInfoFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="tabName" @tab-click="tabClick" tab-position="left" style="height: 1000px;" :before-leave="toggleTab">
          <el-tab-pane label="基本信息" name="1">

            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="basicInfoForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="basicInfoForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="basicInfoForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="basicInfoForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader :options="categoryList" v-model="basicInfoForm.goods_cat" :props="{label: 'cat_name', value: 'cat_id', children: 'children', expandTrigger: 'hover', emitPath: true}" clearable></el-cascader>
            </el-form-item>

          </el-tab-pane>
          <el-tab-pane label="商品参数" name="2">
            <el-form-item :label="item1.attr_name" v-for="item1 in manyList" :key="item1.attr_id">
              <el-checkbox-group v-model="item1.attr_vals" size="small">
                <el-checkbox v-for="(item2, index2) in item1.attr_vals" :key="index2" :label="item2" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="3">
            <el-form-item :label="item.attr_name" v-for="item in onlyList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="4">
            <el-upload action="http://127.0.0.1:8888/api/private/v1/upload/" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" list-type="picture" :headers="headers" :on-success="upload_success">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="5">
            <quill-editor ref="introduceRef" v-model="basicInfoForm.goods_introduce" />
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="pictureDialogVisible" width="35%">
      <img :src="tmp_path" alt="图片预览" class="picturePreview">
    </el-dialog>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  created() {
    this.getCategories();
  },
  data() {
    return {
      tabName: "1",
      stepActive: 1,
      categoryList: [],
      basicInfoForm: {
        goods_name: "",
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: "",
        pics: [],
        attrs: [],
      },
      basicInfoFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          {
            type: "number",
            message: "请输入数字",
            trigger: "blur",
          },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          {
            type: "number",
            message: "请输入数字",
            trigger: "blur",
          },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          {
            type: "number",
            message: "请输入数字",
            trigger: "blur",
          },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      manyList: [],
      onlyList: [],
      fileList: [],
      headers: { Authorization: sessionStorage.getItem("token") },
      pictureDialogVisible: false,
      tmp_path: "",
    };
  },
  methods: {
    tabClick() {
      this.stepActive = parseInt(this.tabName);
    },
    async getCategories() {
      const { data } = await this.$http.get("categories");
      if (data.meta.status == 200) {
        this.categoryList = data.data;
      } else {
        this.$message.error("获取商品分类列表失败");
      }
    },
    toggleTab(activeName, oldActiveName) {
      if (
        activeName !== "1" &&
        !this.basicInfoForm.goods_cat[this.basicInfoForm.goods_cat.length - 1]
      ) {
        this.$message.error("请先选择商品分类");
        return false;
      } else if (activeName == "2") {
        this.getParams("many");
      } else if (activeName == "3") {
        this.getParams("only");
      }
    },
    async getParams(sel) {
      const { data } = await this.$http.get(
        `categories/${
          this.basicInfoForm.goods_cat[this.basicInfoForm.goods_cat.length - 1]
        }/attributes`,
        {
          params: { sel: sel },
        }
      );

      if (data.meta.status == 200 && sel == "many") {
        this.manyList = data.data;
        this.manyList.forEach(
          function (item) {
            // 如果是空字符串无法用逗号分隔
            item.attr_vals = !item.attr_vals ? [] : item.attr_vals.split(",");
          }.bind(this)
        );
      } else if (data.meta.status == 200 && sel == "only") {
        this.onlyList = data.data;
      } else {
        this.$message.error("获取参数列表失败");
      }
    },
    handleRemove(file, fileList) {
      this.basicInfoForm.pics = [];
      fileList.forEach(
        function (item) {
          this.basicInfoForm.pics.push({ pic: item.response.data.tmp_path });
        }.bind(this)
      );
    },
    handlePreview(file) {
      this.tmp_path = file.response.data.url;
      this.pictureDialogVisible = true;
    },
    upload_success(response, file, fileList) {
      this.basicInfoForm.pics.push({ pic: response.data.tmp_path });
    },
    addGoods() {
      this.$refs.basicInfoFormRef.validate(
        async function (valid) {
          if (!valid) return;
          this.basicInfoForm.goods_cat = this.basicInfoForm.goods_cat.join(",");
          const attrs = [];
          this.manyList.forEach(function (item) {
            attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(","),
            });
          });
          this.onlyList.forEach(function (item) {
            attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            });
          });
          this.basicInfoForm.attrs = attrs;
          const { data } = await this.$http.post(`goods`, this.basicInfoForm);
          if (data.meta.status == 201) {
            this.$message.success("添加商品成功");
            this.$router.push("/home/goods");
          } else {
            this.$message.error("添加商品失败");
          }
        }.bind(this)
      );
    },
  },
  components: {
    quillEditor,
  },
};
</script>

<style lang="less" scoped>
.add_goods_steps {
  margin: 20px 0;
}
.picturePreview {
  width: 100%;
  height: 100%;
}
</style>
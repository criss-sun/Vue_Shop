<template>
  <div class="login_container">
    <div class="login_box">
      <div class="login_avatar">
        <img src="../assets/images/logo.png" alt="logo">
      </div>
      <el-form label-width="0" class="login_form" :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login_btn">
          <el-button type="info" @click="resetForm('loginFormRef')">重置</el-button>
          <el-button type="primary" @click="submitForm('loginFormRef')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 10,
            message: "长度在 6 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data } = await this.$http.post("login/", this.loginForm);
          if (data.meta.status == 200) {
            sessionStorage.setItem("token", data.data.token);
            this.$message({
              message: "登陆成功",
              type: "success",
            });
            this.$router.push("/home");
          } else {
            this.$message({
              message: "登陆失败",
              type: "error",
            });
          }
        } else {
          this.$message({
            message: "登陆失败",
            type: "error",
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  position: relative;
  height: 100%;
  background: #2b4b6b;

  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 400px;
    background: #fff;
    .login_form {
      padding: 120px 10px 0;
      .login_btn {
        display: flex;
        justify-content: flex-end;
        padding-top: 50px;
      }
    }
  }

  .login_avatar {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    width: 130px;
    height: 130px;
    border: 2px solid #eee;
    padding: 4px;
    background-color: #fff;
    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
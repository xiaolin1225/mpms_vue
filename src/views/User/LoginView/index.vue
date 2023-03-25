<template>
  <div class="login-container">

    <div class="login-box">
      <div class="login-form-container">
        <div class="login-form-header">
          <div class="title">登录</div>
        </div>
        <el-form :model="form" :rules="rules" ref="form" status-icon class="login-form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" show-password placeholder="请输入密码"/>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
            <div class="verify-code">
              <el-input v-model="form.code" placeholder="请输入验证码">
                <template #append>
                  <BaseImage class="verify-code-image"
                             :src="codeUrl"
                             fit="contain"
                             @click.native="updateCode"
                  />
                </template>
              </el-input>
            </div>
          </el-form-item>
        </el-form>
        <div class="login-form-footer">
          <div class="form-extends">
            <div class="remember-me">
              <el-checkbox v-model="remember">记住我</el-checkbox>
            </div>
            <div class="register-now">
              <router-link to="/register">还没有账户？立即注册</router-link>
            </div>
          </div>
          <div class="form-button">
            <el-button class="submit-button" type="primary">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseImage from "@/components/BaseImage/index.vue";
import {isUserExist} from "@/api/user";

export default {
  name: "LoginView",
  components: {BaseImage},
  data() {
    let userRule = async (rule, value, callback) => {
      let res = await isUserExist();
      if (res.data === false)
        callback(new Error("用户不存在"));
      callback();
    }
    return {
      form: {},
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ],
      },
      remember: false,
      codeUrl: "https://jwc.fdzcxy.edu.cn/ValidateCookie.asp"
    }
  },
  methods: {
    updateCode() {
      this.codeUrl = "https://jwc.fdzcxy.edu.cn/ValidateCookie.asp?" + Math.random();
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  //background-color: #212534;
  //background-color: var(--bg-dark-light-primary);
  background: url("~@/assets/images/background.jpg") no-repeat, #cccccc;
  background-size: cover;
  background-blend-mode: multiply;

  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    max-width: 450px;
    padding: 2rem 2rem;
    transform: translate(-50%) translateY(-50%);
    background-color: var(--panel-background-color);
    border-radius: 2rem;
    box-shadow: 0 0 30px 0 var(--bg-dark-primary);

    .login-form-container {

      .login-form-header {
        text-align: center;

        .title {
          color: var(--text-default -color);
          font-size: 2rem;
          font-weight: 600;
          letter-spacing: 2rem;
          text-indent: 2rem;
          margin: var(--margin-y) 0;
        }
      }

      .verify-code {
        position: relative;

        .verify-code-image {
          cursor: pointer;
          width: 100px;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .login-form-footer {
        margin-top: var(--margin-y);

        .form-extends {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;

          .register-now {
            font-size: 14px;

            a {
              color: var(--text-light-color);
            }
          }
        }

        .form-button {
          text-align: center;

          .submit-button {
            width: 60%;
          }
        }
      }

    }
  }


}
</style>
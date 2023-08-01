<template>
  <div class="login-container">
    <div class="login-box">
      <div class="brand-container">
        <div class="brand">
          <BaseImage class="brand-image" :src="brand" fit="contain"/>
        </div>
        <div class="title">{{ webTitle }}</div>
      </div>
      <div class="login-form-container">
        <div class="login-form-header">
          <div class="title">登录</div>
        </div>
        <el-form :model="form" :rules="rules" ref="form" status-icon class="login-form" @keyup.enter.native="userLogin">
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
                             :src="captcha.base64Image"
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
            <el-button class="submit-button" type="primary" @click="userLogin" :loading="loading">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseImage from "@/components/BaseImage/index.vue";
import {isCodeCorrect, isUserExist} from "@/api/user";
import {mapActions, mapState} from "vuex";
import {requestCaptcha} from "@/api/captcha";
import Cookies from "js-cookie";
import md5 from "md5";
import {decrypt, encrypt} from "@/utils/jsencrypt";

export default {
  name: "LoginView",
  components: {BaseImage},
  data() {
    let usernameRule = async (rule, value, callback) => {
      if (value.trim() === "")
        return callback(new Error("请输入用户名"));
      let res = await isUserExist({username: value});
      if (res.data === false)
        callback(new Error("用户不存在"));
      else
        callback();
    };
    let verifyCodeRule = async (rule, value, callback) => {
      if (value.trim() === "")
        return callback(new Error("请输入验证码"));
      let res = await isCodeCorrect({type: this.captcha.type, codeKey: this.captcha.key, code: value});
      if (res.data === false)
        callback(new Error("验证码错误"));
      else
        callback();
    }
    return {
      form: {},
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {validator: usernameRule, trigger: "blur"}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'blur'},
          {validator: verifyCodeRule, trigger: "blur"}
        ],
      },
      remember: false,
      captcha: {
        key: "",
        base64Image: "",
        type: "login",
        timeout: 0,
        updateId: null
      },
      loading: false
    }
  },
  computed: {...mapState("system", ["brand", "webTitle"])},
  methods: {
    updateCode() {
      if (this.captcha.updateId !== null)
        clearTimeout(this.captcha.updateId);
      requestCaptcha({codeKey: this.captcha.key, type: this.captcha.type}).then(res => {
        this.captcha = res.data;
        this.captcha.updateId = setTimeout(() => {
          clearTimeout(this.captcha.updateId);
          this.updateCode();
        }, this.captcha.timeout * 1000);
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const remember = Cookies.get('remember')
      this.form = {
        username: username === undefined ? this.form.username : username,
        password: password === undefined ? this.form.password : decrypt(password),
      };
      this.remember = remember === undefined ? false : Boolean(remember);
    },
    userLogin() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          let data = {...this.form}
          data.codeKey = this.captcha.key;
          data.password = md5(data.password);
          if (this.remember) {
            Cookies.set("username", data.username, {expires: 30});
            Cookies.set("password", encrypt(data.password), {expires: 30});
            Cookies.set('remember', this.remember, {expires: 30});
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.login(data).then(res => {
            this.$message.success("登录成功");
            this.$router.push("/").then(() => this.updateCode());
          }).catch(() => {
            this.updateCode();
          }).finally(() => {
            this.loading = false;
          })
        } else {
          this.updateCode();
          return false;
        }
      });
    },
    ...mapActions("user", ["login"])
  },
  mounted() {
    window.md5 = md5;
    this.updateCode();
    this.getCookie();
  }
}
</script>

<style lang="less" scoped>
.login-container {
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  //background-color: var(--bg-dark-light-primary);
  background: url("~@/assets/images/background.jpg") no-repeat;
  background-size: cover;
  background-blend-mode: multiply;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #00c6fb 0%, #005bea 100%);
    opacity: 30%;
  }

  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%) translateY(-50%);
    z-index: 666;

    .brand-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: var(--margin-y);

      .brand {
        height: 2rem;
        margin-right: var(--margin-x);
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid #ffffff;
        background: #ffffff;

        .brand-image {
          width: 100%;
          height: 100%;
        }
      }

      .title {
        color: var(--text-white);
        font-size: 1.5rem;
        font-weight: 600;
      }
    }

    .login-form-container {
      width: 100%;
      max-width: 400px;
      min-width: 350px;
      background-color: var(--panel-background-color);
      border-radius: 2rem;
      box-shadow: 2px 2px 0 2px var(--bg-dark-primary);
      //border: 5px solid var(--panel-border-primary-color);
      overflow: hidden;

      .login-form-header {
        padding: 2rem;
        text-align: center;
        background-image: linear-gradient(45deg, #00c6fb 0%, #005bea 100%);
        border-radius: 2rem;
        border: 5px solid var(--panel-border-white-color);

        .title {
          margin: 1rem 0;
          color: var(--text-white);
          font-size: 2rem;
          font-weight: 600;
          letter-spacing: 2rem;
          text-indent: 2rem;
        }
      }

      .login-form {
        margin: 2rem 0;
        padding: 0 2rem;

        :deep(.el-form-item) {
          .el-form-item__label {
            color: var(--text-default-color);
          }

          &.is-error {
            .el-input-group__append {
              border-color: #F56C6C !important;
            }
          }
        }

        .verify-code {
          position: relative;

          :deep(.el-input) {


            .el-input__inner {
              &:hover {
                & ~ .el-input-group__append {
                  border-color: #C0C4CC;
                }
              }

              &:focus {
                & ~ .el-input-group__append {
                  border-color: #409EFF;
                  outline: 0
                }
              }
            }

            .el-input-group__append {
              padding: 0;
              overflow: hidden;
              outline: 0;
              transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
            }
          }

          .verify-code-image {
            cursor: pointer;
            width: 114px;
            height: 38px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }

      .login-form-footer {
        padding: 0 2rem;
        margin: var(--margin-y) 0;

        .form-extends {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;

          .remember-me {
            :deep(.el-checkbox) {
              .el-checkbox__label {
                color: var(--text-default-color);
              }
            }
          }

          .register-now {
            font-size: 14px;

            a {
              color: var(--text-default-color);
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
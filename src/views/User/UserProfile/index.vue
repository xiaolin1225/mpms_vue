<template>
  <div class="profile-container">
    <div class="profile-header" :style="`--profile-header-background:url(${backgroundImage});`">
      <div class="user-info-container">
        <div class="user-info">
          <div class="user-avatar-container">
            <BaseImage :src="getUserInfo.avatar" class="user-avatar"/>
          </div>
          <div class="user-detail">
            <div class="nickname">{{ getUserInfo.nickname ? getUserInfo.nickname : getUserInfo.username || "待定" }}
            </div>
            <div class="role">{{ getUserInfo.roles[0].name || "待定" }}</div>
          </div>
        </div>
      </div>
      <img :src="backgroundImage" alt="背景图" class="background-image">
      <div class="menu-list-container">
        <div class="menu-list">
          <div class="menu-item"
               :class="activeMenu===item.id?'active':''"
               v-for="item in menus"
               :key="item.id"
               @click="changeMenu(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div ref="fixedMenu" class="menu-list-container fixed">
      <div class="menu-list">
        <div class="menu-item"
             :class="activeMenu===item.id?'active':''"
             v-for="item in menus"
             :key="item.id"
             @click="changeMenu(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <el-row :gutter="20" class="profile-content mt">
      <el-col :span="6" :xs="24" class="left-wrap">
        <div class="user-info-list card">
          <div class="card-header">
            <div class="card-title">个人信息</div>
          </div>
          <div class="user-info-item">
            <div class="label">用户名</div>
            <div class="value">{{ getUserInfo.username }}</div>
          </div>
          <div class="user-info-item">
            <div class="label">昵称</div>
            <div class="value">{{ getUserInfo.nickname }}</div>
          </div>
          <div class="user-info-item">
            <div class="label">性别</div>
            <div class="value">男</div>
          </div>
          <div class="user-info-item">
            <div class="label">年龄</div>
            <div class="value">18</div>
          </div>
          <div class="user-info-item">
            <div class="label">手机号码</div>
            <div class="value">{{ getUserInfo.phone }}</div>
          </div>
          <div class="user-info-item">
            <div class="label">邮箱</div>
            <div class="value">{{ getUserInfo.email }}</div>
          </div>
          <div class="user-info-item">
            <div class="label">部门</div>
            <div class="value">{{ getUserInfo.department?.name }}</div>
          </div>
          <div class="user-info-item">
            <div class="label">职位</div>
            <div class="value">{{ getUserInfo.position?.name }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" :xs="24" class="center-wrap">
        <div class="card">
          <div class="card-header mb">
            <div class="card-title">{{ centerWrapTitle }}</div>
          </div>
          <div class="profile-form-container">
            <el-form ref="form" :rules="profileRules" :model="tempData" label-width="100px" v-if="activeMenu===1">
              <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="tempData.nickname"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="tempData.phone"></el-input>
              </el-form-item>
              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="tempData.email"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit('userinfo')">保存</el-button>
                <el-button type="danger" @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
            <el-form ref="form" :rules="passwordRules" :model="passData" label-width="100px" v-if="activeMenu===2">
              <el-form-item label="原密码" prop="oldPassword">
                <el-input v-model="passData.oldPassword"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="passData.newPassword"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="passData.confirmPassword"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit('password')">保存</el-button>
                <el-button type="danger" @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
            <avatar-cropper :src="getUserInfo.avatar" @cropper-confirm="handleCropperConfirm" v-if="activeMenu===3"/>
          </div>
        </div>
      </el-col>
      <el-col :span="6" :xs="24" class="right-wrap">
        <div class="card">
          <div class="card-header">
            <div class="card-title">登录日志</div>
          </div>
          <div class="log-container">
            <el-timeline>
              <el-timeline-item :timestamp="item.createTime" placement="top"
                                :color="item.status===1?'#0054FE':'#f56c6c'" v-for="item in logList" :key="item.id">
                <div class="timeline-item">
                  <div class="success" v-if="item.status===1">
                    <h4>{{ item.operationMessage }}</h4>
                    <p>在<span class="emphasize">{{ item.operationLocation }}</span>{{ item.operationMessage }}</p>
                  </div>
                  <div class="error" v-else>
                    <h4>{{ item.operationMessage }}</h4>
                    <p>由于<span class="emphasize-danger">{{ item.errorMessage }}</span>{{ item.operationMessage }}</p>
                  </div>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BaseImage from "@/components/BaseImage/index.vue";
import {mapGetters} from "vuex";
import AvatarCropper from "@/components/AvatarCropper/index.vue";
import md5 from "md5";
import {throttle} from "@/utils";

export default {
  name: "UserProfile",
  components: {AvatarCropper, BaseImage},
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.passData.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      backgroundImage: require("@/assets/images/profile-background2.jpg"),
      activeMenu: 1,
      menus: [{
        id: 1,
        name: "个人资料"
      }, {
        id: 2,
        name: "修改密码"
      }, {
        id: 3,
        name: "修改头像"
      }],
      centerWrapTitle: "个人资料",
      tempData: {},
      passData: {},
      logList: [],
      profileRules: {
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
      },
      passwordRules: {
        oldPassword: [
          {required: true, message: "旧密码不能为空", trigger: "blur"}
        ],
        newPassword: [
          {required: true, message: "新密码不能为空", trigger: "blur"},
          {min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur"}
        ],
        confirmPassword: [
          {required: true, message: "确认密码不能为空", trigger: "blur"},
          {required: true, validator: equalToPassword, trigger: "blur"}
        ]
      }
    };
  },
  computed: {
    ...mapGetters("user", ['getUserInfo']),
  },
  mounted() {
    this.tempData = {...this.getUserInfo};
    this.getUserLog();
    let mainContainer = document.getElementById("main-container");
    if (mainContainer.scrollTop > 174) {
      this.$refs.fixedMenu.style.transform = "translateY(0)";
    }
    mainContainer.addEventListener("scroll", this.showFixedHeader);
  },
  destroyed() {
    let mainContainer = document.getElementById("main-container");
    mainContainer.removeEventListener("scroll", this.showFixedHeader);
  },
  methods: {
    getUserLog() {
      this.$store.dispatch("user/getLoginLog", {current: 1, size: 5}).then(res => {
        this.logList = res.data.records;
      });
    },
    changeMenu(id) {
      this.activeMenu = id;
      this.centerWrapTitle = this.menus.find(item => item.id === id)?.name;
    },
    submit(type) {
      if (type === "userinfo") {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$store.dispatch("user/updateProfile", this.tempData).then(res => {
              this.$message.success("修改成功");
            });
          }
        });
      } else if (type === "password") {
        this.$refs.form.validate(valid => {
          if (valid) {
            let data = {
              id: this.getUserInfo.id,
              oldPassword: md5(this.passData.oldPassword),
              newPassword: md5(this.passData.newPassword),
              confirmPassword: md5(this.passData.confirmPassword)
            };
            this.$store.dispatch("user/updatePassword", data).then(() => {
              this.$message.success("修改成功");
            });
          }
        });
      }
    },
    resetForm() {
      this.tempData = {...this.getUserInfo};
    },
    handleCropperConfirm(data) {
      let user = {
        id: this.getUserInfo.id,
        avatar: data
      };
      this.$store.dispatch("user/updateAvatar", user).then(res => {
        this.$message.success("修改成功");
      });
    },
    showFixedHeader(e) {
      let fun = (height) => {
        if (height > 174) {
          this.$refs.fixedMenu.style.transform = "translateY(0)";
        } else {
          this.$refs.fixedMenu.style.transform = "translateY(-100%)";
        }
      }
      throttle(fun(e.target.scrollTop), 1000);
    }
  }
}
</script>

<style lang="less" scoped>
.profile-container {
  position: relative;
  //background-color: #24273b;
  //padding: 1rem;
}

.profile-header {
  position: relative;
  height: 20vh;
  min-height: 220px;
  max-height: 350px;
  z-index: 1;
  box-shadow: var(--shadow);
  //padding: 1rem;

  //&:before {
  //  content: "";
  //  width: 100%;
  //  height: 100%;
  //  position: absolute;
  //  z-index: -1;
  //  left: 0;
  //  top: 0;
  //  background-image: var(--profile-header-background);
  //  background-repeat: no-repeat;
  //  background-size: cover;
  //  background-position: center;
  //  filter: blur(50px);
  //  opacity: 0.7;
  //}

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: bottom;
    border-radius: .5rem;
    z-index: -2;
  }

  .user-info-container {
    position: relative;
    height: 20vh;
    min-height: 220px;
    max-height: 350px;
    z-index: 1;

    .user-info {
      position: absolute;
      align-items: center;
      display: flex;
      bottom: 16px;
      left: 24px;

      .user-avatar-container {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        object-fit: cover;
        border: 3px solid var(--panel-border-white-color);
        overflow: hidden;
        --shadow: 0 1px 5px 5px #302E150F;
        box-shadow: var(--shadow);

        .user-avatar {
          width: 100%;
          height: 100%;
        }
      }

      .user-detail {
        margin-left: 24px;
        margin-bottom: 24px;
        font-size: 22px;
        color: var(--text-white);
        font-weight: 600;

        .nickname {
          font-size: 2rem;
        }

        .role {
          margin-top: 2px;
          font-size: 1rem;
        }
      }
    }

  }
}

.menu-list-container {
  position: absolute;
  bottom: 0;
  //padding-left: 200px;
  background: var(--panel-background-color);
  width: 100%;
  border-radius: 0 0 .5rem .5rem;
  overflow: hidden;

  .menu-list {
    display: flex;
    justify-content: center;

    .menu-item {
      padding: 20px 16px;
      color: var(--text-light-color);
      transition: 0.3s;
      cursor: pointer;
      z-index: 1;
    }

    .active {
      color: var(--text-white);
      background-color: var(--bg-dark-primary);
    }
  }

  &.fixed {
    width: calc(100% - var(--back-sidebar-main-menu-width));
    height: 61px;
    position: fixed;
    top: var(--back-header-height);
    right: 0;
    z-index: 2;
    box-shadow: var(--shadow);
    transform: translateY(-100%);
    transition: width, transform .5s cubic-bezier(.4, 0, 1, 1);
    //margin-left: calc(var(--back-sidebar-main-menu-width) + var(--back-sidebar-sub-menu-width));
  }
}

.profile-content {
  position: relative;
  //display: flex;
  //justify-content: space-between;
  //gap: var(--margin-x);
  //z-index: 2;

  .left-wrap {
    //width: 20%;

    .user-info-list {
      .user-info-item {
        display: flex;
        align-items: center;
        padding: 16px 0;

        .label {
          width: 80px;
          color: var(--text-light-color);
        }

        .value {
          color: var(--text-default-color);
        }
      }
    }
  }

  .center-wrap {
    //width: 60%;
  }

  .right-wrap {
    //width: 20%;
  }

}

@media screen and (max-width: 768px) {
  .profile-header {
    .user-info-container {
      .user-info {
        bottom: 40px;

        .user-avatar-container {
          width: 100px;
          height: 100px;
        }

        .user-detail {
          margin-left: 16px;
          margin-bottom: 16px;
          font-size: 16px;

          .nickname {
            font-size: 1.5rem;
          }

          .role {
            margin-top: 2px;
            font-size: 1rem;
          }
        }
      }
    }

  }

  .menu-list-container {
    padding-left: 173px;

    &.fixed {
      width: 100%;
      padding-left: 0;
    }
  }

  .profile-content {
    .center-wrap, .right-wrap {
      margin-top: var(--margin-y);
    }
  }
}
</style>
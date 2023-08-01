<template>
  <div class="user-box-container">
    <el-popover
        placement="bottom"
        class="popover-container"
        trigger="click"
        v-model="popoverVisible">
      <div class="user-detail-container">
        <div class="user-info-container">
          <div class="avatar-container">
            <el-image
                :src="avatar"
                class="user-avatar"
                fit="contain"
                slot="reference">
              <div slot="placeholder" class="image-slot">
                <i class="el-icon-loading"></i>
              </div>
              <div slot="error" class="image-slot">
                <i class="el-icon-circle-close"></i>
              </div>
            </el-image>
          </div>
          <div class="info-list">
            <div class="nickname">{{ nickname }}</div>
            <!--            <div class="role">{{ role }}</div>-->
          </div>
        </div>
        <div class="menu-list-container">
          <div class="menu-item" @click="jumpToPage('/profile')">
            <div class="menu-icon" style="--icon-background-color:#ff9800">
              <i class="el-icon-user-solid"></i>
            </div>

            <div>
              <h2 class="title">个人资料</h2>
              <p class="sub-title">个人资料设置</p>
            </div>
          </div>
        </div>
        <div class="logout-btn-container">
          <el-button type="danger" class="logout-btn" icon="el-icon-circle-close" @click="logout">注销</el-button>
        </div>
      </div>

      <div class="user-box"
           slot="reference">
        <el-image
            :src="avatar"
            class="user-avatar"
            fit="contain">
          <div slot="placeholder" class="image-slot">
            <i class="el-icon-loading"></i>
          </div>
          <div slot="error" class="image-slot">
            <i class="el-icon-circle-close"></i>
          </div>
        </el-image>
        <div class="info-list">
          <div class="nickname">{{ nickname }}</div>
          <div class="role">{{ role }}</div>
        </div>
      </div>

    </el-popover>

  </div>
</template>

<script>

import {mapGetters, mapState} from "vuex";

export default {
  name: "UserBox",
  data() {
    return {
      popoverVisible: false
    }
  },
  computed: {
    ...mapGetters("user", ["getUserInfo"]),
    nickname() {
      if (this.getUserInfo)
        return this.getUserInfo.nickname ? this.getUserInfo.nickname : this.getUserInfo.username;
      return "";
    },
    role() {
      return this.getUserInfo?.roles[0]?.name;
    },
    avatar() {
      if (this.getUserInfo)
        return this.getUserInfo.avatar;
      return "";
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout");
      this.$message.success("注销成功");
      this.$router.push("/login");
    },
    jumpToPage(path) {
      this.popoverVisible = false;
      // this.$router.push(path);
      this.$router.push({
        path
      }, () => {
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-box-container {
  background-color: var(--panel-background-color);
  cursor: pointer;
  margin-right: var(--margin-x);

  .user-box {
    display: flex;
    align-items: center;

    .user-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      overflow: hidden;
      margin-right: var(--padding-x);

      .image-slot {
        width: 100%;
        height: 100%;
        background-color: var(--card-background-color);
        color: var(--card-font-color);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .info-list {
      color: var(--text-light-color);

      .nickname {
        font-size: 1rem;
        color: var(--text-default-color);
        font-weight: 600;
        margin-bottom: 2px;
      }

      .role {
        font-size: .5rem;
        color: var(--text-light-color);
      }
    }

  }
}

.user-detail-container {
  width: 16rem;

  .user-info-container {
    display: flex;
    align-items: center;
    background-color: var(--card-background-color);
    padding: 1rem;
    margin-bottom: 1rem;

    .avatar-container {
      max-width: 3.5rem;
      max-height: 3.5rem;
      border-radius: 50%;
      background-color: var(--card-background-color);
      margin-right: 1rem;
      overflow: hidden;
    }

    .info-list {
      color: var(--text-light-color);

      .nickname {
        font-size: 1rem;
        color: var(--text-default-color);
        font-weight: 600;
      }

      .role {
        font-size: .5rem;
        color: var(--text-light-color);
      }
    }
  }

  .menu-list-container {
    margin-bottom: 1rem;

    .menu-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      cursor: pointer;

      .menu-icon {
        width: 2rem;
        height: 2rem;
        color: #ffffff;
        background-color: var(--icon-background-color);
        font-size: .5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        margin-right: .5rem;
      }


      .title {
        font-size: 1rem;
        color: var(--text-default-color);
      }

      .sub-title {
        font-size: .5rem;
        color: var(--text-light-color);
      }


      &:hover {
        background-color: var(--bg-light);

        .title {
          color: var(--text-primary-color);
        }
      }
    }
  }

  .logout-btn-container {
    width: 100%;
    height: 2.25rem;

    .logout-btn {
      width: 100%;
      height: 100%;
      //background-color: var(--bg-light-primary);
      //color: #ffffff;
      //border: none;
    }
  }
}
</style>
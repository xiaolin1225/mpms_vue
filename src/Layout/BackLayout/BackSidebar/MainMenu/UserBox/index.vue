<template>
  <div class="user-box-container">
    <el-popover
        placement="right"
        class="popover-container"
        trigger="click"
        v-model="popoverVisible">
      <div class="user-detail-container">
        <div class="user-info-container">
          <div class="avatar-container">
            <el-image
                :src="require('@/assets/logo.png')"
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
<!--            <div class="nickname">{{ userinfo.nickname }}</div>-->
<!--            <div class="role">{{ userinfo.role }}</div>-->
            <div class="nickname">小林</div>
            <div class="role">管理员</div>
          </div>
        </div>
        <div class="menu-list-container">
          <div class="menu-item" @click="jumpToPage('/back/user/profile')">
            <div class="menu-icon" style="--icon-background-color:#ff9800">
              <i class="el-icon-user-solid"></i>
            </div>

            <div>
              <h2 class="title">个人资料</h2>
              <p class="sub-title">个人资料设置</p>
            </div>
          </div>
          <div class="menu-item" style="--icon-background-color:#0ea5e9" @click="jumpToPage('/back/order/my')">
            <div class="menu-icon">
              <i class="el-icon-goods"></i>
            </div>

            <div>
              <h2 class="title">我的订单</h2>
              <p class="sub-title">查看所有订单</p>
            </div>
          </div>
        </div>
        <div class="logout-btn-container">
          <el-button class="logout-btn" icon="el-icon-circle-close" @click="logout">注销</el-button>
        </div>
      </div>

      <el-image
          :src="require('@/assets/logo.png')"
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
    </el-popover>

  </div>
</template>

<script>

export default {
  name: "UserBox",
  data() {
    return {
      popoverVisible: false
    }
  },
  computed: {
  },
  methods: {
    logout() {
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
  width: 2rem;
  height: 2rem;
  background-color: var(--card-background-color);
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  .user-avatar {
    width: 100%;
    height: 100%;

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
      color: #334155;

      .nickname {
        font-size: 16px;
        color: var(--card-font-color);
        font-weight: 600;
      }

      .role {
        font-size: 12px;
        color: var(--sub-title-font-color);
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
        width: var(--menu-icon-size);
        height: var(--menu-icon-size);
        color: #ffffff;
        background-color: var(--icon-background-color);
        font-size: var(--menu-icon-size - .5rem);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: .5rem;
        margin-right: .5rem;
      }


      .title {
        font-size: var(--menu-title-font-size);
        color: var(--card-font-color);
      }

      .sub-title {
        font-size: var(--menu-sub-title-font-size);
        color: var(--sub-title-font-color);
      }


      &:hover {
        background-color: var(--menu-hover-background-color);

        .title {
          color: var(--menu-title-hover-font-color);
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
      background-color: var(--bg-light-primary);
      color: #ffffff;
      border: none;
    }
  }
}
</style>
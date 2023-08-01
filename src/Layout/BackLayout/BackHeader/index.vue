<template>
  <div class="container">
    <div class="brand-container">
      <div class="logo-container">
        <BrandLogo :img_url="brand"/>
      </div>
      <div class="brand-title">{{ webTitle }}</div>
    </div>
    <div class="header-content">
      <div class="left-wrap">
        <div class="sub-menu-toggle-btn" v-if="subMenuSize>1">
          <i :class="isSubmenuOpen?'el-icon-s-fold':'el-icon-s-unfold'" @click="toggleSubMenu"></i>
        </div>
      </div>
      <div class="right-wrap">
        <div class="extends">
          <!--          <div class="extend-item">-->
          <!--            <i class="el-icon-full-screen"></i>-->
          <!--          </div>-->
        </div>
        <div class="user-info">
          <!--          <div class="user-avatar">-->
          <!--            <img :src="avatar" alt="">-->
          <!--          </div>-->
          <!--          <div class="user-name">{{ username }}</div>-->
          <UserBox/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BrandLogo from "@/components/BrandLogo";
import UserBox from "@/Layout/BackLayout/BackHeader/UserBox";
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
  name: "BackHeader",
  components: {BrandLogo, UserBox},
  computed: {
    ...mapState("system", ["brand", "webTitle", "isSubmenuOpen"]),
    ...mapGetters("menu", ["subMenuSize"]),
    // ...mapState("user", ["userinfo"]),
    // username() {
    //   return this.userinfo.username;
    // },
    // avatar() {
    //   return this.userinfo.avatar;
    // }
  },
  methods: {
    ...mapMutations("system", ["toggleSubMenu"])
  },
  created() {
    console.log(this.$route)
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  padding: var(--padding-y) var(--padding-x);
  height: var(--back-header-height);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  background-color: var(--panel-background-color);
  //background-color: hsla(0, 0%, 100%, .8);
  border-bottom: 1px solid var(--panel-border-color);
  transition: width .5s cubic-bezier(.4, 0, 1, 1);

  .brand-container {
    display: flex;
    align-items: center;
    margin-left: calc(-1 * var(--padding-x));

    .logo-container {
      width: var(--back-sidebar-main-menu-width);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-title {
      min-width: var(--back-sidebar-sub-menu-width);
      font-size: 1.5rem;
      color: var(--text-default-color);
      margin-right: var(--margin-x);
    }
  }

  .header-content {
    flex-grow: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left-wrap {
      display: flex;
      gap: var(--padding-x);

      .sub-menu-toggle-btn {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-light-color);
        cursor: pointer;
      }
    }

    .right-wrap {
      display: flex;
      align-items: center;
      gap: var(--padding-x);
      //padding-right: var(--padding-x);

      .extends {
        display: flex;
        gap: var(--padding-x);

        .extend-item {
          font-size: 1.5rem;
          color: var(--text-light-color);
          cursor: pointer;
        }
      }

      .user-info {
        display: flex;
        align-items: center;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: var(--padding-x);

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .user-name {
          font-size: 1.2rem;
          color: var(--text-default-color);
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .container {
    .brand-container {
      .brand-title {
        display: none;
      }
    }

    .user-info {
      .user-avatar {
        margin-right: 0;
      }

      .user-name {
        display: none;
      }
    }
  }
}
</style>
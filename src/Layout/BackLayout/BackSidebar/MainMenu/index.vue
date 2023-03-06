`++<template>
  <div class="main-menu-container">
    <div class="menu-list-container">
      <MainMenuList :list="menuList"/>
    </div>
    <div class="tool-box">
      <MainMenuItem icon="el-icon-s-tools" title="设置" link="/back/system/setting"/>
      <UserBox/>
    </div>
  </div>
</template>

<script>
import MainMenuList from "@/Layout/BackLayout/BackSidebar/MainMenu/MainMenuList/index.vue";
import UserBox from "@/Layout/BackLayout/BackSidebar/MainMenu/UserBox/index.vue";
import MainMenuItem from "@/Layout/BackLayout/BackSidebar/MainMenu/MainMenuItem/index.vue";

export default {
  name: "MainMenu",
  components: {MainMenuItem, UserBox, MainMenuList},
  data() {
    return {
      menuList: [{
        id: 1,
        title:"首页",
        icon: "el-icon-s-home",
        link: "/back/home"
      },
        {
          id: 2,
          title:"内容",
          icon: "el-icon-s-management",
          link: "/back/content"
        },
        {
          id: 3,
          title:"媒体",
          icon: "el-icon-video-camera-solid",
          link: "/back/media"
        },
        {
          id: 4,
          title:"用户",
          icon: "el-icon-user-solid",
          link: "/back/user"
        },
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.main-menu-container {
  width: var(--back-sidebar-main-menu-width);
  height: calc(100% - var(--back-header-height));
  position: fixed;
  left: 0;
  top: var(--back-header-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--padding-y) var(--padding-x);
  background-color: var(--panel-background-color);
  border-right: 1px solid var(--panel-border-color);
  z-index: 30;

  .menu-list-container {
    margin: var(--margin-y) 0;
    flex-grow: 1;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  .tool-box{
    margin: var(--margin-y) var(--margin-x);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--margin-y);
  }
}
</style>
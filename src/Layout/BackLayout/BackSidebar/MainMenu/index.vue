`++
<template>
  <div class="main-menu-container">
    <div class="menu-list-container">
      <MainMenuList :list="list"/>
    </div>
    <div class="tool-box">
      <UserBox/>
    </div>
  </div>
</template>

<script>
import MainMenuList from "@/Layout/BackLayout/BackSidebar/MainMenu/MainMenuList/index.vue";
import UserBox from "@/Layout/BackLayout/BackSidebar/MainMenu/UserBox/index.vue";
import MainMenuItem from "@/Layout/BackLayout/BackSidebar/MainMenu/MainMenuItem/index.vue";
import {mapGetters} from "vuex";

export default {
  name: "MainMenu",
  components: {MainMenuItem, UserBox, MainMenuList},
  props: {
    list: Array
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

  .tool-box {
    margin: var(--margin-y) var(--margin-x);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--margin-y);
  }
}
</style>
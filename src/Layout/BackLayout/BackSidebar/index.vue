<template>
  <div class="container">
    <MainMenu :list="mainMenus"/>
    <SubMenu :list="subMenus"/>
  </div>
</template>

<script>
import MainMenu from "./MainMenu";
import SubMenu from "./SubMenu";
import {mapGetters} from "vuex";
import {getMenuByPid} from "@/utils/menuUtils";

export default {
  name: "BackSidebar",
  components: {SubMenu, MainMenu},
  computed: {
    ...mapGetters("menu", ["mainMenus", "subMenus"]),
  },
}
</script>

<style scoped>
.container {
  /*width: calc(var(--back-sidebar-main-menu-width) + var(--back-sidebar-sub-menu-width));*/
  /*height: 100%;*/
  /*position: fixed;*/
  /*top: 0;*/
  /*left: 0;*/
  /*border-right: 1px solid var(--panel-border-color);*/
  /*transition: width .5s cubic-bezier(.4, 0, 1, 1);*/
  /*background-color: var(--panel-background-color);*/
  /*overflow: hidden;*/
  /*display: flex;*/
  /*align-items: center;*/
}
</style>
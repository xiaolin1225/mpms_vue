<template>
  <div class="submenu-container">
    <SubMenuList :list="list"/>
  </div>
</template>

<script>
import SubMenuList from "@/Layout/BackLayout/BackSidebar/SubMenu/SubMenuList/index.vue";

export default {
  name: "SubMenu",
  components: {SubMenuList},
  props: {
    list: Array
  }
}
</script>

<style scoped>
.submenu-container {
  width: calc(var(--back-sidebar-main-menu-width) + var(--back-sidebar-sub-menu-width));
  height: calc(100% - var(--back-header-height));
  position: fixed;
  top: var(--back-header-height);
  left: 0;
  padding-left: var(--back-sidebar-main-menu-width);
  background-color: var(--panel-background-color);
  border-right: 1px solid var(--panel-border-color);
  transform: translateX(calc(-100% - var(--back-sidebar-main-menu-width) + 1px));
  transition: transform .5s cubic-bezier(.4, 0, 1, 1);
  z-index: 20;
  overflow: hidden;
}
</style>
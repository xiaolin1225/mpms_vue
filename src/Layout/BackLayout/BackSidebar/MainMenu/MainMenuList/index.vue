<template>
  <ul class="menu-list">
    <MainMenuItem icon="el-icon-s-home" link="/" title="首页"/>
    <MainMenuItem v-for="(item,index) in list" :key="index" :id="item.id" :icon="item.icon" :link="item.path"
                  :title="item.title"/>
  </ul>
</template>

<script>
import MainMenuItem from "@/Layout/BackLayout/BackSidebar/MainMenu/MainMenuItem/index.vue";

export default {
  name: "MainMenuList",
  data() {
    return {
      activeIndex: 0,
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  components: {MainMenuItem},
}
</script>

<style lang="less" scoped>
.menu-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
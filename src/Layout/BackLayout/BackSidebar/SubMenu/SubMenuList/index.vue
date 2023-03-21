<template>
  <el-menu router :default-active="$route.path">
    <submenu-item v-for="item in list" :key="item.id" :content="item"/>
  </el-menu>
</template>

<script>
import SubmenuItem from "@/Layout/BackLayout/BackSidebar/SubMenu/SubMenuItem/index.vue";

export default {
  name: "SubMenuList",
  components: {SubmenuItem},
  props: {
    list: Array
  }
}
</script>

<style scoped>

</style>
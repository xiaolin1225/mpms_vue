<template>
  <el-menu>
  <el-submenu  index="1">
    <template #title>
      <i class="el-icon-location"></i>
      <span>仪表盘</span>
    </template>
    <el-submenu index="1-4">
      <template #title>选项4</template>
      <el-menu-item index="1-4-1">选项1</el-menu-item>
    </el-submenu>
  </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: "SubMenuList"
}
</script>

<style scoped>

</style>
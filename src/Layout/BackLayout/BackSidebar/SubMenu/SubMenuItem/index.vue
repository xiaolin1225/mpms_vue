<template>
  <div>
    <el-menu-item :index="content.path" v-if="content.children&&content.children.length===0">
      <i :class="content.icon"></i>
      <span slot="title">{{ content.title }}</span>
    </el-menu-item>
    <el-submenu :index="content.path" v-if="content.children&&content.children.length>0">
      <template #title>
        <i :class="content.icon"></i>
        <span slot="title">{{ content.title }}</span>
      </template>
      <submenu-item v-for="item in content.children" :key="item.id" :content="item"/>
    </el-submenu>
  </div>
</template>

<script>
export default {
  name: "SubmenuItem",
  props: {
    content: Object
  }
}
</script>

<style scoped>

</style>
<template>
  <div class="page-title-container">
    <h1>{{ title }}</h1>
    <span class="line" v-if="breadcrumb.length>0"></span>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
          v-for="(item,index) in breadcrumb"
          :key="index"
          :to="{ path: item.link }">{{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "PageTitle",
  props: {
    title: {
      type: String,
      required: true
    },
    breadcrumb: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="less" scoped>
.page-title-container {
  margin-bottom: var(--margin-y);
  padding: var(--padding-y) var(--padding-x);
  border-bottom: 1px solid var(--panel-border-color);
  display: flex;
  align-items: center;

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-default-color);
  }

  .line {
    width: 2px;
    height: 1rem;
    background-color: #666;
    margin: 0 var(--margin-x);
  }
}
</style>
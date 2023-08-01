<template>
  <div>
    <el-page-header class="base-header" @back="$router.back()" :title="title">
      <template #title>
        <slot name="title"/>
        <slot>{{ title }}</slot>
      </template>
      <template #content>
        <div class="header-content" ref="headerContent">
          <slot name="default"/>
          <slot name="content"/>
          <slot>{{ content }}</slot>
        </div>
      </template>
    </el-page-header>
  </div>
</template>

<script>
export default {
  name: "BaseHeader",
  props: {
    title: {
      type: String,
      default: "返回"
    },
    content: {
      type: String,
      default: ""
    }
  },
  created() {
    this.$nextTick(() => {
      let result = document.getElementsByClassName("el-page-header__left");
      if (result.length > 0) {
        const headerLeft = result[0];
        this.$refs.headerContent.style.paddingRight = headerLeft.clientWidth + 40 + 'px';
      }
    })
  }
}
</script>

<style lang="less" scoped>
:deep(.base-header) {
  width: 100%;
  height: var(--back-header-height);
  position: fixed;
  top: 0;
  left: 0;
  padding: var(--padding-y) var(--padding-x);
  display: flex;
  align-items: center;
  background-color: #fff;
  box-shadow: var(--shadow);
  z-index: 5;

  .el-page-header__left {
    flex-shrink: 0;
  }

  .el-page-header__content {
    width: 100%;
  }

  .header-content {
    width: 100%;
    display: flex;
    gap: var(--margin-x);
    justify-content: center;
    align-items: center;
  }
}
</style>
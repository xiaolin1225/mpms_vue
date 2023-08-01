<template>
  <div>
    <el-page-header class="base-header" @back="$router.back()" :title="title" :content="content">
      <template #content>
        <div class="header-content">
          <div class="header-content">
            <slot name="default"/>
            <slot name="content"/>
          </div>
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

  .el-page-header__left {
    flex-shrink: 0;
  }

  .el-page-header__content {
    width: 100%;
    padding-right: 92px;
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
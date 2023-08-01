<template>
  <div class="container">
    <div class="left-wrap">
      <slot name="default"/>
      <slot name="left"/>
    </div>
    <div class="right-wrap">
      <slot name="right"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseBar"
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--margin-y) var(--margin-x);
}

.left-wrap,
.right-wrap {
  display: flex;
  align-items: center;
  //& > *{
  //  margin-left: var(--margin-x);
  //
  //  &:first-child{
  //    margin-left: 0;
  //  }
  //}
}

:deep(.el-form-item) {
  margin-bottom: 0;
}

@media screen and (max-width: 992px) {
  .container {
    display: block;
  }

  .left-wrap,
  .right-wrap {
    width: 100%;
    display: block;
    text-align: center;
  }

  .right-wrap {
    margin-top: var(--margin-y);
  }
}
</style>
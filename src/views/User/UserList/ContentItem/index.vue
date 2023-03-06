<template>
  <div class="container">
    <div class="thumb-container">
      <BaseImage :src="content.thumb" fit="cover"/>
    </div>
    <div class="details-container">
      <div class="title">{{ content.title }}</div>
      <div class="author">{{ content.author }}</div>
      <div class="digest">{{ content.digest }}</div>
    </div>
  </div>
</template>

<script>
import BaseImage from "@/components/BaseImage/index.vue";

export default {
  name: "ContentItem",
  components: {BaseImage},
  props: {
    content: Object
  }
}
</script>

<style lang="less" scoped>
.container {
  display: flex;

  .thumb-container {
    width: 150px;
    height: 80px;
    border-radius: .5rem;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .details-container {
    margin-left: var(--margin-x);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
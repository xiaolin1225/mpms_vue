<template>
  <router-link :to="target_url">
    <el-image :src="img_url" class="logo">
      <div slot="placeholder" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
    </el-image>
  </router-link>
</template>

<script>
export default {
  name: "BrandLogo",
  props: {
    img_url: {
      type: String,
      require: true
    },
    target_url:{
      type:String,
      default:"/"
    }
  }
}
</script>

<style scoped>
.logo{
  width: calc(var(--back-header-height) - var(--padding-y) - 1rem);
  height: calc(var(--back-header-height) - var(--padding-y) - 1rem);
  transition: transform .5s cubic-bezier(.4, 0, .2, 1);
}
.logo:hover {
  transform: rotate(360deg);
}

</style>
<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>

</template>

<script>

// 引入IconFont图标

// 引入本地的svg文件
// 定义一个加载目录的函数
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/assets/icons/svg', false, /\.svg$/)
const fileTypeIcon = require.context('@/assets/icons/svg/file-type', false, /\.svg$/)
const musicPlayerIcon = require.context('@/assets/icons/svg/music-player', false, /\.svg$/)
// 加载目录下的所有的 svg 文件
requireAll(req)
requireAll(fileTypeIcon)
requireAll(musicPlayerIcon)

export default {
  name: "SvgIcon",
  props: {
    name: String,
    prefix: {
      type: String,
      default: 'icon-'
    }
  },
  computed: {
    iconName() {
      return `#${this.prefix}${this.name}`
    }
  }
}
</script>

<style scoped>

.icon {
  display: inline-block;
  width: 100%;
  height: 100%;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
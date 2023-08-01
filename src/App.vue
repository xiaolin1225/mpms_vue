<template>
  <div style="width: 100%;height: 100%">
    <router-view/>
  </div>
</template>
<script>


export default {
  methods: {},
  created() {
    this.$store.dispatch("system/getSystemConfig");
  }
}
</script>
<style>
</style>

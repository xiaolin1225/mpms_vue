<template>
  <router-view/>
</template>
<script>
import {mapActions} from "vuex";

export default {
  methods: {
    ...mapActions("menu", ["getMenus"])
  },
  created() {
    this.getMenus();
  }
}
</script>
<style>
</style>

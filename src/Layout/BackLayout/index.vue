<template>
  <div class="page-container">
    <div class="header-container">
      <BackHeader/>
    </div>
    <div class="sidebar-container">
      <BackSidebar/>
    </div>
    <div class="main-container" id="main-container">
      <PageTitle :title="$route.meta.title" :breadcrumb="$route.matched" v-if="$route.meta.isShowHeader"/>
      <div class="page-content">
        <transition name="page-change">
          <keep-alive>
            <router-view/>
          </keep-alive>
        </transition>
      </div>
      <div class="footer-container py">
        <BackFooter/>
      </div>
    </div>

    <div class="overlay" @click="closeSidebar"></div>
  </div>
</template>

<script>
import BackHeader from "@/Layout/BackLayout/BackHeader/index.vue";
import BackSidebar from "@/Layout/BackLayout/BackSidebar/index.vue";
import BackFooter from "@/Layout/BackLayout/BackFooter/index.vue";
import PageTitle from "@/components/PageTitle/index.vue";
import {mapActions, mapState} from "vuex";

export default {
  name: "BackLayout",
  components: {PageTitle, BackFooter, BackSidebar, BackHeader},
  methods: {
    closeSidebar() {
      this.$store.commit("system/toggleSubMenu", false);
    },
    ...mapActions("menu", ["getMenus"])
  },
  mounted() {
    // this.getMenus();
    this.$store.commit("system/toggleSubMenu", this.$store.state["system/isSubmenuOpen"]);
  }
}
</script>

<style lang="less" scoped>
.page-container {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .main-container {
    height: calc(100% - var(--back-header-height));
    overflow: auto;
    margin-top: var(--back-header-height);
    margin-left: var(--back-sidebar-main-menu-width);
    padding: calc(var(--padding-y)) var(--padding-x) var(--padding-y);
    transition: margin .5s cubic-bezier(.4, 0, 1, 1);
    z-index: 1;

    .page-content {
      min-height: calc(100% - var(--back-header-height) - var(--padding-y) - var(--margin-y) - 5rem);
    }
  }

  .overlay {
    display: none;
    position: fixed;
    bottom: 0;
    right: 0;
    width: calc(100% - var(--back-sidebar-main-menu-width));
    height: calc(100% - var(--back-header-height));
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity .5s cubic-bezier(.4, 0, 1, 1);
    z-index: 2;
    transform: translate(-100%);
  }
}

.page-change-enter-active, .page-change-leave-active {
  transform: translate(0);
  transition: transform .2s cubic-bezier(.4, 0, 1, 1);
}

.page-change-enter, .page-change-leave-to {
  transform: translate(-100%);
}

</style>
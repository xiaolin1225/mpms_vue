<template>
  <div class="page-container">
    <div class="header-container">
      <BackHeader/>
    </div>
    <div class="sidebar-container">
      <BackSidebar/>
    </div>
    <div class="main-container" id="main-container">
      <PageTitle :title="$route.meta.title" :breadcrumb="$route.matched"/>
      <div class="page-content">
        <transition name="page-change">
          <router-view/>
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

export default {
  name: "BackLayout",
  components: {PageTitle, BackFooter, BackSidebar, BackHeader},
  methods: {
    closeSidebar() {
      document.body.classList.remove("submenu-open")
    }
  }
}
</script>

<style lang="less" scoped>
.page-container {
  width: 100%;
  height: 100%;

  .main-container {
    height: 100%;
    margin-left: var(--back-sidebar-main-menu-width);
    padding: calc(var(--back-header-height) + var(--padding-y)) var(--padding-x) var(--padding-y);
    transition: margin .5s cubic-bezier(.4, 0, 1, 1);
    z-index: 1;

    .page-content {
      min-height: calc(100% - var(--back-header-height) - var(--padding-y) - var(--margin-y) - 1.5rem);
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
<template>
  <li class="menu-item" :class="isActive?'active':''" @click="handleItemClick">
    <i :class="icon" v-if="displayIcon"/>
    <span class="svg-icon" v-else-if="displaySvgIcon">
      <SvgIcon name="video"/>
    </span>
    <span class="title" v-show="title">{{ title }}</span>
  </li>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "MainMenuItem",
  data() {
    return {
      isActive: false
    }
  },
  props: {
    id: Number,
    icon: String,
    activeIcon: String,
    svgIcon: String,
    activeSvgIcon: String,
    title: {
      type: String
    },
    link: {
      type: String,
      default: "#"
    },
    // active: {
    //   type: Boolean
    // }
  },
  computed: {
    displayIcon() {
      if (!this.icon) {
        return undefined;
      }
      if (!this.activeIcon) {
        return this.icon;
      }
      return this.active ? this.activeIcon : this.icon;
    },
    displaySvgIcon() {
      if (!this.svgIcon) {
        return undefined;
      }
      if (!this.activeIcon) {
        return this.svgIcon;
      }
      return this.active ? this.activeSvgIcon : this.svgIcon;
    },
    currentPath() {
      return this.$route.path;
    }
  },
  watch: {
    currentPath() {
      this.setActiveStatus();
    }
  },
  methods: {
    ...mapActions("menu", ["setSubmenus"]),
    handleItemClick() {
      this.$emit("handleItemClick");
      if (!this.isActive) {
        this.$router.push(this.link);
      }
    },
    setActiveStatus() {
      let index = this.$route.matched.findIndex(item => item.path === this.link);
      if (index !== -1) {
        this.setSubmenus(this.id);
        this.isActive = true;
      } else {
        this.isActive = false;
      }
      // this.isActive = this.link === this.currentPath;
    }
  },
  mounted() {
    this.setActiveStatus();
  }
}
</script>

<style lang="less" scoped>
.menu-item {
  width: 3rem;
  height: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: .5rem;
  color: var(--text-light-color);
  background-color: transparent;
  padding: .5rem;
  margin-bottom: var(--margin-y);
  cursor: pointer;
  opacity: 1;
  transition: opacity .1s cubic-bezier(.4, 0, 1, 1);

  i {
    font-size: 1.75rem;
  }

  .svg-icon {
    width: 1.75rem;
    height: 1.75rem;
  }

  .title {
    font-size: .5rem;
    margin-top: .1rem;
    text-align: center;
  }

  &.active {
    color: var(--text-primary-color);

    &:hover {
      opacity: 1;
    }
  }

  &:hover {
    opacity: 80%;
  }
}
</style>
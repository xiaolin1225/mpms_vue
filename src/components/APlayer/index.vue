<template>
  <div ref="player" class="container"></div>
</template>

<script>
import 'aplayer/dist/APlayer.min.css';
import APlayer from 'aplayer';

export default {
  name: "APlayer",
  data() {
    return {
      instance: null,
    };
  },
  props: {
    option: {
      type: Object,
      required: true,
    },
    loop: {
      type: Boolean,
      default: false
    },
    mini: {
      type: Boolean,
      default: false
    },
    autoplay: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.instance = new APlayer({
      ...this.option,
      theme: "#0054fe",
      loop: this.loop ? 'all' : 'none',
      mini: this.mini,
      autoplay: this.autoplay,
      container: this.$refs.player,
    });

    this.$nextTick(() => {
      this.$emit("get-instance", this.instance);
    });
  },
  watch: {
    loop(value) {
      this.instance.audio.loop = value;
    }
  },
  beforeDestroy() {
    if (this.instance) {
      this.instance.destroy();
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>

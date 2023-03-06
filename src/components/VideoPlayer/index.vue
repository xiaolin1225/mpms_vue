<template>
  <div ref="player" class="container"></div>
</template>

<script>
import player from "artplayer";
import {transPlayTime} from "@/utils";
import artplayerPluginControl from "artplayer-plugin-control/dist/artplayer-plugin-control";

export default {
  name: "VideoPlayer",
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
  },
  mounted() {
    setTimeout(() => {
      this.instance = new player({
        ...this.option,
        theme: "#0054fe",
        autoSize: true,
        autoMini: true,
        playbackRate: true,
        setting: true,
        aspectRatio: true,
        screenshot: true,
        hotkey: true,
        pip: true,
        mutex: true,
        fullscreen: true,
        fullscreenWeb: true,
        subtitleOffset: true,
        miniProgressBar: true,
        plugins: [artplayerPluginControl()],
        container: this.$refs.player,
      });
      this.instance.on('ready', () => {
        console.log(`文件名称：${this.option.title}，`, `文件类型：视频，`, `时长：${transPlayTime(this.instance.duration)}`);
      });
      this.$nextTick(() => {
        this.$emit("get-instance", this.instance);
      });
    }, 200);
  },
  watch: {
    instance() {
      this.$nextTick(() => {
        this.$emit("get-instance", this.instance);
      });
    }
  },
  beforeDestroy() {
    if (this.instance && this.instance.destroy) {
      this.instance.destroy(false);
      this.inst = null;
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  aspect-ratio: 16/9;
}
</style>

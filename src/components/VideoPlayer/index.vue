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
    this.resizeContainer()
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
    this.instance.on("resize", (e) => {
      // this.resizeContainer()
      // document.querySelector(".art-video-player").style.width = "100%";
      // document.querySelector(".art-video-player").style.height = "100%";
    })

  },
  methods: {
    resizeContainer() {
      let width = this.$refs.player.offsetWidth;
      let height = width * this.option.height / this.option.width;
      console.log(width, height, this.option.width, this.option.height)
      this.height = height + "px";
    }
  },
  watch: {},
  beforeDestroy() {
    if (this.instance && this.instance.destroy) {
      this.instance.destroy(false);
      this.instance = null;
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 400px;

  :deep(.art-video-player) {
    .art-state {
      width: 10%;
      height: 10%;
      bottom: 70px;
    }

    .art-bottom {
      width: 90%;
      min-width: unset;

      .art-controls {
        width: 100%;
        overflow-x: auto;
        overflow-y: hidden;

        &::-webkit-scrollbar,
        &::-webkit-scrollbar-track {
          background-color: transparent;
        }
      }
    }

  }
}
</style>

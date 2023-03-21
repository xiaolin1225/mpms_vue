<template>
  <div ref="player" class="container" :class="isPlay?'played':''">
    <div class="top-container">
      <div class="music-thumb-container" ondrag="return false;">
        <div class="jukebox"></div>
        <BaseImage :src="option.audio.cover" fit="contain" class="music-thumb"/>
        <div class="regard"></div>
        <div class="stylus"></div>
        <div class="switch"></div>
      </div>
      <div class="lrc-container" v-if="option.audio.lrc">
        <LyricsScroll :url="option.audio.lrc" :currentTime="this.currentTime" :duration="duration"/>
      </div>
    </div>
    <APlayer :loop="isLoop" :option="option" mini @get-instance="getInstance" style="display: none"/>
    <div class="player-control-container">
      <div class="player-progress-container">
        <div class="player-time player-current-time">{{ transPlayTime(currentTime) }}</div>
        <div class="player-progress">
          <el-slider v-model="progress" :min="0" :max="parseFloat(duration)" :step="0.000001"
                     :format-tooltip="transPlayTime"
                     @change="progressChange" @mousedown.native="isDragProgress = true"
                     @mouseup.native="isDragProgress = false"></el-slider>
        </div>
        <div class="player-time player-duration">{{ transPlayTime(duration) }}</div>
      </div>
      <div class="opt-btn-container mt">
        <el-button type="primary" circle class="opt-btn loop-btn mr" :plain="!isLoop" @click="isLoop=!isLoop">
          <SvgIcon name="loop" class="opt-btn-icon"/>
        </el-button>
        <el-button type="primary" circle class="opt-btn play-btn mr" @click="togglePlayer">
          <SvgIcon :name="isPlay?'pause':'play'" class="opt-btn-icon"/>
        </el-button>
        <el-popover
            placement="top-start"
            width="65"
            trigger="hover"
            class="volume-progress-popover"
        >
          <el-button slot="reference" type="primary" circle class="opt-btn volume-btn" @click="muteVolume"
                     :plain="isMute">
            <SvgIcon :name="isMute?'mute':'volume'" class="opt-btn-icon"/>
          </el-button>
          <el-slider
              v-model="volume"
              :min="0"
              :max="100"
              :step="1"
              vertical
              height="200px"
              @input="volumeProgressChange"
              :format-tooltip="formatVolume"
          >
          </el-slider>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>

import BaseImage from "@/components/BaseImage/index.vue";
import APlayer from "@/components/APlayer/index.vue";
import {transPlayTime} from "@/utils";
import LyricsScroll from "@/components/MusicPlayer/LyricsScroll/index.vue";
import Decimal from "decimal.js";

export default {
  name: "MusicPlayer",
  components: {LyricsScroll, APlayer, BaseImage},
  data() {
    return {
      instance: null,
      progress: 0,
      currentTime: 0,
      duration: 0,
      volume: 70,
      volumeOld: 70,
      isPlay: false,
      isLoop: false,
      isMute: false,
      isDragProgress: false,
    };
  },
  props: {
    option: {
      type: Object,
      required: true,
    },
  },
  methods: {
    transPlayTime,
    getInstance(instance) {
      this.instance = instance;
      this.$nextTick(() => {
        this.$emit("get-instance", this.instance);
      });
      this.storageVolume();
      this.instance.on("durationchange", () => {
        this.duration = this.instance.audio.duration;
        console.log(`文件名称：${this.option.audio.name} - ${this.option.audio.artist}，`, `文件类型：音乐，`, `时长：${transPlayTime(this.duration)}`);
      })
      this.instance.on("play", () => {
        this.isPlay = true;
      })
      this.instance.on("pause", () => {
        this.isPlay = false;
      })
      this.instance.on("timeupdate", () => {
        // console.log(this.instance.audio.currentTime)
        this.currentTime = this.instance.audio.currentTime;
        if (!this.isDragProgress)
          this.progress = this.currentTime;
      })
    },
    togglePlayer() {
      // this.isPlay = !this.isPlay;
      this.instance.toggle();
    },
    progressChange(value) {
      this.instance.seek(value);
    },
    volumeProgressChange(value) {
      if (value === 0)
        this.isMute = true;
      else {
        this.isMute = false;
        this.volumeOld = value;
      }
      let volume = new Decimal(value).times(0.01).toFixed(2);
      if (this.instance) {
        this.instance.volume(volume, true);
        this.storageVolume(volume);
      }
    },
    formatVolume(value) {
      value = parseFloat(value);
      return value.toFixed(0) + "%"
    },
    storageVolume(value) {
      if (value) {
        localStorage.setItem("audioVolume" + this.option.audio.url, value);
      } else {
        let data = localStorage.getItem("audioVolume" + this.option.audio.url);
        let volume = data ? parseFloat(data) : 70;
        this.volume = volume;
        this.instance.volume(volume * 0.01, false);
      }
    },
    muteVolume() {
      if (this.isMute) {
        this.isMute = false;
        this.volume = this.volumeOld >= 10 ? parseInt(this.volumeOld) : 70;
      } else {
        this.isMute = true;
        this.volumeOld = parseInt(this.volume);
        this.volume = 0;
      }
    },
    keyboardListener(e) {
      e.preventDefault();
      let code = e.code;
      console.log(code)
      switch (code) {
        case "Space":
          this.togglePlayer();
          break;
        case "ArrowLeft":
          this.progressChange(this.currentTime - 5);
          break;
        case "ArrowRight":
          this.progressChange(this.currentTime + 5);
          break;
        case "ArrowUp":
          this.volume = this.volume + 1;
          break;
        case "ArrowDown":
          this.volume = this.volume - 1;
          break;
        case "KeyM":
          this.muteVolume();
          break;
        case "KeyR":
          this.isLoop = !this.isLoop;
          break;
      }
    }
  },
  watch: {
    instance() {
      this.$nextTick(() => {
        this.$emit("get-instance", this.instance);
      });
    }
    // this.instance = this.$refs.audioPlayer;
    // this.$nextTick(() => {
    //   this.duration = this.instance.duration;
    //   this.$emit("get-instance", this.instance);
    // });
  },
  mounted() {
    window.addEventListener("keyup", this.keyboardListener);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.keyboardListener);
    if (this.instance) {
      this.instance.destroy();
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  min-width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .top-container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .lrc-container {
      flex-grow: 1;
      max-width: 500px;
      min-width: 200px;
      margin-left: 2rem;
    }
  }

  .music-thumb-container {
    user-select: none;
    width: 15rem;
    height: 14.625rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition: transform .4s cubic-bezier(.4, 0, 1, 1);

    .jukebox {
      position: absolute;
      top: 0;
      left: 0;
      width: 15rem;
      height: 14.625rem;
      background: url("@/assets/images/juckbox/jukebox.png") no-repeat;
      background-size: contain;
    }

    .regard {
      --regard-width: 11.5rem;
      --position-offest-x: 1px;
      --position-offest-y: -2px;
      position: absolute;
      top: calc(50% - 0.5 * var(--regard-width) + var(--position-offest-y));
      left: calc(50% - 0.5 * var(--regard-width) + var(--position-offest-x));
      width: var(--regard-width);
      height: var(--regard-width);
      background: url("@/assets/images/juckbox/regard.png") no-repeat;
      background-size: contain;
    }

    .stylus {
      --stylus-width: 5.5rem;
      --stylus-height: 13.5rem;
      --position-offest-x: 102px;
      --position-offest-y: -22px;
      position: absolute;
      top: calc(50% - 0.5 * var(--stylus-height) + var(--position-offest-y));
      left: calc(50% - 0.5 * var(--stylus-width) + var(--position-offest-x));
      width: var(--stylus-width);
      height: var(--stylus-height);
      background: url("@/assets/images/juckbox/stylus.png") no-repeat;
      background-size: contain;
      transform-origin: 34px 44px;
      transform: rotate(0deg);
      transition: transform 1.5s ease-in-out;
    }

    .switch {
      --stylus-width: 1rem;
      --stylus-height: 3.5rem;
      --position-offest-x: 94px;
      --position-offest-y: 87px;
      position: absolute;
      top: calc(50% - 0.5 * var(--stylus-height) + var(--position-offest-y));
      left: calc(50% - 0.5 * var(--stylus-width) + var(--position-offest-x));
      width: var(--stylus-width);
      height: var(--stylus-height);
      background: url("@/assets/images/juckbox/switch-close.png") no-repeat;
      background-size: contain;
    }

    .music-thumb {
      width: 8rem;
      height: 8rem;
      border-radius: 50%;
      overflow: hidden;
    }
  }

  &.played {
    .music-thumb-container {
      .stylus {
        transform: rotate(18deg);
        animation: stylus-rotate 3s linear 1.5s infinite;
      }

      .switch {
        background: url("@/assets/images/juckbox/switch-open.png") no-repeat;
        background-size: contain;
      }

      .regard,
      .music-thumb {
        animation: regard-rotate 3s linear infinite;
      }
    }
  }


  .player-control-container {
    width: 100%;
    margin: 2rem 0 1rem;

    .player-progress-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--margin-x);

      .player-progress {
        flex: 70%;

        :deep(.el-slider) {
          .el-slider__runway {
            .el-slider__button {
              display: none;
              border-color: var(--panel-border-primary-color);
            }

            .el-slider__bar {
              background-color: var(--bg-dark-primary);
            }
          }

          &:hover {
            .el-slider__button {
              display: inline-block;
            }
          }
        }
      }

      .player-time {
        white-space: nowrap;
        flex: 15%;
        color: var(--text-default-color);
        font-weight: 600;
        font-size: 14px;
        text-align: center;
      }
    }

    .opt-btn-container {
      display: flex;
      justify-content: center;
      align-items: center;


      .el-button--primary:focus,
      .el-button--primary {
        color: var(--text-white);
        background-color: var(--bg-dark-primary);

        &:hover {
          background-color: var(--bg-dark-primary);
        }

        &.is-plain {
          color: var(--text-primary-color);
          background-color: var(--bg-light-primary);
          border: 1px solid var(--panel-border-primary-color);
        }
      }

      .opt-btn {
        .opt-btn-icon {
          width: 2rem;
          height: 2rem;
          //color: var(--text-white);
        }
      }

      .play-btn {
        .opt-btn-icon {
          width: 3rem;
          height: 3rem;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .container {
    .top-container {
      //display: block;
      flex-direction: column;

      .lrc-container {
        margin-left: 0;
      }
    }
  }
}

//@media screen and (max-width: 1400px) {
//  .container {
//    .music-thumb-container {
//      transform: scale(.8);
//    }
//  }
//}
//
//@media screen and (max-width: 1200px) {
//  .container {
//    .music-thumb-container {
//      transform: scale(.7);
//    }
//  }
//}
//
//@media screen and (max-width: 992px) {
//  .container {
//    .music-thumb-container {
//      transform: scale(.6);
//    }
//  }
//}

@media screen and (max-width: 768px) {
  .container {
    .music-thumb-container {
      transform: scale(1);
    }
  }
}

@keyframes regard-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes stylus-rotate {
  100% {
    transform: rotate(18deg);
  }
  50% {
    transform: rotate(15deg);
  }
  0% {
    transform: rotate(18deg);
  }
}
</style>

<template>
  <div class="lyrics-container" ref="lyrics-container" @mousedown.left="userDrag">
    <div ref="lyrics-text" class="lyrics-text"
         :style="'--lyrics-top-offset:'+lyricsTopOffset+';'+'--lyrics-on-play-time:'+lyricsOnPlayTime+';'">
      <p ref="lyrics" :class="activeIndex===index?'active':''" v-for="(item,index) in lyrics" :key="item.index">
        <span class="off"><span class="on">{{ item.text }}</span>{{ item.text }}</span>
      </p>
      <p style="margin-bottom: 1rem;"></p>
      <p></p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {debounce, transLyricsTimeToPlayTime} from "@/utils";

export default {
  name: "LyricsScroll",
  data() {
    return {
      lyrics: [],
      activeIndex: -1,
      lyricsTopOffset: "130px",
      lyricsTopOffsetOld: 0,
      lyricsOnPlayTime: 0,
      isUserOperation: false,
      userScrollHeight: 0,
      scrollHeight: 0,
      timeoutId: 0,
      isMouseHoverLyricsContainer: false
    }
  },
  props: {
    url: String,
    currentTime: Number,
    duration: Number,
    option: Object
  },
  methods: {
    async getLyricFile(url) {
      const response = await axios.get(url);
      const data = response.data;
      const reg = /\[(\d{2}:\d{2}\.\d{2})](.*)/g;
      let lyrics = []
      let index = 1;
      data.replace(reg, (item, time, text) => {
        let data = {
          start_time: transLyricsTimeToPlayTime(time),
          text,
          index: index++
        }
        if (text.trim().length > 0) {
          lyrics.push(data);
        }
      });
      for (let i = 0; i < lyrics.length - 1; i++) {
        lyrics[i].end_time = lyrics[i + 1].start_time;
      }
      this.lyrics = lyrics;
    },
    setActiveIndex() {
      let index = this.lyrics.findIndex(item => {
        return item.start_time <= this.currentTime && item.end_time >= this.currentTime;
      });
      if (this.lyrics[this.lyrics.length - 1] && this.currentTime > this.lyrics[this.lyrics.length - 1].start_time) {
        index = this.lyrics.length - 1;
      }
      if (this.currentTime === this.duration || this.currentTime === 0) {
        this.activeIndex = -1;
        this.$nextTick(() => {
          this.computedScrollPosition(index);
        })
      }
      if (index !== -1 && this.activeIndex !== index) {
        this.activeIndex = index;
        this.lyricsOnPlayTime = 0
        // this.lyricsOnPlayTime = parseFloat(this.lyrics[this.activeIndex].end_time) - parseFloat(this.lyrics[this.activeIndex].start_time);
      }
      if (this.activeIndex !== -1) {
        let hasPlayTime = this.currentTime - parseFloat(this.lyrics[this.activeIndex].start_time);
        let totalPlayTime = parseFloat(this.lyrics[this.activeIndex].end_time) - parseFloat(this.lyrics[this.activeIndex].start_time);
        let lyricsOnPlayTime = hasPlayTime / (totalPlayTime - 0.5);
        this.lyricsOnPlayTime = lyricsOnPlayTime * 100 + '%';
        this.computedScrollPosition(index, lyricsOnPlayTime);
      }
    },
    computedScrollPosition(index, time) {
      if (index === -1)
        return;
      if (!this.isUserOperation) {
        let cHeight = window.getComputedStyle(this.$refs["lyrics-container"]).height.replace('px', '');
        let offsetTop = this.$refs.lyrics[index].offsetTop;
        let scrollHeight = offsetTop - cHeight / 2 + 145;
        this.$refs["lyrics-container"].scrollTo({top: scrollHeight, behavior: "smooth"})
      }
      let pWidth = window.getComputedStyle(this.$refs.lyrics[index].getElementsByClassName("on")[0]).width.replace('px', '');
      let offsetLeft = this.$refs.lyrics[index].getElementsByClassName("on")[0].offsetLeft;
      let scrollWidth = pWidth * time;
      this.$refs.lyrics[index].scrollTo({left: scrollWidth, behavior: "smooth"})
      // console.log(pHeight,offsetTop);

    },
    userDrag() {
      this.isUserOperation = true;
      let move = () => {
        let offsetTop = this.$refs["lyrics-container"].scrollTop;
        this.userScrollHeight = offsetTop + 2;
        this.$refs["lyrics-container"].scrollTo({
          top: this.userScrollHeight
        })
      }
      // 添加鼠标移动事件
      document.addEventListener('mousemove', move);
      // 添加鼠标释放事件, 一旦释放鼠标, 移除鼠标移动事件, 即停止移动
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', move);
        this.isUserOperation = false
      })
    },
  },
  watch: {
    currentTime() {
      this.setActiveIndex();
    },
    duration(value) {
      this.lyrics[this.lyrics.length - 1].end_time = value;
    },
  },
  mounted() {
    let url = this.url ? this.url : this.option.url;
    this.getLyricFile(url);
    this.setActiveIndex();
  }
}
</script>

<style lang="less" scoped>
.lyrics-container {
  width: 100%;
  height: 350px;
  overflow: auto;
  position: relative;
  text-align: center;
  cursor: grab;
  //border: 2px dotted var(--panel-border-primary-color);
  mask-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0) 0, hsla(0, 0%, 100%, .6) 15%, #fff 25%, #fff 75%, hsla(0, 0%, 100%, .6) 85%, hsla(0, 0%, 100%, 0));

  &::-webkit-scrollbar,
  p::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .lyrics-text {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    font-size: 1rem;
    line-height: 4rem;
    color: var(--text-light-color);
    text-align: center;
    font-weight: 600;
    transition: all .5s ease-in-out;
    transform: translateY(var(--lyrics-top-offset));
    user-select: none;

    p {
      height: 64px;
      overflow: auto;
      white-space: nowrap;

      .off {

        position: relative;
      }

      .on {
        display: none;
        position: absolute;
        top: -1.375rem;
        left: 0;
        //width: 100%;
        //height: 100%;
        color: transparent;
        background: var(--text-light-color) -webkit-linear-gradient(left, var(--text-primary-color), var(--text-primary-color)) no-repeat 0 0;
        background-clip: text;
        background-size: 0 100%;
        transition: all .5s linear;
      }
    }

    p.active {
      font-size: 1.5rem;
      //transform: scale(1.5);
      //color: var(--text-primary-color);

      .off {
        color: transparent;
      }

      .on {
        display: block;
        top: -1.05rem;
        //animation: lyrics-on-play var(--lyrics-on-play-time) linear 0 1 normal;
        background-size: var(--lyrics-on-play-time) 100%;
      }
    }
  }
}

@keyframes lyrics-on-play {
  0% {
    background-size: 0 100%;
  }
  100% {
    background-size: 100% 100%;
  }
}

@media screen and (max-width: 768px) {
  .lyrics-container {
    width: 100%;
    min-width: 400px;
    height: 200px;

    .lyrics-text {
      p:last-child {
        display: none;
      }
    }
  }
}
</style>
<template>
  <div class="media-details-container" v-loading.fullscreen.lock="loading">
    <div class="left-wrap">
      <component :is="component"
                 :option="option"
                 @get-instance="getInstance" v-if="component!=='el-empty'">
      </component>
      <el-empty description="暂不支持在线查看此文件" v-else-if="component==='el-empty'">
        <el-button type="primary" @click="download">点击下载后查看</el-button>
      </el-empty>
      <!--      <div class="video-player-container" v-if="displayType==='video'">-->
      <!--        <VideoPlayer :option="option" class="video-player"/>-->
      <!--      </div>-->
      <!--      <div class="image-container" v-else-if="displayType==='image'">-->
      <!--        <BaseImage :src="info.url" :preview-src-list="[info.url]" fit="contain" class="image"/>-->
      <!--      </div>-->
      <!--      <div class="music-player-container" v-else-if="displayType==='music'">-->
      <!--        <MusicPlayer :option="option" @get-instance="getInstance"/>-->
      <!--      </div>-->
      <!--      <div class="unknown-container" v-else>-->
      <!--        <el-empty description="暂不支持在线查看此文件">-->
      <!--          <el-button type="primary" @click="download">点击下载后查看</el-button>-->
      <!--        </el-empty>-->
      <!--      </div>-->
    </div>
    <div class="right-wrap ml p">
      <el-descriptions title="文件信息" :column="1" border>
        <el-descriptions-item label="ID">{{ info.id }}</el-descriptions-item>
        <el-descriptions-item label="标题">{{ info.title }}</el-descriptions-item>
        <el-descriptions-item label="替换文字">{{ info.alt }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ info.description }}</el-descriptions-item>
        <el-descriptions-item label="文件地址">{{ info.url }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ typeName }}</el-descriptions-item>
        <el-descriptions-item label="后缀名">{{ info.suffix }}</el-descriptions-item>
        <el-descriptions-item v-for="item in metaList" :key="item.id" :label="item.label">{{
            JSON.parse(item.value)
          }}
        </el-descriptions-item>
        <el-descriptions-item label="文件大小">{{ fileSizeByteToM(info.size, 2) }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ info.createTime }}</el-descriptions-item>
      </el-descriptions>
      <el-button type="primary" @click="download" class="mt" v-if="component!=='el-empty'" style="width: 60%;">
        下载此文件
      </el-button>
    </div>
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer/index.vue";
import BaseImage from "@/components/BaseImage/index.vue";
import MusicPlayer from "@/components/MusicPlayer/index.vue";
import {downloadFile, fileSizeByteToM} from "@/utils/fileUtils";
import {requestFileMeta} from "@/api/file";
import LyricsScroll from "@/components/MusicPlayer/LyricsScroll/index.vue";

export default {
  name: "MediaPreview",
  components: {LyricsScroll, MusicPlayer, BaseImage, VideoPlayer},
  data() {
    return {
      info: null,
      instance: null,
      option: null,
      // displayType: "unknown",
      component: "",
      metaList: [],
      operation: {
        video: (value) => {
          this.component = "VideoPlayer";
          this.option = {
            id: value.id.toString(),
            url: value.url,
            poster: value.thumb ? value.thumb : "",
            title: value.title,
            autoplay: true,
          }
        },
        audio: (value) => {
          this.component = "MusicPlayer";
          let lrc = this.metaList.find(item => item.label === "歌词");
          if (lrc && lrc.value && lrc !== "") {
            value.lrc = JSON.parse(lrc.value);
          }
          this.option = {
            lrcType: value.lrc ? value.lrc.trim().length > 0 ? 3 : 0 : 0,
            audio: {
              name: value.title,
              artist: value.artist,
              url: value.url,
              cover: value.thumb,
              lrc: value.lrc
            }
          }
        },
        image: (value) => {
          this.component = "BaseImage";
          this.option = {
            src: value.url,
            previewSrcList: [value.url],
            fit: "contain",
            lazy: true
          }
        },
        lyric: (value) => {
          this.component = "LyricsScroll";
          this.option = {
            url: value.url
          }
        },
        default: () => {
          this.component = "el-empty";
        }
      },
      loading: true
    }
  },
  methods: {
    fileSizeByteToM,
    getInstance(instance) {
      this.$emit("get-instance", instance);
      this.instance = instance;
    },
    async setData(value) {
      if (!value.id) {
        this.info = null;
        return;
      }
      this.info = value;
      let displayName = value.type ? value.type.parent.name : "unknown";
      // this.displayType = value.url.length > 0 ? typeName : "unknown";
      await this.getFileMeta(value.id);
      this.operation[displayName] ? this.operation[displayName](value) : this.operation.default();
      setTimeout(() => {
        this.loading = false;
      }, 500);
      // if (typeName === "video") {
      //   this.option = {
      //     id: value.id.toString(),
      //     url: value.url,
      //     poster: value.thumb ? value.thumb : "",
      //     title: value.title
      //   }
      // } else if (typeName === "music") {
      //   this.option = {
      //     lrcType: value.lrc ? value.lrc.trim().length > 0 ? 3 : 0 : 0,
      //     audio: {
      //       name: value.title,
      //       artist: value.artist,
      //       url: value.url,
      //       cover: value.thumb,
      //       lrc: value.lrc
      //     }
      //   }
      // } else {
      //   this.option = null;
      // }
    },
    async getFileMeta(fid) {
      let res = await requestFileMeta({fid});
      this.metaList = res.data;
    },
    download() {
      if (this.info.url.trim().length > 0) {
        downloadFile(this.info.url, this.info.title, this.info.suffix);
      } else {
        this.$message.error("文件链接不存在");
      }
    }
  },
  computed: {
    typeName() {
      return this.content.type ? this.content.type.name : "";
    },
  },
  props: {
    content: Object,
  },
  watch: {
    content: {
      handler: function (value) {
        this.setData(value);
      },
      deep: true
    }
  },
  mounted() {
    this.setData(this.content);
  },
  beforeDestroy() {
    if (this.instance)
      this.instance.destroy();
  }
}
</script>

<style lang="less" scoped>
.media-details-container {
  width: 100%;
  //height: calc(100vh - 110px);
  max-height: calc(100vh - 110px);
  display: flex;
  align-items: center;

  .left-wrap {
    flex: 75%;
    text-align: center;

    .el-image {
      max-width: 500px;
    }
  }

  .right-wrap {
    flex: 25%;
    //max-height: 550px;
    max-height: calc(100vh - 110px);
    overflow: auto;
    background-color: var(--bg-light);
    text-align: center;

    .media-details-form {
      font-size: 0;

      label {
        color: var(--text-light-color);
        font-weight: 600;
      }

      .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
        color: var(--text-default-color);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .media-details-container {
    display: block;

    .right-wrap {
      margin-left: 0;
      margin-top: var(--margin-y);
      max-height: unset;
    }
  }
}

</style>
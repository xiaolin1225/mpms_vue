<template>
  <div class="media-details-container" v-if="info!==null">
    <div class="left-wrap">
      <component :is="component" :option="option" :description="option.description" @get-instance="getInstance"
                 :key="info.id"/>
      <!--      <div class="video-player-container" v-if="content.type==='video'">-->
      <!--        <VideoPlayer :option="option" class="video-player" @get-instance="getInstance"/>-->
      <!--      </div>-->
      <!--      <div class="image-container" v-viewer v-else-if="content.type==='image'">-->
      <!--        <el-tooltip content="点击查看大图" placement="top">-->
      <!--          <BaseImage :src="info.url" fit="contain" class="image"/>-->
      <!--        </el-tooltip>-->
      <!--      </div>-->
      <!--      <div class="music-player-container" v-else-if="content.type==='music'">-->
      <!--        <MusicPlayer :option="option" @get-instance="getInstance"/>-->
      <!--      </div>-->
      <!--      <div class="unknown-container" v-else>-->
      <!--        <BaseImage :src="info.thumb" fit="contain" class="image"/>-->
      <!--      </div>-->
    </div>
    <div class="right-wrap ml p">
      <el-form ref="form" :model="info" label-width="80px" label-position="top">
        <el-form-item label="标题">
          <el-input v-model="info.title" placeholder="请输入文件标题"
                    :rules="{required: true, message: '文件名称不能为空', trigger: 'blur'}"></el-input>
        </el-form-item>
        <el-form-item label="替换文字">
          <el-input v-model="info.alt" placeholder="请输入文件缺失时替换的文字"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" maxlength="300" show-word-limit v-model="info.description"
                    placeholder="请输入文件描述"></el-input>
        </el-form-item>
        <el-form-item
            label="附加信息"
            v-if="metaList.length>0"
        >
          <div :ref="`metaList[${item.id}]`" v-for="item in metaList"
               :key="item.id" style="display:flex;align-items:end;">
            <el-col :span="10">
              <label>属性名称</label>
              <el-input v-model="item.label" placeholder="请输入属性名称" label="属性名称"
                        :rules="{required: true, message: '属性名称不能为空', trigger: 'blur'}"></el-input>
            </el-col>
            <el-col :span="11" class="ml">
              <label>属性值</label>
              <el-input v-model="item.value" placeholder="请输入属性值" label="属性值"></el-input>
            </el-col>
            <el-col :span="1" class="ml" style="text-align: right">
              <el-button type="danger" icon="el-icon-delete" circle
                         @click.prevent="removeMeta(item.id)"></el-button>
            </el-col>
          </div>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.prevent="addMeta">添加其他属性</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import VideoPlayer from "@/components/VideoPlayer/index.vue";
import BaseImage from "@/components/BaseImage/index.vue";
import MusicPlayer from "@/components/MusicPlayer/index.vue";
import {deleteFileMeta, requestFileMeta, saveFileInfo} from "@/api/file";

export default {
  name: "MediaDetails",
  components: {MusicPlayer, BaseImage, VideoPlayer},
  data() {
    return {
      info: null,
      instance: null,
      option: null,
      component: "el-empty",
      metaList: [],
      operation: {
        video: (value) => {
          this.component = "VideoPlayer";
          this.option = {
            id: value.id.toString(),
            url: value.url,
            poster: value.thumb ? value.thumb : "",
            title: value.title,
            autoplay: false,
          }
        },
        audio: (value) => {
          this.component = "MusicPlayer";
          let lrc = this.metaList.find(item => item.label === "歌词");
          if (lrc && lrc.value && lrc !== "") {
            value.lrc = lrc.value;
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
        default: () => {
          this.component = "el-empty";
          this.option = {
            description: "暂不支持在线查看此文件",
          }
        }
      }
    }
  },
  methods: {
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
      await this.getFileMeta(value.id);
      this.operation[displayName] ? this.operation[displayName](value) : this.operation.default();

      // this.info = value;
      // if (value.type === "video") {
      //   this.option = {
      //     id: value.id.toString(),
      //     url: value.url,
      //     poster:value.thumb,
      //     title:value.title
      //   }
      // } else if (value.type === "music") {
      //   this.option = {
      //     lrcType: value.lrc.trim().length > 0 ? 3 : 0,
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
      let res = await requestFileMeta({fid, status: 2});
      this.metaList = res.data.map((item) => {
        if (item.value && item.value !== "" && item.value.trim().length > 0)
          item.value = JSON.parse(item.value);
        return item;
      });
    },
    addMeta() {
      this.metaList.push({
        id: this.metaList.length + 1,
        label: "",
        value: ""
      })
      this.$nextTick(() => {
        this.$refs[`metaList[${this.metaList.length}]`][0].scrollIntoView({behavior: "smooth"});
      })
    },
    removeMeta(id) {
      this.$confirm("此操作将永久删除该文件属性, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteFileMeta(id);
        this.metaList = this.metaList.filter(item => item.id !== id);
      }).catch(() => {
      });
    },
    saveFileInfo() {
      let data = {
        title: this.info.title,
        alt: this.info.alt,
        description: this.info.description,
        meta: this.metaList
      }
      let id = this.info.id;
      this.$refs.form.validate((valid) => {
        if (valid) {
          saveFileInfo(id, data).then(res => {
            this.$message.success(res.message);
            this.$emit("closeDialog");
          });
        }
      });
    }
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
  display: flex;
  align-items: center;

  .left-wrap {
    flex: 50%;

    .image-container {
      .image {
        cursor: pointer;
      }
    }
  }

  .right-wrap {
    flex: 50%;
    max-height: 550px;
    overflow: auto;
    background-color: var(--bg-light);

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
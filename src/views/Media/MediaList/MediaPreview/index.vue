<template>
  <div class="media-details-container" v-loading="loading">
    <div class="left-wrap">
      <component :is="component"
                 :option="option"
                 @get-instance="getInstance" v-if="component!=='empty'">
      </component>
      <el-empty description="暂不支持在线查看此文件" v-else-if="component==='empty'">
        <el-button type="primary" @click="download">点击下载后查看</el-button>
      </el-empty>
    </div>
    <div class="right-wrap">
      <BaseBar class="mb">
        <template #left>
          <h3>文件详情</h3>
        </template>
        <template #right>
          <el-button type="primary" @click="editModeChange">{{ editMode ? "保存" : "编辑" }}</el-button>
        </template>
      </BaseBar>
      <el-form ref="form" :model="info" label-width="80px">
        <div class="file-info-table">
          <table cellspacing="0" cellpadding="0">
            <tr class="item">
              <td class="label">ID</td>
              <td class="value">{{ info.id }}</td>
            </tr>
            <tr class="item">
              <td class="label">标题</td>
              <td class="value">
                <span v-if="!editMode">{{ info.title }}</span>
                <el-input v-model="info.title" placeholder="请输入标题" v-else></el-input>
              </td>
            </tr>
            <tr class="item">
              <td class="label">替换文字</td>
              <td class="value">
                <span v-if="!editMode">{{ info.alt }}</span>
                <el-input v-model="info.alt" placeholder="请输入替换文字" v-else></el-input>
              </td>
            </tr>
            <tr class="item">
              <td class="label">描述</td>
              <td class="value">
                <span v-if="!editMode">{{ info.description }}</span>
                <el-input type="textarea" :rows="3" v-model="info.description" placeholder="请输入描述"
                          v-else></el-input>
              </td>
            </tr>
            <tr class="item">
              <td class="label">封面</td>
              <td class="value">
                <BaseImage :src="info.thumb" v-if="!editMode && info.thumb"/>
                <el-upload
                    class="avatar-uploader"
                    action="api/file/thumb"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    v-else-if="editMode"
                    :data="uploadFileData"
                >
                  <img v-if="tempPic" :src="tempPic" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </td>
            </tr>
            <el-button @click="addMeta" v-if="editMode" type="primary"
                       style="margin: var(--margin-y) auto;text-align: center;">
              新增属性
            </el-button>
            <tr class="item" v-for="item in metaList" :key="item.id" :id="`meta[${item.id}]`">
              <td class="label">
                <el-input v-model="item.label" placeholder="请输入属性名称" v-if="editMode&&item.status!==1"></el-input>
                <span v-else>{{ item.label }}</span>
              </td>
              <td class="value">
                <el-input v-model="item.value" placeholder="请输入属性值" v-if="editMode&&item.status!==1"></el-input>
                <span v-else>{{ item.value }}</span>
              </td>
              <td class="delete-icon" v-if="editMode">
                <el-button type="danger" circle icon="el-icon-delete-solid"
                           v-if="editMode&&item.status!==1" @click="deleteMeta(item.id)"></el-button>
              </td>
            </tr>
            <tr class="item">
              <td class="label">文件地址</td>
              <td class="value">{{ info.path + (info.suffix ? "." + info.suffix : "") }}</td>
            </tr>
            <tr class="item">
              <td class="label">类型</td>
              <td class="value">{{ info.type.name }}</td>
            </tr>
            <tr class="item">
              <td class="label">后缀名</td>
              <td class="value">{{ info.suffix }}</td>
            </tr>
            <tr class="item">
              <td class="label">文件大小</td>
              <td class="value">{{ fileSizeByteToM(info.size, 2) }}</td>
            </tr>
          </table>
        </div>
      </el-form>
      <el-button type="primary" @click="download" class="mt" v-if="component!=='empty'" style="width: 60%;">
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
import {deleteFileMeta, requestFileInfo, requestFileMeta, saveFileInfo} from "@/api/file";
import LyricsScroll from "@/components/MusicPlayer/LyricsScroll/index.vue";
import BaseBar from "@/components/BaseBar/index.vue";
import file2md5 from "file2md5";

export default {
  name: "MediaPreview",
  components: {BaseBar, LyricsScroll, MusicPlayer, BaseImage, VideoPlayer},
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
          let width = this.metaList.find(item => item.label === "宽度");
          width = width ? width.value : 0;
          let height = this.metaList.find(item => item.label === "高度");
          height = height ? height.value : 0;
          return {
            url: value.url,
            thumb: value.thumb ? value.thumb : "",
            title: value.title,
            width,
            height
            // autoplay: true,
          }
        },
        audio: (value) => {
          this.component = "MusicPlayer";
          let lrc = this.metaList.find(item => item.label === "歌词");
          if (lrc && lrc.value && lrc !== "") {
            value.lrc = JSON.parse(lrc.value);
          }
          return {
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
          return {
            src: value.url,
            previewSrcList: [value.url],
            fit: "contain",
            lazy: true
          }
        },
        lyric: (value) => {
          this.component = "LyricsScroll";
          return {
            url: value.url
          }
        },
        default: () => {
          this.component = "empty";
        }
      },
      loading: false,
      infoTable: [],
      editMode: false,
      uploadFileData: {
        md5: "",
        folderId: -1
      },
      tempPic: ""
    }
  },
  methods: {
    fileSizeByteToM,
    getInstance(instance) {
      this.$emit("get-instance", instance);
      this.instance = instance;
    },
    getFileInfo(value) {
      this.loading = true;
      if (!value || isNaN(value)) {
        this.component = "empty";
      }
      requestFileInfo(value).then(res => {
        this.info = res.data;
        this.tempPic = this.info.thumb;
        this.getFileMeta(value);

      }).catch(error => {
        this.$message.error("文件信息请求失败，" + error);
        this.loading = false;
      })

    },
    getFileMeta(fid) {
      requestFileMeta({fid}).then(res => {
        this.metaList = res.data.map(item => {
          item.value = JSON.parse(item.value);
          return item;
        });
        let displayName = this.info.type ? this.info.type.parent.name : "default";
        this.option = this.operation[displayName] ? this.operation[displayName](this.info) : this.operation.default();
        this.editMode = this.isEdit;
      }).catch(error => {
        this.$message.error("文件信息请求失败，" + error);
      }).finally(() => {
        this.loading = false;
      });
    },
    download() {
      if (this.info.url.trim().length > 0) {
        downloadFile(this.info.url, this.info.title, this.info.suffix);
      } else {
        this.$message.error("文件链接不存在");
      }
    },
    editModeChange() {
      if (this.editMode) {
        this.saveFileInfo();
        console.log("保存")
      } else {
        this.editMode = true;
      }
    },
    addMeta() {
      let id = this.metaList.length + 1;
      this.metaList.unshift({
        id,
        label: "",
        value: "",
        status: 3
      });
      this.$nextTick(() => {
        document.getElementById(`meta[${id}]`).scrollIntoView({behavior: "smooth", block: "center"})
      })
    },
    deleteMeta(id) {
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
    handleAvatarSuccess(res) {
      this.info.thumb = res.data.name;
      this.tempPic = res.data.url;
    },
    async beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!');
        return false;
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
        return false;
      }
      try {
        this.uploadFileData.md5 = await file2md5(file, {chunkSize: 3 * 1024 * 1024});
      } catch (e) {
        console.error('error', e);
        return false;
      }
      return true;
    },
    saveFileInfo() {
      let data = {
        ...this.info,
        meta: this.metaList
      }
      let id = this.info.id;
      this.$refs.form.validate((valid) => {
        if (valid) {
          saveFileInfo(id, data).then(res => {
            this.$message.success(res.message);
            this.getFileInfo(id);
            this.$nextTick(() => {
              this.$emit("fileInfoSaved");
            })
            this.editMode = false;
          });
        }
      });
    }
  },
  computed: {},
  props: {
    id: Number,
    isEdit: Boolean
  },
  watch: {},
  mounted() {
    this.getFileInfo(this.id);
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
  display: flex;
  justify-content: space-between;
  align-items: center;

  .left-wrap {
    width: 60%;
    border-radius: .5rem;
    overflow: hidden;
  }

  .right-wrap {
    width: 40%;
    text-align: center;
    margin-left: var(--margin-x);

    .file-info-table {
      width: 100%;
      max-height: 400px;
      overflow: auto;

      .item {
        font-size: 14px;
        line-height: 20px;
        color: var(--text-default-color);
        //border-bottom: 2px solid var(--panel-border-color);

        &:nth-child(2n) {
          background-color: var(--bg-light);
        }

        &:hover {
          background-color: var(--bg-dark-light-primary);
        }

        td {
          border: 1px solid var(--panel-border-color);
          border-spacing: 0;
          padding: var(--padding-y) var(--padding-x);
        }

        .label {
          white-space: nowrap;
          font-size: 16px;
          font-weight: 600;
        }

        .value {
          text-align: left;
        }

        .delete-icon {
          border: none;
          background-color: #ffffff;
        }

        .avatar-uploader {
          :deep(.el-upload) {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;

            &:hover {
              border-color: var(--panel-border-primary-color);
            }
          }

          .avatar-uploader-icon {
            font-size: 28px;
            color: var(--text-light-color);
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
          }

          .avatar {
            width: 178px;
            height: 178px;
            display: block;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .media-details-container {
    display: block;

    .left-wrap {
      width: 100%;
    }

    .right-wrap {
      width: 100%;
      margin-left: unset;
      max-height: unset;

      .file-info-table {
        max-height: unset;
      }
    }
  }
}
</style>
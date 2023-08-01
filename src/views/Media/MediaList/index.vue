<template>
  <div class="container" v-loading="loading">
    <div class="card">
      <BaseBar>
        <template #left>
          <el-button type="primary" icon="el-icon-upload" @click="handleUploadDialogOpen">
            上传
          </el-button>
        </template>
        <template #right>
          <el-form v-model="filter" inline class="form">
            <!--            <el-form-item label="分类">-->
            <!--              <el-select-->
            <!--                  v-model="filter.cid"-->
            <!--                  placeholder="请选择分类">-->
            <!--                <el-option label="此文件夹" :value="1"/>-->
            <!--                <el-option label="所有文件" :value="2"/>-->
            <!--              </el-select>-->
            <!--            </el-form-item>-->
            <!--            <el-form-item label="类型">-->
            <!--              <el-cascader-->
            <!--                  v-model="filter.type"-->
            <!--                  :options="options"-->
            <!--                  :props="props"-->
            <!--                  clearable-->
            <!--              ></el-cascader>-->
            <!--            </el-form-item>-->
            <el-form-item label="关键词">
              <el-input v-model="filter.keyword" placeholder="请输入关键词"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </template>
      </BaseBar>
    </div>
    <div class="media-card-list-container">
      <div class="media-card-list mt" id="mediaList" ref="mediaCardList">
        <div class="media-item" :class="isChecked(item.id)?'is-checked':''" v-for="item in list" :key="item.id"
             @click.right.prevent.stop="handleItemRightClick(item.id,$event)">
          <div class="media-item-header">
            <el-checkbox :value="isChecked(item.id)" @click.native.prevent="itemCheckToggle(item.id)"/>
          </div>
          <div @click="handleItemClick(item.id)">
            <div class="media-thumb-wrap">
              <div class="type-icon">
                <SvgIcon :name="`type-${item.type}`"/>
              </div>
              <BaseImage :src="item.thumb" fit="cover" @load="loadThumb" style="transform: scale(1.1);"/>
            </div>
            <el-popover
                placement="bottom"
                width="200"
                trigger="hover"
            >
              <div>名称：<span>{{ item.title + (item.suffix ? "." + item.suffix : "") }}</span></div>
              <div>大小：<span>{{ fileSizeByteToM(item.size, 2) }}</span></div>
              <div>创建日期：<span>{{ item.createTime }}</span></div>
              <div class="media-info-wrap" slot="reference">
                <h2 class="title">
                  {{ item.title && item.title.length > 18 ? item.title.slice(0, 19) + "..." : item.title }}
                </h2>
                <h2 class="date">{{ item.createTime }}</h2>
              </div>
            </el-popover>
          </div>
        </div>
      </div>
    </div>
    <BasePagination v-model="current" :page-num="pageNum" :total="total" :page-size="size"
                    @size-change="handleSizeChange" class="mt card"/>
    <el-dialog
        title="上传文件"
        :visible.sync="uploadDialogOpen"
        width="50%"
        center
        class="upload-container"
        append-to-body
    >
      <el-upload
          ref="upload"
          class="drag-upload-container"
          drag
          action="api/media/upload"
          multiple
          :headers="{authorization:$store.getters['user/getToken']}"
          :before-upload="handleBeforeUpload"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="handleUploadFileChange"
          :on-progress="handleUploadFileProgress"
          :on-success="handleUploadFileSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传不超过300MB的文件</div>
      </el-upload>
      <div class="upload-file-list-container" v-if="uploadFileList.length>0">
        <div class="list-header">
          <div class="left-wrap">
            <div class="title">
              传输列表
            </div>
          </div>
          <div class="right-wrap">
            <div class="operation">
              <el-button size="mini" @click="startUploadAll">全部开始</el-button>
              <!--              <el-button size="mini">全部暂停</el-button>-->
              <el-button size="mini" @click="cancelUploadAll">全部取消</el-button>
            </div>
          </div>
        </div>
        <div class="upload-file-list">
          <div class="file-item" v-for="item in uploadFileList" :key="item.uid">
            <div class="left-wrap">
              <div class="icon">
                <svg-icon :name="getTypeIcon(item.raw.type.split('/')[0])"/>
              </div>
              <div class="info">
                <div class="title">{{ item.name }}</div>
                <div class="size">
                  <span class="loaded">0B</span>
                  /
                  <span class="total">{{ fileSizeByteToM(item.size, 2) }}</span>
                </div>
              </div>
            </div>
            <div class="right-wrap">
              <!--            <div class="speed">30MB/S</div>-->
              <div class="progress">
                <div class="bar" :style="`--percentage:${item.percentage}%`"></div>
                <div class="status">{{ getUploadFileStatus(item.status) }}</div>
              </div>
              <!--              <div class="operation">-->
              <!--                <el-button trpe="primary" circle>-->
              <!--                  <svg-icon name="play" style="width: 1rem;height: 1rem;"/>-->
              <!--                </el-button>-->
              <!--                <el-button type="danger" circle icon="el-icon-close"/>-->
              <!--              </div>-->
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
        @close="handleDialogClose"
        :visible.sync="viewDialogOpen"
        width="75%"
        center
        class="viewer-container"
        append-to-body
    >
      <MediaPreview :id="viewId" :isEdit="isEdit" @get-instance="getInstance" v-if="viewDialogOpen"
                    @fileInfoSaved="getFileList"/>
    </el-dialog>
  </div>
</template>

<script>
import ToolBar from "./ToolBar";
import MediaCard from "@/components/MediaCard/index.vue";
import BaseBar from "@/components/BaseBar/index.vue";
import MediaDetails from "@/views/Media/MediaList/MediaDetails/index.vue";
import MediaPreview from "@/views/Media/MediaList/MediaPreview/index.vue";
import BasePagination from "@/components/BasePagination/index.vue";
import file2md5 from "file2md5";
import {deleteFiles, requestFileListPage, requestFileType, requestFolderInfo} from "@/api/media";
import BaseImage from "@/components/BaseImage/index.vue";
import {createPopMenu} from "@/utils";
import {fileSizeByteToM, imageSrcHandler} from "@/utils/fileUtils";

export default {
  name: "MediaList",
  components: {BaseImage, BasePagination, MediaPreview, MediaDetails, BaseBar, MediaCard, ToolBar},
  data() {
    return {
      instance: null,
      uploadDialogOpen: false,
      viewDialogOpen: false,
      uploadFileList: [],
      loading: false,
      folder: null,
      loadImages: 0,
      list: [],
      checkedList: [],
      current: 1,
      size: 10,
      pageNum: 0,
      total: 0,
      rightMenu: {
        single: [
          {
            title: "打开",
            icon: "el-icon-folder-opened",
            operation: this.operations("view")
          },
          {
            title: "编辑",
            icon: "el-icon-edit",
            operation: this.operations("edit")
          },
          {
            title: "复制",
            icon: "el-icon-document-copy",
            operation: this.operations("copy")
          },
          {
            title: "移动",
            icon: "el-icon-rank",
            operation: this.operations("move")
          },
          {
            title: "删除",
            icon: "el-icon-delete-solid",
            operation: this.operations("delete")
          },
        ],
        multiple: [
          {
            title: "复制",
            icon: "el-icon-document-copy",
            operation: this.operations("copy")
          },
          {
            title: "移动",
            icon: "el-icon-rank",
            operation: this.operations("move")
          },
          {
            title: "删除",
            icon: "el-icon-delete-solid",
            operation: this.operations("delete")
          },
        ],
        default: [
          {
            title: "查看",
            operation: this.operations("viewMode")
          },
          {
            title: "排序方式",
            operation: this.operations("order")
          },
        ]
      },
      filter: {
        cid: null,
        type: [],
        keyword: ""
      },
      options: [],
      props: {
        lazy: true,
        checkStrictly: true,
        async lazyLoad(node, resolve) {
          const {data, level} = node;
          let fid = 0;
          if (level !== 0)
            fid = data.id;
          let res = await requestFileType({fid, lazy: true})
          resolve(res.data);
        }
      },
      uploadFileData: {
        md5: "",
        folderId: -1
      },
      viewId: -1,
      isEdit: false
    }
  },
  methods: {
    fileSizeByteToM,
    handleUploadFileChange(file, fileList) {
      console.log(file, fileList)
      this.uploadFileList = fileList.reverse();
      console.log(this.uploadFileList)
    },
    computeWaterfallArray(arr) {
      let clientWidth = document.body.clientWidth;
      let columnCount = 1;
      if (clientWidth > 1400) {
        columnCount = 5;
      } else if (clientWidth > 992) {
        columnCount = 4;
      } else if (clientWidth > 768) {
        columnCount = 3
      } else if (clientWidth > 576) {
        columnCount = 2;
      } else {
        columnCount = 1;
      }
      let waterfallArray = [];
      for (let i = 0; i < columnCount; i++) {
        waterfallArray[i] = [];
      }
      for (let i = 0; i < arr.length; i++) {
        waterfallArray[i % columnCount].push(arr[i]);
      }
      this.waterfallArray = waterfallArray;
    },
    calculateColumn() {
      this.$nextTick(() => {
        let container = this.$refs.mediaCardList;
        if (!container) {
          return;
        }
        let imageWidth = 200;
        let containerWidth = container.clientWidth;
        let columns = Math.floor(containerWidth / imageWidth);
        columns = columns > 1 ? columns : 2;
        let spaceNumber = columns + 1;
        let leftSpace = containerWidth - columns * imageWidth;
        let space = leftSpace / spaceNumber;
        let nextTops = new Array(columns).fill(0);
        for (let i = 0; i < container.children.length; i++) {
          let child = container.children[i];
          let minTop = Math.min.apply(null, nextTops)
          child.style.top = minTop + 'px';
          let index = nextTops.indexOf(minTop);
          nextTops[index] += child.clientHeight + space;
          let left = (index + 1) * space + index * imageWidth;
          child.style.left = left + "px";
        }
        let max = Math.max.apply(null, nextTops);
        container.style.height = max + "px";
      })
    },
    getFileList() {
      this.loadImages = 0;
      requestFileListPage({current: this.current, size: this.size, ...this.filter}).then(res => {
        let {pageNum, records, total} = res.data;
        this.pageNum = pageNum;
        this.list = records.map(item => {
          item.thumb = imageSrcHandler(item.thumb)
          return item;
        })
        this.total = total;
        // this.$nextTick(() => {
        //   this.calculateColumn();
        //   this.loading = false;
        // })
      }).catch(error => {
        console.log(error);
        this.loading = false;
      })
    },
    handleUploadDialogOpen() {
      this.uploadDialogOpen = true;
    },
    loadThumb() {
      this.loadImages++;
    },
    isChecked(value) {
      return this.checkedList.indexOf(value) !== -1;
    },
    handleItemClick(id) {
      this.viewId = id;
      this.viewDialogOpen = true;
      this.isEdit = false;
    },
    itemCheckToggle(id, value) {
      let index = this.checkedList.indexOf(id);
      if (index === -1) {
        this.checkedList.push(id);
      } else {
        if (!value)
          this.checkedList.splice(index, 1)
      }
    },
    handleItemRightClick(id, e) {
      if (this.checkedList.length > 1) {
        createPopMenu(e.x, e.y, this.rightMenu.multiple);
      } else {
        this.checkedList.splice(0);
        this.itemCheckToggle(id, true);
        createPopMenu(e.x, e.y, this.rightMenu.single);
      }
    },
    createDefaultRightMenu(e) {
      e.preventDefault();
      createPopMenu(e.x, e.y, this.rightMenu.default);
    },
    operations(command) {
      let fun = null;
      switch (command) {
        case "view":
          fun = () => {
            this.viewId = this.checkedList[0];
            this.viewDialogOpen = true;
            this.isEdit = false;
            console.log("查看文件", this.checkedList[0]);
          };
          break;
        case "edit":
          fun = () => {
            this.viewId = this.checkedList[0];
            this.viewDialogOpen = true;
            this.isEdit = true;
            console.log("编辑文件", this.checkedList[0]);
          };
          break;
        case "copy":
          fun = () => {
            console.log("复制文件", this.checkedList);
          };
          break;
        case "move":
          fun = () => {
            console.log("移动文件", this.checkedList);
          };
          break;
        case "delete":
          fun = () => {
            this.$confirm(this.checkedList.length > 1 ? '此操作将永久删除这些文件, 是否继续?' : '此操作将永久删除该文件, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'danger'
            }).then(() => {
              deleteFiles(this.checkedList).then(res => {
                this.$message({
                  type: 'success',
                  message: res.message
                });
              })
            }).finally(() => {
              this.getFileList(this.folder.id);
            });
          };
          break;
        case "viewMode":
          fun = () => {
            console.log("viewMode");
          };
          break;
        case "order":
          fun = () => {
            console.log("order");
          }
          break;
      }
      return fun;
    },
    onSubmit() {
      this.getFileList();
      this.calculateColumn();
    },
    async handleBeforeUpload(file) {
      // try {
      //   this.uploadFileData.md5 = await file2md5(file, {chunkSize: 3 * 1024 * 1024});
      //   this.uploadFileData.folderId = this.folder.id;
      // } catch (e) {
      //   console.error('error', e);
      //   return false;
      // }
      return true;
    },
    handleUploadFileProgress(event, file, fileList) {
      console.log(event, file, fileList);
    },
    handleUploadFileSuccess() {
      this.getFileList();
    },
    getTypeIcon(type) {
      console.log(type)
      let icon = "type-unknown";
      switch (type) {
        case "video":
          icon = "type-video";
          break;
        case "image":
          icon = "type-image";
          break;
        case "audio":
          icon = "type-audio";
          break;
      }
      return icon;
    },
    getUploadFileStatus(status) {
      switch (status) {
        case "ready":
          return "已就绪";
        case "uploading":
          return "上传中";
        case "success":
          return "已完成";
        case "cancel":
          return "已取消";
      }
    },
    startUploadAll() {
      this.$refs.upload.submit();
    },
    pauseUploadAll() {

    },
    cancelUploadAll() {
      this.uploadFileList.forEach(item => {
        this.$refs.upload.abort(item);
        item.status = "cancel";
        item.percentage = 0;
      });
    },
    getInstance(instance) {
      this.instance = instance;
    },
    handleDialogClose() {
      if (this.instance) {
        this.instance.destroy();
      }
    },
    handleSizeChange(size) {
      this.size = size;
      this.current = 1;
      this.getFileList();
    },
  },
  props: {},
  computed: {
    path() {
      return this.$route.query.paht;
    },
  },
  watch: {
    loadImages(value) {
      if (value === this.list.length) {
        this.calculateColumn();
        this.loading = false;
      }
    },
    current() {
      this.getFileList(this.folder.id);
    }
  },
  mounted() {
    this.getFileList();
    // window.addEventListener("resize", this.calculateColumn);
    // document.querySelector(".page-content").addEventListener("resize", this.calculateColumn)
    document.querySelector(".page-content").oncontextmenu = this.createDefaultRightMenu;
    let observer = new ResizeObserver(this.calculateColumn);
    observer.observe(this.$refs.mediaCardList);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.calculateColumn);
  }
}
</script>

<style lang="less" scoped>
//.form {
//  margin-bottom: -22px;
//}

.container {
  .media-card-list-container {
    height: calc(100vh - var(--back-header-height) - var(--padding-y) - var(--margin-y) - 18rem);
    overflow: auto;
  }

  .media-card-list {
    position: relative;

    .media-item {
      position: absolute;
      width: 200px;
      padding: var(--padding-y) var(--padding-x);
      border-radius: .5rem;
      cursor: pointer;

      &:hover {
        .media-item-header {
          opacity: 1;
        }

        background-color: var(--bg-light-primary);
      }

      &.is-checked {
        .media-item-header {
          opacity: 1;
        }

        background-color: var(--bg-dark-light-primary);
      }

      .media-thumb-wrap {
        border-radius: .5rem;
        overflow: hidden;
        position: relative;

        .type-icon {
          position: absolute;
          right: .5rem;
          top: .5rem;
          width: 2rem;
          height: 2rem;
          z-index: 2;
        }

        :deep(.base-image-container) {
          .image-slot {
            min-height: 150px;
          }
        }

        & > * {
          display: block;
        }

      }

      .media-item-header {
        opacity: 0;
        margin-bottom: var(--padding-y);
      }

      .media-info-wrap {
        max-width: 100%;
        text-align: center;

        .title {
          line-height: 18px;
          font-size: 12px;
          margin-top: 8px;
          color: #03081a;
          overflow: hidden;
          max-height: 36px;
          word-break: break-all;
          text-overflow: ellipsis;
        }

        .date {
          font-size: 12px;
          color: #818999;
          line-height: 18px;
          margin-top: 2px;
        }
      }
    }
  }
}

.upload-container {
  //width: 100%;
  user-select: none;

  .drag-upload-container {
    :deep(.el-upload) {
      width: 100%;
      height: unset;
      line-height: unset;

      .el-upload-dragger {
        width: 100%;
      }

      .el-upload-list {
        display: none;
      }
    }
  }

  .upload-file-list-container {
    .list-header {
      padding: var(--padding-y) 0;
      border-bottom: 1px solid var(--panel-border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left-wrap {
        .title {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 1px;
        }
      }

      .right-wrap {

      }
    }

    .upload-file-list {
      max-height: 244px;
      overflow: auto;
      border-bottom: 1px solid var(--panel-border-color);


      .file-item {
        padding: var(--padding-y) var(--padding-x);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid var(--panel-border-color);

        &:first-child {
          border-top-width: 0;
        }

        .left-wrap {
          display: flex;
          align-items: center;

          .icon {
            width: 3rem;
            height: 3rem;
            margin-right: var(--padding-x);
          }

          .info {
            .title {
              font-size: 14px;
              color: var(--text-default-color);
            }

            .size {
              font-size: 12px;
              color: var(--text-light-color);
            }
          }
        }

        .right-wrap {
          display: flex;
          align-items: center;

          .speed {
            margin-right: var(--padding-x);
            font-size: 14px;
            color: var(--text-default-color);
          }

          .progress {
            margin-right: var(--padding-x);

            .bar {
              margin-bottom: 2px;
              width: 100%;
              min-width: 150px;
              height: 20px;
              background-color: var(--bg-light-primary);
              background: var(--bg-light-primary) -webkit-linear-gradient(left, var(--bg-dark-primary), var(--bg-dark-primary)) no-repeat 0 0;
              background-size: var(--percentage) 100%;
              transition: all .5s linear;
            }

            .status {
              font-size: 12px;
              color: var(--text-light-color);
            }
          }

          .operation {
            display: flex;
            align-items: center;

          }
        }
      }
    }
  }

}

.viewer-container {
  max-height: 100%;
  overflow: auto;
}

</style>
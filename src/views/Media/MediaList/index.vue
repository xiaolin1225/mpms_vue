<template>
  <div class="container" v-loading="loading">
    <div class="card">
      <ToolBar v-model="path" @change="handlePathChange" @handleUploadButtonClick="isUploadDialogOpen = true"
               @handleDropdownClick="handleDropdownClick"/>
    </div>
    <!--    <div class="fitter-bar mt p">-->
    <!--      <BaseBar>-->
    <!--        <template #left>-->
    <!--          <span v-show="checkedMode">已选择 <span class="emphasize">{{ checkedItemsLength }}</span> 项，共 <span-->
    <!--              class="emphasize">{{ list.length }}</span> 项</span>-->
    <!--          <el-button :type="allChecked?'primary':''" round @click="checkedAll" class="ml"-->
    <!--                     v-show="checkedMode">全选-->
    <!--          </el-button>-->
    <!--        </template>-->
    <!--        <template #right>-->
    <!--          <el-button :type="checkedMode?'primary':''" icon="el-icon-success" round @click="changeCheckMode">批量操作-->
    <!--          </el-button>-->
    <!--          <el-dropdown class="ml" trigger="click" @command="changeDisplayType">-->
    <!--            <span class="el-dropdown-link">-->
    <!--              <span class="mode-icon"><SvgIcon :name="displayType === 'card' ? 'card-mode' : 'list-mode'"/></span>-->
    <!--              {{ displayType === 'card' ? '卡片模式' : '列表模式' }}-->
    <!--              <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
    <!--            </span>-->
    <!--            <el-dropdown-menu slot="dropdown">-->
    <!--              <el-dropdown-item command="card" v-show="displayType!=='card'">-->
    <!--                <span class="mode-icon" style="display: inline-block;width: 14px;height: 14px;">-->
    <!--                  <SvgIcon name="card-mode"/>-->
    <!--                </span> 卡片模式-->
    <!--              </el-dropdown-item>-->
    <!--              <el-dropdown-item command="list" v-show="displayType!=='list'">-->
    <!--                <span class="mode-icon" style="display: inline-block;width: 14px;height: 14px;">-->
    <!--                  <SvgIcon name="list-mode"/>-->
    <!--                </span> 列表模式-->
    <!--              </el-dropdown-item>-->
    <!--            </el-dropdown-menu>-->
    <!--          </el-dropdown>-->

    <!--        </template>-->
    <!--      </BaseBar>-->
    <!--    </div>-->
    <div class="card mt file-list-container" v-show="displayType==='list'">
      <el-table
          :data="list"
          ref="fileListTable"
          @selection-change="itemCheckedToggle"
      >
        <el-table-column
            type="selection"
            width="55"
            :selectable="()=>checkedMode"
        >
        </el-table-column>
        <el-table-column
            prop="title"
            label="内容详情"
            min-width="300px"
        >
          <template v-slot="scope">
            <MediaCard :content="scope.row" class="list-item-card"/>
          </template>
        </el-table-column>
        <el-table-column
            prop="type.name"
            label="文件类型"
            width="150"
            align="center">
        </el-table-column>
        <el-table-column
            prop="suffix"
            label="后缀名"
            width="150"
            align="center">
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            width="200"
            align="center">
        </el-table-column>
        <el-table-column
            prop="id"
            label="操作"
            width="200"
            align="center">
          <template v-slot="scope">
            <el-tooltip class="opt-btn-tip" content="预览" placement="top">
              <el-button icon="el-icon-view" circle @click="itemClick(scope.row)"/>
            </el-tooltip>
            <el-tooltip class="opt-btn-tip" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle @click="editItem(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip class="opt-btn-tip" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteItem(scope.row.id)"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--        <BasePagination v-model="current" :page-num="pageNum" :total="total" @size-change="handleSizeChange"/>-->
      </el-table>
    </div>
    <div class="media-card-list mt" ref="mediaCardList" v-show="displayType==='card'">
      <div class="card-column" v-for="(item,index) in waterfallArray" :key="index">
        <div class="card-item back-item" v-if="parentFolder&&index===0">
          <MediaCard :content="parentFolder" @itemClick="itemClick"/>
        </div>
        <div class="card-item" v-for="citem in waterfallArray[index]" :key="citem.id">
          <div class="card-item-opt-container" :class="citem.isDir?'is-dir':''" v-show="!checkedMode">
            <el-tooltip class="opt-btn-tip" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click="editItem(citem.id)"/>
            </el-tooltip>
            <el-tooltip class="opt-btn-tip" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="deleteItem(citem.id)"/>
            </el-tooltip>
          </div>
          <MediaCard :content="citem" :checkedMode="checkedMode" :checked="isItemChecked(citem.id)"
                     @itemClick="itemClick"/>
        </div>

      </div>
    </div>
    <BasePagination v-model="current" :page-num="pageNum" :total="total" :page-size="size"
                    @size-change="handleSizeChange" class="mt"/>
    <el-dialog
        v-if="viewMode"
        :modal-append-to-body="false"
        :visible.sync="viewMode"
        fullscreen
        :title="tempItemContent.title"
        center
    >
      <MediaPreview :content="tempItemContent" @get-instance="getInstance"/>
    </el-dialog>

    <el-dialog
        v-if="isDialogOpen"
        title="文件详情"
        :visible.sync="isDialogOpen"
        width="80%"
        center>
      <MediaDetails ref="MediaDetails" :content="tempItemContent" @closeDialog="isDialogOpen = false;"
                    @get-instance="getInstance"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isDialogOpen = false">取 消</el-button>
        <el-button type="primary"
                   @click="$refs.MediaDetails.saveFileInfo();">保 存</el-button>
      </span>
    </el-dialog>

    <el-dialog
        :visible.sync="isUploadDialogOpen"
        title="上传文件"
        center>
      <el-upload
          class="upload-container"
          drag
          action="/api/file/upload"
          multiple
          :file-list="uploadFileList"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess"
          :data="uploadFileData"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">单个文件大小不超过300MB</div>
      </el-upload>
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
import {createFolder, deleteFile, requestFileList, requestFolderInfo, saveFileInfo} from "@/api/file";

export default {
  name: "MediaList",
  components: {BasePagination, MediaPreview, MediaDetails, BaseBar, MediaCard, ToolBar},
  data() {
    return {
      list: [],
      checkedMode: false,
      displayType: "card",
      waterfallArray: [],
      checkedItems: [],
      allChecked: false,
      isDialogOpen: false,
      isUploadDialogOpen: false,
      tempItemContent: {},
      playerInstance: null,
      viewMode: false,
      uploadFileList: [],
      uploadFileData: {},
      path: "/资源库",
      lastPath: "/资源库",
      parentFolder: null,
      current: 1,
      pageNum: 0,
      size: 10,
      total: 0,
      loading: false,
      folder: {}
    }
  },
  methods: {
    handleDropdownClick(command) {
      switch (command) {
        case "create":
          this.$prompt('请输入文件夹名称', '新建文件夹', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
            inputErrorMessage: '文件夹名称不能为空'
          }).then(({value}) => {
            createFolder({title: value, folderId: this.folder.id}).then(res => {
              this.$message.success(res.message);
              this.getFolderInfo();
            })
          });
          break;
        case "upload":
          this.isUploadDialogOpen = true;
          break;
      }
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
    onSubmit() {
      console.log(this.form)
    },
    changeCheckMode() {
      this.checkedMode = !this.checkedMode;
    },
    changeDisplayType(type) {
      this.displayType = type;
      // this.checkedMode = false;
    },
    itemCheckedToggle(content) {
      if (content instanceof Array) {
        this.checkedItems = content;
      } else {
        let index = this.checkedItems.findIndex(item => item.id === content.id);
        if (index === -1) {
          this.checkedItems.push(content);
          this.$refs.fileListTable.toggleRowSelection(content, true);
        } else {
          this.checkedItems.splice(index, 1);
          this.$refs.fileListTable.toggleRowSelection(content, false);
        }
      }
    },
    itemClick(isDir, content) {
      if (isDir) {
        this.path = content.path;
        this.handlePathChange();
      } else {
        if (this.checkedMode && this.displayType === 'card') {
          this.itemCheckedToggle(content);
        } else {
          this.playerInstance = null;
          this.setTempItemContent(content);
          this.viewMode = true;
        }
      }
    },
    isItemChecked(id) {
      let index = this.checkedItems.findIndex(item => item.id === id);
      return index !== -1;
    },
    checkedAll() {
      this.$refs.fileListTable.toggleAllSelection();
      if (this.allChecked) {
        this.checkedItems = [];
      } else {
        this.checkedItems = {...this.list}
      }
    },
    editItem(id) {
      let content = this.list.find(item => item.id === id);
      if (content.isDir) {
        this.$prompt('请输入文件夹名称', '修改文件夹名称', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
          inputErrorMessage: '文件夹名称不能为空'
        }).then(({value}) => {
          let data = {title: value};
          saveFileInfo(content.id, data);
        });
      } else {
        this.tempItemContent = {...content}
        this.isDialogOpen = true;
      }
    },
    deleteItem(id) {
      this.$confirm('此操作将永久删除该文件/文件夹, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFile(id).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // this.getFileList();
        }).finally(() => {
          this.getFolderInfo();
        })
      });
    },
    getInstance(instance) {
      this.playerInstance = instance;
    },
    setTempItemContent(content) {
      this.tempItemContent = null;
      this.tempItemContent = {...content};
    },
    clearTempContent(value) {
      if (!value) {
        this.tempItemContent = {};
        if (this.playerInstance) {
          this.playerInstance.destroy();
          this.playerInstance = null;
        }
      }
    },
    async handleBeforeUpload(file) {
      try {
        const md5 = await file2md5(file, {chunkSize: 3 * 1024 * 1024});
        this.uploadFileData.md5 = md5;
        this.uploadFileData.folderId = this.folder.id;
      } catch (e) {
        console.error('error', e);
        return false;
      }
      return true;
    },
    handlePathChange() {
      if (this.path === this.lastPath)
        return;
      this.getFolderInfo().then(() => {
        this.lastPath = this.path;
        this.getFileList();
      }).catch(() => {
        this.path = this.lastPath;
        this.handlePathChange();
      })
    },
    async getFileList() {
      this.loading = true;
      const res = await requestFileList({current: this.current, size: this.size, path: this.path})
      const page = res.data;
      this.current = page.current;
      this.pageNum = page.pageNum;
      this.total = page.total;
      this.list = page.records;
      if (this.folder.folderId !== 0) {
        let folderRes = await requestFolderInfo({id: this.folder.folderId});
        this.parentFolder = folderRes.data;
        this.parentFolder.title = "返回上一级目录"
        this.parentFolder.thumb = "http://localhost/file/ee7c2165aae94d0fb37b89dd562d5ad9";
      } else {
        this.parentFolder = null;
      }
      this.computeWaterfallArray(this.list);
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      this.getFileList();
    },
    async getFolderInfo(path) {
      const res = await requestFolderInfo({path: path ? path : this.path}).catch(() => {
        this.$message({
          type: 'error',
          message: '数据获取失败，请稍后重试'
        });
        this.loading = false;
      });
      this.folder = res.data;
      await this.getFileList();
    },
    handleUploadSuccess(response, file, fileList) {
      console.log("response", response);
      console.log("file", file);
      console.log("fileList", fileList);
      setTimeout(() => {
        this.getFileList();
      }, 2000);
    },
    handleWindowWidthResize() {
      this.computeWaterfallArray(this.list);
    }
  },
  computed: {
    checkedItemsLength() {
      return this.checkedItems.length;
    },
    // path: {
    //   get() {
    //     return this.$route.query.path;
    //   },
    //   set(val) {
    //     this.$router.push({
    //       path: "/back/media",
    //       params: {lastPath: this.path},
    //       query: {path: val}
    //     }).finally(() => {
    //     });
    //   }
    // }
  },
  watch: {
    current(newVal, oldVal) {
      if (newVal !== oldVal)
        this.getFileList();
    },
    checkedMode(value) {
      if (!value) {
        this.checkedItems = [];
        this.$refs.fileListTable.clearSelection();
      }
    },
    checkedItemsLength(length) {
      this.allChecked = length === this.list.length;
    },
    isDialogOpen(value) {
      this.clearTempContent(value);
    },
    viewMode(value) {
      this.clearTempContent(value);
    }
  },
  mounted() {
    this.getFolderInfo();
    window.addEventListener("resize", this.handleWindowWidthResize);
    // let path = this.$route.query.path;
    // if (path && path.trim().length > 0) {
    //   this.path = path;
    // } else {
    //   this.$router.push({
    //     path: "/back/media",
    //     params: {lastPath: this.path},
    //     query: {path: "/资源库"}
    //   }).then((res) => {
    //     console.log(res)
    //   })
    // }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowWidthResize);
  }
}
</script>

<style lang="less" scoped>
.file-list-container {
  .list-item-card {
    width: 300px;
  }
}

.fitter-bar {

  .el-button,
  .el-button:focus {
    color: var(--text-light-color);
    background-color: var(--panel-background-color);
  }

  .el-button--primary:focus,
  .el-button--primary {
    color: var(--text-white);
    background-color: var(--text-primary-color);
  }

  .el-dropdown-link {
    color: var(--text-light-color);

    .mode-icon {
      display: inline-block;
      width: 14px;
      height: 14px;
    }
  }

}


.media-card-list {
  display: flex;

  .card-column {
    width: 20%;
    display: flex;
    flex-direction: column;
    margin-left: var(--margin-x);

    &:first-child {
      margin-left: 0;
    }
  }

  .card-item {
    position: relative;
    margin-top: var(--margin-y);
    cursor: pointer;

    &:first-child {
      margin-top: 0;
    }

    .card-item-opt-container {
      display: none;
      position: absolute;
      bottom: .5rem;
      right: .5rem;
      z-index: 2;
    }

    .card-item-opt-container.is-dir {
      //bottom: .5rem;
      right: calc(50% - 2rem);
    }

    &:hover .card-item-opt-container {
      display: block;
    }

    //margin-left: var(--margin-x);
  }

  .card-item.back-item {
    :deep(.container) {
      .file-detail-container {
        bottom: 15px;

        .title {
          color: #77d1ff;
        }
      }
    }
  }
}


.upload-container {
  width: 100%;

  :deep(.el-upload) {
    width: 100%;

    .el-upload-dragger {
      width: 100%;
    }
  }
}

@media screen and (max-width: 1400px) {
  .card-column {
    width: 25% !important;
  }
}

@media screen and (max-width: 992px) {
  .card-column {
    width: 33.3333% !important;
  }
}

@media screen and (max-width: 768px) {
  .card-column {
    width: 50% !important;
  }
}

@media screen and (max-width: 576px) {
  .card-column {
    width: 100% !important;
  }
}
</style>
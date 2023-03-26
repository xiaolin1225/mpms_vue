<template>
  <div class="file-select-container">
    <div class="folder-list">
      <div class="folder-item" :class="item.id === currentFolder?'selected':''" v-for="item in folderList"
           :key="item.id">
        <span class="title">{{ item.title }}</span>
      </div>
    </div>
    <div class="file-list-container">
      <div class="toolbar">
        <BaseBar>
          <template #left>
            <span v-if="selectedList.length>0&&multiple">已选择 <span class="emphasize">{{ selectedList.length }}</span> 项</span>
          </template>
          <template #right>
            <el-button type="primary" @click="uploadDialogVisible=true">上传文件</el-button>
          </template>
        </BaseBar>
        <el-dialog
            title="上传文件"
            :visible.sync="uploadDialogVisible"
            width="30%"
            append-to-body
            center>
          <DragUpload @success="handleUploadSuccess">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip">文件大小不超过300MB</div>
          </DragUpload>
        </el-dialog>
      </div>
      <div class="file-list">
        <div class="file-item" :class="isFileSelected(item.id)?'selected':''" v-for="item in fileList" :key="item.id"
             @click="handleItemClick(item.id)" :title="item.title">
          <div class="thumb"
               :style="`background-image:url(${item.thumb})`"></div>
          <div class="title">{{ item.title }}</div>
        </div>
        <div class="clearfix"></div>
      </div>
      <BasePagination v-model="current" :page-num="pageNum" :total="total" :page-size="size"
                      @size-change="handleSizeChange" class="mt card"/>
    </div>
  </div>
</template>

<script>
import {requestFileList, requestFolderList} from "@/api/file";
import BaseBar from "@/components/BaseBar/index.vue";
import DragUpload from "@/components/DragUpload/index.vue";
import BasePagination from "@/components/BasePagination/index.vue";

export default {
  name: "FileSelect",
  components: {BasePagination, DragUpload, BaseBar},
  data() {
    return {
      currentFolder: -1,
      selectedList: [],
      folderList: [],
      fileList: [],
      current: 1,
      pageNum: 0,
      total: 0,
      size: 20,
      folderCurrentPage: 1,
      folderPageNum: 0,
      folderTotal: 0,
      folderPageSize: 10,
      uploadDialogVisible: false
    }
  },
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    type: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getFolderList() {
      requestFolderList({current: this.folderCurrentPage, size: this.folderPageSize}).then(res => {
        let {records, total, pages} = res.data;
        this.folderList = records;
        this.folderTotal = total;
        this.folderPageNum = pages;
        if (records[0]) {
          this.currentFolder = records[0].id;
          this.getFileList(this.currentFolder);
        }
      })
    },
    async getFileList(fid) {
      let res = await requestFileList({fid, type: this.type, current: this.current, size: this.size});
      let {records, total, pages} = res.data;
      this.fileList = records;
      this.total = total;
      this.pageNum = pages;
    },
    handleItemClick(id) {
      let index = this.selectedList.findIndex(item => item.id === id);
      if (index !== -1) {
        this.selectedList.splice(index, 1);
      } else {
        if (!this.multiple) {
          this.selectedList = []
        }
        this.selectedList.push(this.fileList.find(item => item.id === id));
      }
      this.$emit("input", this.selectedList);
    },
    isFileSelected(id) {
      let index = this.selectedList.findIndex(item => item.id === id);
      return index !== -1;
    },
    handleSizeChange(size) {
      this.size = size;
      this.current = 1;
      this.getFileList(this.currentFolder);
    },
    handleUploadSuccess(res) {
      console.log(res);
      this.current = 1;
      setTimeout(async () => {
        await this.getFileList(this.currentFolder);
        this.selectedList.push(this.fileList[0]);
        this.$message.success("上传成功");
      }, 1000);
      this.uploadDialogVisible = false;
    }
  },
  computed: {},
  watch: {
    value(value) {
      this.selectedList = value;
    },
    current() {
      this.getFileList(this.currentFolder);
    }
  },
  mounted() {
    this.getFolderList();
  }
}
</script>

<style lang="less" scoped>
.file-select-container {
  height: 100%;
  display: flex;
  align-items: stretch;
  align-content: stretch;

  .folder-list {
    flex-shrink: 0;
    width: 200px;
    border-right: 1px solid var(--panel-border-color);
    height: 100%;


    .folder-item {
      padding: var(--padding-y) var(--padding-x);
      cursor: pointer;
      line-height: 20px;

      .title {
        font-size: 16px;
      }

      .count {
        font-size: 12px;
        color: var(--text-light-color);
        vertical-align: middle;
      }

      &.selected {
        background-color: var(--bg-dark-light-primary);

        &:hover {
          background-color: var(--bg-dark-light-primary);
        }
      }

      &:hover {
        background-color: var(--bg-light-primary);
      }
    }
  }

  .file-list-container {
    flex-grow: 1;
    margin-left: var(--margin-x);

    .toolbar {
      margin-bottom: var(--margin-y);
    }

    .file-list {
      margin-bottom: -20px;
      margin-right: -13px;

      .file-item {
        width: 110px;
        cursor: pointer;
        float: left;
        margin: 0 13px 20px 0;

        .thumb {
          width: 110px;
          height: 110px;
          //border: 2px solid var(--panel-border-color);
          border: 2px solid transparent;
          border-radius: .5rem;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }

        .title {
          width: 110px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-top: var(--padding-y);
          text-align: center;
        }

        &:hover {
          .thumb {
            border-color: var(--panel-border-hover-color);
          }
        }

        &.selected {
          .thumb {
            position: relative;
            border-color: var(--panel-border-primary-color);
            //box-shadow: 0 0 0 2px var(--bg-dark-light-primary) inset;

            &:before {
              content: "";
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              background-color: var(--bg-dark-primary);
              opacity: .1;
            }
          }

          &:hover {
            .thumb {
              border-color: var(--panel-border-primary-color);
            }
          }
        }
      }
    }
  }
}
</style>
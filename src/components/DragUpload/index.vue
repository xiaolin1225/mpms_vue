<template>
  <div class="upload-container">
    <el-upload
        ref="upload"
        class="drag-upload-container"
        drag
        action="api/file/upload"
        multiple
        :data="uploadFileData"
        :before-upload="handleBeforeUpload"
        :show-file-list="false"
        :on-success="handleUploadFileSuccess"
        :file-list="fileList"
    >
      <slot name="content"></slot>
      <div class="el-upload__tip" slot="tip">
        <slot name="tip"></slot>
      </div>
    </el-upload>
  </div>
</template>

<script>
import file2md5 from "file2md5";

export default {
  name: "DragUpload",
  data() {
    return {
      uploadFileData: {
        md5: "",
        folderId: this.folderId
      },
      fileList: []
    }
  },
  props: {
    folderId: {
      type: Number,
      default: 3
    }
  },
  methods: {
    async handleBeforeUpload(file) {
      try {
        this.uploadFileData.md5 = await file2md5(file, {chunkSize: 3 * 1024 * 1024});
      } catch (e) {
        console.error('error', e);
        return false;
      }
      return true;
    },
    handleUploadFileSuccess(response, file, fileList) {
      this.$emit("success", response, file, fileList)
    },
  }
}
</script>

<style lang="less" scoped>
.upload-container {
  //width: 100%;
  //  user-select: none;

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
}
</style>
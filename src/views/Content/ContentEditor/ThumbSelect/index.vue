<template>
  <el-dialog
      :title="step===1?'选择封面':'裁切封面'"
      :visible.sync="fileSelectDialogVisible"
      width="60%"
      center
      style="z-index: 2"
      append-to-body
      @close="handleCloseDialog"
      v-if="fileSelectDialogVisible"
  >
    <FileSelect v-model="selectFile" type="image" v-show="step===1"/>
    <ThumbCropper ref="thumbCropper" :type="type" :src="tempImage" v-show="step===2"/>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCloseDialog">取 消</el-button>
      <el-button type="primary" @click="setThumb"
                 :disabled="step===1&&selectFile.length===0">{{ step === 1 ? '下一步' : '上一步' }}</el-button>
      <el-button type="success" v-if="step===2" @click="confirmThumb">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import FileSelect from "@/components/FileSelect/index.vue";
import ThumbCropper from "@/views/Content/ContentEditor/ThumbSelect/ThumbCropper/index.vue";
import {imageSrcHandler} from "@/utils/fileUtils";

export default {
  name: "ThumbSelect",
  components: {FileSelect, ThumbCropper},
  data() {
    return {
      step: 1,
      fileSelectDialogVisible: true,
      selectFile: [],
      tempImage: null,
      cropImage: null
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "wx2.35"
    }
  },
  watch: {
    visible(value) {
      this.fileSelectDialogVisible = value;
    }
  },
  methods: {
    handleCloseDialog() {
      this.fileSelectDialogVisible = false;
      this.$emit("close")
    },
    setThumb() {
      if (this.step === 1) {
        this.step = 2;
        this.tempImage = imageSrcHandler(this.selectFile[0].path);
      } else {
        this.step = 1;
      }
    },
    handleCropperConfirm(cropImage) {
      this.cropImage = cropImage;
    },
    confirmThumb() {
      this.$nextTick(() => {
        this.$refs.thumbCropper.getThumbImage().then(res => {
          this.$emit("confirm", res);
          this.fileSelectDialogVisible = false;
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
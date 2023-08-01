<template>
  <div>
    <el-row>
      <el-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixed="options.fixed"
            :fixedNumber="options.fixedNumber"
            :centerBox="options.centerBox"
            :fixedBox="options.fixedBox"
            :outputType="options.outputType"
            @realTime="realTime"
            v-if="visible"
        />
      </el-col>
      <el-col :xs="24" :md="12" :style="{height: '350px'}">
        <div class="avatar-preview-container">
          <div class="avatar-preview"
               :style="{ width: previews.w + 'px' , height: previews.h + 'px' , transform:`scale(calc(200 / ${previews.w}),calc(200 / ${previews.h}))`,  overflow: 'hidden', }"
               style="transform-origin:0 0">
            <img :src="previews.url" :style="previews.img"/>
          </div>
        </div>
      </el-col>
    </el-row>
    <br/>
    <el-row>
      <el-col :lg="2" :sm="3" :xs="3">
        <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
          <el-button size="small">
            选择
            <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </el-upload>
      </el-col>
      <el-col :lg="{span: 1, offset: 2}" :sm="2" :xs="2">
        <el-button icon="el-icon-plus" size="small" @click="changeScale(1)"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
        <el-button icon="el-icon-minus" size="small" @click="changeScale(-1)"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
        <el-button icon="el-icon-refresh-left" size="small" @click="rotateLeft()"></el-button>
      </el-col>
      <el-col :lg="{span: 1, offset: 1}" :sm="2" :xs="2">
        <el-button icon="el-icon-refresh-right" size="small" @click="rotateRight()"></el-button>
      </el-col>
      <el-col :lg="{span: 2, offset: 6}" :sm="2" :xs="2">
        <el-button type="primary" size="small" @click="confirm()">保 存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {VueCropper} from "vue-cropper";
import {debounce} from "@/utils";

export default {
  name: "AvatarCropper",
  components: {VueCropper},
  props: {
    // 头像地址
    src: {
      type: String,
      default: ""
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      options: {
        img: "", // 图片地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixed: true, // 是否固定截图框比例
        fixedNumber: [1, 1], // 截图框比例
        fixedBox: false, // 固定截图框大小 不允许改变
        centerBox: true, // 截图框是否被限制在图片里面
        outputType: "png" // 默认生成截图为PNG格式
      },
      previews: {},
      resizeHandler: null
    };
  },
  watch: {
    src: {
      handler: function (val) {
        this.options.img = val;
      },
      immediate: true
    },
  },
  computed: {},
  methods: {
    // 打开弹出层结束时的回调
    init() {
      this.visible = true;
      if (!this.resizeHandler) {
        this.resizeHandler = debounce(() => {
          this.refresh()
        }, 100)
      }
      window.addEventListener("resize", this.resizeHandler)
    },
    // 刷新组件
    refresh() {
      try {
        this.$refs.cropper.refresh();
      } catch (e) {
        console.log("cropper刷新失败：", e)
      }
    },
    // 覆盖默认的上传行为
    requestUpload() {
    },
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf("image/") === -1) {
        this.$message.error("文件格式错误，请上传图片类型文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.options.img = reader.result;
        };
      }
    },
    // 保存图片
    confirm() {
      this.$refs.cropper.getCropData(data => {
        this.$emit("cropper-confirm", data);
        this.refresh();
      });
    },
    // 实时预览
    realTime(data) {
      this.previews = data;
    },
    // 关闭裁剪控件
    remove() {
      console.log("头像裁剪关闭");
      this.options.img = this.src;
      this.visible = false;
      window.removeEventListener("resize", this.resizeHandler)
    }
  },
  mounted() {
    this.init();
  },
  destroyed() {
    this.remove();
  }
}
</script>

<style lang="less" scoped>
.avatar-preview-container {
  position: relative;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  -webkit-box-shadow: 0 0 4px #ccc;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;
}
</style>
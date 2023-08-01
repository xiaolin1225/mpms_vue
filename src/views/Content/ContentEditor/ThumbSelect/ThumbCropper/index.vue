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
        <!--        <div class="avatar-preview-container">-->
        <!--          <div class="avatar-preview"-->
        <!--               :style="{ width: previews.w + 'px' , height: previews.h + 'px' , transform:`scale(calc(200 / ${previews.w}),calc(200 / ${previews.h}))`,  overflow: 'hidden', }"-->
        <!--               style="transform-origin:0 0">-->
        <!--            <img :src="previews.url" :style="previews.img"/>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="image-preview-list">
          <div class="image-preview-item">
            <div class="image-container"
                 :style="`aspect-ratio:${currentPreview.aspectRatio[0]}/${currentPreview.aspectRatio[1]};`"
                 ref="previewWrap">
              <div class="crooper-image-wrap"
                   :style="{ width: previews.w + 'px' , height: previews.h + 'px' ,transform:previews.transform, overflow: 'hidden', }"
                   style="transform-origin:0 0">
                <img :src="previews.url" :style="previews.img" alt=""/>
              </div>
            </div>
            <div class="image-tip">
              <div class="title">{{ currentPreview.name }}</div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <br/>
    <el-row>
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
    },
    type: {
      type: String,
      default: "wx2.35"
    }
  },
  data() {
    return {
      visible: false,
      options: {
        img: "", // 图片地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 400, // 默认生成截图框宽度
        autoCropHeight: 400, // 默认生成截图框高度
        fixed: true, // 是否固定截图框比例
        fixedNumber: [2.35, 1], // 截图框比例
        fixedBox: false, // 固定截图框大小 不允许改变
        centerBox: true, // 截图框是否被限制在图片里面
        outputType: "png" // 默认生成截图为PNG格式
      },
      previews: {},
      resizeHandler: null,
      activePreviewIndex: 0,
      previewWrap: null,
      previewList: [{
        id: 1,
        aspectRatio: [2.35, 1],
        name: "图文封面（2.35:1）",
        url: "",
        type: "wx2.35"
      }, {
        id: 2,
        aspectRatio: [1, 1],
        name: "图文封面（1:1）",
        previewWrap: null,
        url: "",
        type: "wx1"
      },]
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
  computed: {
    currentPreview() {
      return this.previewList[this.activePreviewIndex];
    }
  },
  methods: {
    // 打开弹出层结束时的回调
    init() {
      this.activePreviewIndex = this.previewList.findIndex(item => item.type === this.type);
      this.options.fixedNumber = this.previewList[this.activePreviewIndex].aspectRatio;
      this.visible = true;
      this.$nextTick(() => {
        this.previewWrap = this.$refs[`previewWrap`];
      })
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
    // 保存图片
    confirm() {
      this.$refs.cropper.getCropData(data => {
        this.$emit("cropper-confirm", data);
      });
    },
    // 实时预览
    realTime(data) {
      data.transform = ``
      if (!this.$refs[`previewWrap`]) {
        this.previewWrap = this.$refs[`previewWrap`];
      }
      if (this.previewWrap) {
        let width = this.previewWrap.clientWidth;
        let height = this.previewWrap.clientHeight;
        data.transform = `scale(calc(${width} / ${data.w}),calc(${height} / ${data.h}))`
      }
      // console.log(previewWrap[0].clientWidth)
      this.previews = data;
    },
    // 关闭裁剪控件
    remove() {
      this.options.img = this.src;
      this.visible = false;
      window.removeEventListener("resize", this.resizeHandler)
    },
    getThumbImage() {
      return new Promise((resolve) => {
        this.$refs.cropper.getCropData(data => {
          resolve(data);
        });
      })
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

.image-preview-list {
  max-height: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 var(--padding-x);
  overflow-y: auto;

  .image-preview-item {
    width: 100%;
    padding: var(--padding-y) var(--padding-x);
    display: flex;
    align-items: center;

    .image-container {
      height: 80px;
      aspect-ratio: 2.35/1;
      background-color: #fff;
      margin-right: var(--margin-x);
      overflow: hidden;

      .preview-image-wrap {
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    .image-tip {
      color: var(--text-default-color);
    }
  }
}

:deep(.vue-cropper) {
  background-color: #fff;
  background-image: linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0), linear-gradient(45deg, #eee 25%, transparent 0, transparent 75%, #eee 0);
  background-size: 16px 16px;
  background-position: 0 0, 8px 8px;
}
</style>
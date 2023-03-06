<template>
  <el-image :src="imageSrc"
            :fit="imageFit"
            :alt="imageAlt"
            :referrer-policy="imageReferrerPolicy"
            :lazy="imageLazy"
            :scroll-container="imageScrollContainer"
            :preview-src-list="imagePreviewSrcList"
            :z-index="imageZIndex"
            :initial-index="imageInitialIndex"
            class="image"
            @load="imageLoad"
            @error="imageLoadError">
    <div slot="placeholder" class="image-slot">
      <i class="el-icon-loading"></i>
    </div>
    <div slot="error" class="image-slot">
      <i class="el-icon-picture-outline"></i>
    </div>
  </el-image>
</template>

<script>
export default {
  name: "BaseImage",
  data: () => ({
    imageSrc: "",
    imageFit: "contain",
    imageAlt: "",
    imageReferrerPolicy: "",
    imageLazy: false,
    imageScrollContainer: "",
    imagePreviewSrcList: [],
    imageZIndex: 9999,
    imageInitialIndex: 0,
    intervalId: null,
  }),
  props: {
    src: {
      type: String,
      default: () => ""
    },
    fit: {
      type: String,
      default: () => "contain"
    },
    alt: String,
    "referrer-policy": String,
    lazy: Boolean,
    scrollContainer: String,
    previewSrcList: Array,
    zIndex: Number,
    "initial-index": Number,
    option: Object,
  },
  computed: {},
  methods: {
    imageLoadError() {
      this.$emit("error");
    },
    imageLoad() {
      this.$emit("load");
    },
    setData() {
      if (this.option) {
        this.imageSrc = this.option.src;
        this.imageFit = this.option.fit;
        this.imageAlt = this.option.alt;
        this.imageReferrerPolicy = this.option.referrerPolicy;
        this.imageLazy = this.option.lazy;
        this.imageScrollContainer = this.option.scrollContainer;
        this.imagePreviewSrcList = this.option.previewSrcList;
        this.imageZIndex = this.option.zIndex;
        this.imageInitialIndex = this.option.initialIndex;
        return;
      }
      this.imageSrc = this.src;
      this.imageFit = this.fit;
      this.imageAlt = this.alt;
      this.imageReferrerPolicy = this.referrerPolicy;
      this.imageLazy = this.lazy;
      this.imageScrollContainer = this.scrollContainer;
      this.imagePreviewSrcList = this.previewSrcList;
      this.imageZIndex = this.zIndex;
      this.imageInitialIndex = this.initialIndex;
    },
  },
  mounted() {
    let tryTimes = 0;
    this.intervalId = setInterval(() => {
      if (this.option || this.src || tryTimes > 10) {
        clearInterval(this.intervalId);
        this.setData();
      }
      tryTimes++;
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
}
</script>

<style lang="less" scoped>
.image {
  width: 100%;
  height: 100%;
  user-select: none;

  .image-slot {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-default-color);
    background-color: var(--bg-dark-gray);
  }
}
</style>
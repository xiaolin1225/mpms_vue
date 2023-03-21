<template>
  <div class="base-image-container">
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
              @error="imageLoadError"
              v-if="imageSrc!==''&&!loading"
    >
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline"></i>
      </div>
      <div slot="placeholder" class="image-slot">
        <i class="el-icon-loading"></i>
      </div>
    </el-image>
    <div class="image-slot" v-else>
      <i class="el-icon-loading"></i>
    </div>
  </div>

</template>

<script>
export default {
  name: "BaseImage",
  data: () => ({
    // imageSrc: "",
    // imageFit: "contain",
    // imageAlt: "",
    // imageReferrerPolicy: "",
    // imageLazy: false,
    // imageScrollContainer: "",
    // imagePreviewSrcList: [],
    // imageZIndex: 9999,
    // imageInitialIndex: 0,
    intervalId: null,
    loading: false
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
  computed: {
    imageSrc() {
      return this.option ? this.option.src : this.src;
    },
    imageFit() {
      return this.option ? this.option.fit : this.fit;
    },
    imageAlt() {
      return this.option ? this.option.alt : this.alt;
    },
    imageReferrerPolicy() {
      return this.option ? this.option.referrerPolicy : this.referrerPolicy;
    },
    imageLazy() {
      return this.option ? this.option.lazy : this.lazy;
    },
    imageScrollContainer() {
      return this.option ? this.option.scrollContainer : this.scrollContainer;
    },
    imagePreviewSrcList() {
      return this.option ? this.option.previewSrcList : this.previewSrcList;
    },
    imageZIndex() {
      return this.option ? this.option.zIndex : this.zIndex;
    },
    imageInitialIndex() {
      return this.option ? this.option.initialIndex : this.initialIndex;
    },
  },
  methods: {
    imageLoadError(e) {
      this.$emit("error", e);
      this.loading = false;
    },
    imageLoad(e) {
      this.$emit("load", e);
      this.loading = false;
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
    // this.intervalId = setInterval(() => {
    //   if (this.option || this.src || tryTimes > 10) {
    //     clearInterval(this.intervalId);
    //     this.setData();
    //     this.loading = false;
    //   }
    //   tryTimes++;
    // }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    this.loading = false;
  },
}
</script>

<style lang="less" scoped>
.image {
  width: 100%;
  height: 100%;
  user-select: none;
}

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
</style>
<template>
  <div class="card container" :class="cardClass" ondragstart="return false;"
       @click="handleItemClick(false)" @dblclick="handleItemClick(true)">
    <div class="thumb-container" ref="thumb">
      <BaseImage class="file-thumb"
                 :src="content.thumb?content.thumb:'http://localhost/file/9084afa50dd343379ce38d2165324296'"
                 :fit="content.isDir?'contain':'cover'"
                 @error="thumbLoadError"/>
      <div class="file-type-container p" v-if="!content.isDir">
        <div class="file-type-icon">
          <SvgIcon :name="typeIcon"/>
        </div>
        <el-tag type="primary" class="file-type-tag" v-if="content.suffix">{{ content.suffix.toUpperCase() }}</el-tag>
      </div>
    </div>
    <div class="file-detail-container p">
      <el-tooltip :content="content.title" placement="bottom-start" :disabled="content.title.length<35">
        <div class="title">{{ content.title }}</div>
      </el-tooltip>
    </div>
    <div class="check-icon-container" v-show="checked">
      <i class="el-icon-check"></i>
    </div>
  </div>
</template>

<script>
import BaseImage from "@/components/BaseImage/index.vue";

export default {
  name: "MediaCard",
  components: {BaseImage},
  data() {
    return {
      // isChecked: false
    }
  },
  props: {
    checkedMode: Boolean,
    checked: {
      type: Boolean,
      default: () => false
    },
    content: {
      type: Object,
      required: true
    }
  },
  computed: {
    isChecked() {
      return this.checked;
    },
    cardClass() {
      if (this.content.isDir)
        return this.checkedMode ? this.isChecked ? 'checked' : '' : 'is-dir';
      return this.checkedMode ? this.isChecked ? 'checked' : '' : 'scale';
    },
    typeName() {
      if (this.content.type && this.content.type.parent) {
        return this.content.type.parent.name;
      }
      return null;
    },
    typeIcon() {
      return "type-" + (this.typeName ? this.typeName : "unknown");
    },
  },
  watch: {
    checkedMode(value) {
      if (!value)
        this.isChecked = false;
    }
  },
  methods: {
    handleItemClick(isDbClick) {
      // if (this.checked) {
      //   this.isChecked = !this.isChecked;
      //   if (this.isChecked) {
      //     this.$emit("itemChecked", this.content);
      //   } else {
      //     this.$emit("itemUnChecked", this.content);
      //   }
      // }
      // if (this.content.isDir && isDbClick)
      //   this.$emit("itemClick", true, this.content);
      // if (!this.content.isDir && !this.DbClick)
      //   this.$emit("itemClick", false, this.content);
      this.$emit("itemClick", this.content.isDir, this.content);
    },
    handleItemDbClick() {
      if (this.content.isDir)
        this.$emit("itemDbClick", this.content);
    },
    thumbLoadError() {
      this.$refs.thumb.style.height = "240px";
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  //width: calc(25% - var(--margin-x));
  position: relative;
  padding: 0;
  border-radius: .5rem;
  overflow: hidden;
  user-select: none;


  &.scale:hover > .thumb-container .file-thumb {
    transform: scale(1.3);
  }

  .thumb-container {
    position: relative;
    width: 100%;
    background-color: var(--bg-light);

    .file-thumb {
      transition: transform .5s ease-in-out;
      //transform: scale(1.1);
    }

    .file-type-container {
      width: 100%;
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      justify-content: space-between;

      .file-type-tag {

      }

      .file-type-icon {
        width: 32px;
        height: 32px;
      }
    }
  }

  .file-detail-container {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: #00000053;

    .title {
      font-size: 1rem;
      color: var(--text-white);
      letter-spacing: 2px;
      display: -webkit-box; //对象作为弹性伸缩盒子模型显示
      overflow: hidden; //溢出隐藏
      -webkit-box-orient: vertical; //设置伸缩盒子对象的子元素的排列方式
      -webkit-line-clamp: 2; //设置 块元素包含的文本行数
    }
  }

  .check-icon-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 8rem;
    color: var(--text-primary-color);
    font-weight: 600;
    z-index: 2;
  }

  &:after {
    display: none;
  }

  &.checked {
    position: relative;

    &:after {
      display: block;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: calc(100% - 4px);
      height: calc(100% - 4px);
      background-color: var(--bg-light-primary);
      opacity: .8;
      border: 2px solid var(--panel-border-primary-color);
      border-radius: .5rem;
    }

    .check-icon-container {
      display: flex;
    }
  }
}

.is-dir {
  background-color: transparent;
  box-shadow: none;

  .file-thumb, .thumb-container {
    background-color: transparent;
  }

  .file-detail-container {
    bottom: 25px;
    background-color: transparent;

    .title {
      font-size: 1.2rem;
      text-align: center;
      font-weight: 600;
    }
  }
}

//
//@media screen and (max-width: 992px) {
//  .container {
//    width: calc(33.3333% - var(--margin-x));
//
//    .thumb-container {
//      //height: 200px;
//    }
//  }
//}
//
//@media screen and (max-width: 768px) {
//  .container {
//    width: calc(50% - var(--margin-x));
//
//    .thumb-container {
//      //height: 200px;
//    }
//  }
//}
//
//@media screen and (max-width: 576px) {
//  .container {
//    width: calc(100% - var(--margin-x));
//
//    .thumb-container {
//      //height: 200px;
//    }
//  }
//}
</style>
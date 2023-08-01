<template>
  <div class="content-preview-container" v-loading="loading">
    <div class="rich-content-container" ref="richContentContainer">
      <div class="global-message">
        <el-alert title="此为临时链接，仅用于预览，将在短期内失效。"
                  style="background-color:var(--bg-dark-light-primary);color: var(--text-light-color);"
                  @close="handleAlertClose"/>
      </div>
      <div class="title">{{ content.title }}</div>
      <div class="rich-content-meta-list">
        <div class="rich-content-meta author" v-if="content.author&&content.author!==''">{{ content.author }}</div>
        <div class="rich-content-meta webTitle" @click="$router.push('/')">{{ webTitle }}</div>
        <div class="rich-content-meta update-time">{{ content.updateTime }}</div>
      </div>
      <div class="rich-content-tag-list" v-if="content.collection_enable&&content.collection.length>0">
        <div class="tag-list-wrap">
          <div class="left-wrap">
            <div class="tag-list-title">收录于合集</div>
            <div class="tag-list">
              <div class="tag-item" v-for="(item,index) in content.collection" :key="index">
                <div class="tag-name">
                  #{{ item.name }}
                </div>
              </div>
            </div>
          </div>
          <div class="right-wrap">
            <div class="content-count" v-if="content.collection.length===1">0 个 <i class="el-icon-arrow-right"/></div>
          </div>
        </div>
      </div>
      <div class="rich-content-inner" v-html="content.content"></div>
      <p style="margin-top: 0;margin-bottom: 24px;"></p>
      <div class="content-bottom-area">
        <div class="rich-media-tool-area" v-if="content.sourceEnable&&content.source!==''">
          <div class="rich-media-tool">
            <a :href="content.source" target="_blank">阅读原文</a>
          </div>
        </div>
      </div>
    </div>
    <div class="extend-area"></div>
  </div>
</template>

<script>
import richText from "@/assets/data/richText";
import {mapState} from "vuex";
import {getContentData, getContentListData} from "@/api/content";

export default {
  name: "ContentView",
  data() {
    return {
      loading: false,
      content: {
        id: "",
        contentId: "",
        subId: "",
        contentIndex: 0,
        title: "",
        thumb: "",
        summary: "",
        content: "",
        author: "",
        source: "",
        sourceEnable: false,
        collection: [],
        collectionEnable: false,
        original: false,
        commit: false,
        cid: null,
        uid: null,
        status: 0,
        createTime: "",
        updateTime: ""
      }
    }
  },
  computed: {
    ...mapState("system", ["webTitle"])
  },
  watch: {
    '$route.query.id': function (value) {
      this.content.id = value;
      this.getContentData();
    }
  },
  methods: {
    getContentData() {
      this.loading = true;
      getContentData(this.content.id).then(res => {
        let {data} = res;
        this.content.contentId = data.contentId;
        this.content.subId = data.subId;
        this.content.contentIndex = data.contentIndex;
        this.content.title = data.title;
        this.content.thumb = data.thumb;
        this.content.summary = data.summary;
        this.content.content = data.content;
        this.content.author = data.author;
        this.content.source = data.source;
        this.content.sourceEnable = data.sourceEnable;
        this.content.collection = data.collection;
        this.content.collectionEnable = data.collectionEnable;
        this.content.original = data.original;
        this.content.commit = data.commit;
        this.content.cid = data.cid;
        this.content.uid = data.uid;
        this.content.status = data.status;
        this.content.createTime = data.createTime;
        this.content.updateTime = data.updateTime;
        if (data.title && data.title !== '') {
          document.title = data.title + " - " + this.$store.getters["system/webTitle"];
        }
      }).finally(() => {
        this.loading = false;
      })
    },
    handleAlertClose() {
      this.$nextTick(() => {
        this.$refs.richContentContainer.style.paddingTop = "calc(20px + env(safe-area-inset-top))";
      })
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.content.id = this.$route.query.id;
      this.getContentData();
    } else {
      this.$message.error("参数错误，请检查！");
      this.$router.back();
    }
  }
}
</script>

<style lang="less" scoped>
.content-preview-container {
  background-color: var(--bg-white);
  padding: 0 20px;

  .rich-content-container {
    max-width: 677px;
    margin: 0 auto;
    background-color: var(--bg-white);
    padding: calc(36px + 1.4em + env(safe-area-inset-top)) 0 0;

    .global-message {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      max-width: 677px;
      margin: 0 auto;

      :deep(.el-alert__closebtn) {
        color: var(--text-light-color);
      }
    }

    .title {
      font-size: 22px;
      line-height: 1.4;
      margin-bottom: 14px;
    }

    .rich-content-meta-list {
      margin-bottom: 22px;
      line-height: 20px;
      word-wrap: break-word;
      -webkit-hyphens: auto;
      -ms-hyphens: auto;
      hyphens: auto;

      .rich-content-meta {
        display: inline-block;
        vertical-align: middle;
        margin: 0 10px 10px 0;
        font-size: 15px;
      }

      .author {
        color: var(--text-light-color);
      }

      .webTitle {
        cursor: pointer;
        color: var(--text-primary-color);
      }

      .update-time {
        color: var(--text-light-color);
      }
    }

    .rich-content-tag-list {
      margin: 0 0 16px;
      padding: 12px 16px;
      border-radius: 8px;
      background-color: var(--bg-dark-gray-20);
      -webkit-user-select: none;
      -ms-user-select: none;
      user-select: none;


      .tag-list-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left-wrap {
          .tag-list-title {
            font-size: 15px;
            color: var(--text-default-color);
            line-height: 20px;
          }

          .tag-list {
            margin-top: 6px;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;

            .tag-item {
              margin-right: 12px;
              margin-top: 6px;
              position: relative;
              display: -ms-flexbox;
              display: flex;

              .tag-name {
                cursor: pointer;
                display: inline-block;
                font-size: 15px;
                line-height: 20px;
                color: var(--text-primary-color);
              }
            }
          }
        }

        .right-wrap {
          flex-shrink: 0;

          .content-count {
            font-size: 15px;
            line-height: 20px;
            padding-right: 14px;
            position: relative;
            color: var(--text-light-sub-color);
          }
        }
      }

    }

    .content-bottom-area {
      margin-bottom: 20px;

      .rich-media-tool-area {
        .rich-media-tool {
          a {
            color: var(--text-primary-color);
            font-weight: 600;
            font-size: 14px;
          }
        }
      }
    }
  }

  .extend-area {
    min-height: 40px;
  }
}
</style>
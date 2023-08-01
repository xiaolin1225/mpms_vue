<template>
  <div class="container">
    <div class="card">
      <BaseBar>
        <template #left>
          <el-button type="primary" icon="el-icon-plus" @click="addItem">新建</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="handleBatchDelete">删除</el-button>
        </template>
        <template #right>
          <el-form :inline="true" :model="filter" class="search-filter-form">
            <el-form-item label="分类">
              <el-select v-model="filter.category" filterable multiple clearable placeholder="请选择分类">
                <el-option label="科技" value="1"></el-option>
                <el-option label="知识" value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键词">
              <el-input v-model="filter.keyword" placeholder="请输入关键词"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </template>

      </BaseBar>
    </div>
    <div class="content-list-container mt">
      <div class="content-list" ref="contentList">
        <div class="content-item create-content" @click="handleCreateContent('create')">
          <span class="el-dropdown-link">
                  <i class="el-icon-plus"></i>
                    新的创作
          </span>
          <!--          <el-dropdown placement="bottom" @command="handleCreateContent">-->
          <!--                <span class="el-dropdown-link">-->
          <!--                  <i class="el-icon-plus"></i>-->
          <!--                    新的创作-->
          <!--                </span>-->
          <!--            <el-dropdown-menu slot="dropdown">-->
          <!--              <el-dropdown-item command="create"><i class="el-icon-document"></i> 写新图文</el-dropdown-item>-->
          <!--              &lt;!&ndash;              <el-dropdown-item command="choose"><i class="el-icon-document-checked"></i> 选择已有图文&ndash;&gt;-->
          <!--              &lt;!&ndash;              </el-dropdown-item>&ndash;&gt;-->
          <!--              &lt;!&ndash;              <el-dropdown-item command="picture"><i class="el-icon-picture-outline"></i> 图片消息&ndash;&gt;-->
          <!--              &lt;!&ndash;              </el-dropdown-item>&ndash;&gt;-->
          <!--              &lt;!&ndash;              <el-dropdown-item command="video"><i class="el-icon-video-play"></i> 视频消息</el-dropdown-item>&ndash;&gt;-->
          <!--              &lt;!&ndash;              <el-dropdown-item command="audio"><i class="el-icon-headset"></i> 音频消息</el-dropdown-item>&ndash;&gt;-->
          <!--              &lt;!&ndash;              <el-dropdown-item command="share"><i class="el-icon-share"></i> 转载</el-dropdown-item>&ndash;&gt;-->
          <!--            </el-dropdown-menu>-->
          <!--          </el-dropdown>-->
        </div>
        <div class="content-item" v-for="content in contentList" :key="content.id">
          <div class="content-sub-item" :class="content.contents.length>1?'':'single'" v-for="item in content.contents"
               :key="item.contentIndex" @click="handlePreviewContent(item.id)">
            <div class="content-info">
              <div class="content-title">
                {{ item.title.length > 0 ? item.title : "标题" }}
              </div>
              <p class="content-description" v-if="content.contents.length===1&&item.contentIndex===1">{{
                  item.summary
                }}</p>
            </div>
            <div class="content-thumb"
                 :title="item.title.length > 0 ? item.title : '标题'"
                 :style="item.thumb&&item.thumb.trim().length>0?`background-image:url(${imageSrcHandler(item.thumb)})`:''">
            </div>
          </div>
          <div class="update-time">
            更新于 {{ content.updateTime }}
          </div>
          <div class="content-opt">
            <el-button type="primary" size="mini" icon="el-icon-edit" circle
                       @click="editItem(content.contentId)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" circle
                       @click="removeContentList(content.id)"></el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToolBar from "@/views/Content/ContentList/ToolBar";
import BasePagination from "@/components/BasePagination/index.vue";
import ContentItem from "@/views/Content/ContentList/ContentItem/index.vue";
import {getContentList, removeContentList} from "@/api/content";
import BaseBar from "@/components/BaseBar/index.vue";
import {debounce} from "@/utils";
import {imageSrcHandler} from "@/utils/fileUtils";

export default {
  name: "ContentList",
  components: {BaseBar, ContentItem, BasePagination, ToolBar},
  data() {
    return {
      contentList: [],
      filter: {
        category: "",
        status: 0,
        keyword: ""
      },
      current: 1,
      pages: 0,
      size: 20,
      total: 0
    }
  },
  methods: {
    imageSrcHandler,
    async getContentList() {
      let {data} = await getContentList({current: this.current, size: this.size, ...this.filter});
      this.contentList = data.records;
      this.pages = data.pages;
      this.total = data.total;
      this.calculateColumn()
    },
    removeContentList(id) {
      this.$alert("该操作将会删除该集合内的所有内容，是否继续", "警告", {type: "error"}).then(() => {
        removeContentList(id).then(res => {
          this.$message.success(res.message);
          this.getContentList();
        })
      }).catch(() => {
      })
    },
    editItem(id) {
      this.$router.push({
        path: "/content/edit",
        query: {
          id
        }
      })
    },
    onSubmit() {
      this.getContentList()
    },
    handleCreateContent(command) {
      switch (command) {
        case "create":
          this.editItem();
          break;
        default:
          console.log(command);
      }
    },
    calculateColumn() {
      this.$nextTick(() => {
        let container = this.$refs.contentList;
        if (!container) {
          return;
        }
        let imageWidth = 360;
        // console.log(container)
        let containerWidth = container.clientWidth;
        let columns = Math.floor(containerWidth / (imageWidth + 5));
        // columns = columns > 1 ? columns : 2;
        let spaceNumber = columns + 1;
        let leftSpace = containerWidth - columns * (imageWidth + 5);
        let space = leftSpace / spaceNumber;
        let nextTops = new Array(columns).fill(0);
        for (let i = 0; i < container.children.length; i++) {
          let child = container.children[i];
          let minTop = Math.min.apply(null, nextTops)
          child.style.top = minTop + 'px';
          let index = nextTops.indexOf(minTop);
          nextTops[index] += child.clientHeight + space;
          let left = (index + 1) * space + index * imageWidth;
          child.style.left = left + "px";
        }
        let max = Math.max.apply(null, nextTops);
        container.style.height = max + "px";
      })
    },
    handlePreviewContent(id) {
      let {href} = this.$router.resolve({
        path: "/content/preview",
        query: {
          id
        }
      });
      window.open(href, "_blank");
    }
  },
  mounted() {
    this.getContentList();
    this.observer = new ResizeObserver(debounce(this.calculateColumn));
    this.observer.observe(this.$refs.contentList);
  },
  destroyed() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
</script>

<style lang="less" scoped>
:deep(.el-table-column--selection) {
  .cell {
    padding-left: 10px;
  }
}

.content-list-container {
  .content-list {
    position: relative;
    //margin-left: -20px;

    .content-item {
      position: absolute;
      width: 360px;
      border-radius: .5rem;
      background-color: var(--bg-white);
      --shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.05);
      box-shadow: var(--shadow);
      overflow: hidden;

      .content-sub-item {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--padding-y) var(--padding-x);
        border-bottom: 1px solid var(--panel-border-color);

        .content-thumb {
          width: 64px;
          aspect-ratio: 1/1;
          background-color: var(--bg-dark-gray);
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }

        &:hover {
          background-color: var(--bg-light);
        }

        &:first-child {
          display: block;
          //margin: calc(-1 * var(--padding-y)) calc(-1 * var(--padding-x)) 0;
          position: relative;
          padding: 0;

          .content-info {
            .content-title {
              position: absolute;
              width: 100%;
              height: 54px;
              left: 0;
              bottom: 0;
              background: -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(0, 0, 0, .3)));
              background: linear-gradient(180deg, transparent, rgba(0, 0, 0, .3));
              line-height: 22px;
              padding: 15px;
              color: var(--text-white);
            }
          }

          .content-thumb {
            width: 100%;
            aspect-ratio: 2.35/1;
          }
        }

        &.single {
          display: flex;
          flex-direction: column-reverse;

          .content-info {
            width: 100%;
            padding: var(--padding-y) var(--padding-x);

            .content-title {
              font-size: 16px;
              margin-bottom: 8px;
              color: var(--text-default-color);
              height: unset;
              padding: unset;
              background: unset;
              position: unset;
            }

            .content-description {
              font-size: 14px;
              color: var(--text-light-color);
              min-height: 16px;
              line-height: 16px;
            }
          }

        }
      }

      .update-time {
        padding: var(--padding-y) var(--padding-x);
        color: var(--text-light-sub-color);
        font-size: 12px;
      }

      .content-opt {
        position: absolute;
        top: 15px;
        right: 0;
        padding: 0 15px;
        opacity: 0;
        transition: opacity .5s cubic-bezier(.4, 0, 1, 1);
      }

      &:hover {
        .content-opt {
          opacity: 1;
        }
      }
    }

    .create-content {
      cursor: pointer;
      height: 144px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .el-dropdown-link {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: var(--text-default-color);

        i {
          margin-bottom: var(--padding-y);
          font-size: 26px;
        }
      }

    }
  }
}
</style>
<template>
  <div class="container">
    <!--    <div class="editor-header">-->
    <!--      <div id="toolbar"></div>-->
    <!--    </div>-->
    <el-form ref="form" :model="currentFormData" label-position="top">
      <div class="editor-container">
        <div class="left-wrap">
          <div class="card content-list">
            <div class="content-item" :class="currentIndex===index?'active':''" v-for="(item,index) in form"
                 :key="item.id" @click="currentIndex = index">
              <div class="content-info">
                <BaseImage :src="item.thumb" class="content-thumb"
                           v-if="item.thumb&&item.thumb.trim().length>0" fit="cover"/>
                <div class="content-title">
                  {{ item.title.length > 0 ? item.title : "标题" }}
                </div>
              </div>
              <div class="content-opt card">
                <div class="opt-item" v-if="index===0">
                  <el-dropdown placement="bottom-start">
                    <span class="el-dropdown-link">
                      <i class="el-icon-sort"/>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-popconfirm
                            title="创建新图文，当前内容不会保存"
                            @confirm="handleContent('create')"
                        >
                          <div slot="reference"><i class="el-icon-document"></i> 写新图文</div>
                        </el-popconfirm>

                      </el-dropdown-item>
                      <el-dropdown-item command="choose">
                        <el-popconfirm
                            title="选择已有图文，当前内容不会保存"
                            @confirm="handleContent('choose')"
                        >
                          <div slot="reference"><i class="el-icon-document-checked"></i> 选择已有图文</div>
                        </el-popconfirm>
                      </el-dropdown-item>
                      <el-dropdown-item command="picture">
                        <el-popconfirm
                            title="替换为图片消息，当前内容不会保存"
                            @confirm="handleContent('picture')"
                        >
                          <div slot="reference"><i class="el-icon-picture-outline"></i> 图片消息</div>
                        </el-popconfirm>
                      </el-dropdown-item>
                      <el-dropdown-item command="video">
                        <el-popconfirm
                            title="替换为视频消息，当前内容不会保存"
                            @confirm="handleContent('video')"
                        >
                          <div slot="reference"><i class="el-icon-video-play"></i> 视频消息</div>
                        </el-popconfirm>
                      </el-dropdown-item>
                      <el-dropdown-item command="audio">
                        <el-popconfirm
                            title="替换为音频消息，当前内容不会保存"
                            @confirm="handleContent('audio')"
                        >
                          <div slot="reference"><i class="el-icon-headset"></i> 音频消息</div>
                        </el-popconfirm>
                      </el-dropdown-item>
                      <el-dropdown-item command="share">
                        <el-popconfirm
                            title="替换为转载消息，当前内容不会保存"
                            @confirm="handleContent('share')"
                        >
                          <div slot="reference"><i class="el-icon-share"></i> 转载</div>
                        </el-popconfirm>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="opt-item" v-if="form.length>1&&index>0">
                  <i class="el-icon-top"/>
                </div>
                <div class="opt-item" v-if="form.length>1&&index<form.length-1">
                  <i class="el-icon-bottom"/>
                </div>
                <div class="opt-item" v-if="index!==0">
                  <i class="el-icon-delete"/>
                </div>
              </div>
            </div>
            <div class="content-item add-content-item" v-if="form.length<8">
              <el-dropdown placement="bottom" @command="handleCreateContent">
                <span class="el-dropdown-link">
                  <i class="el-icon-plus"></i> 添加图文
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="create"><i class="el-icon-document"></i> 写新图文</el-dropdown-item>
                  <el-dropdown-item command="choose"><i class="el-icon-document-checked"></i> 选择已有图文
                  </el-dropdown-item>
                  <el-dropdown-item command="picture"><i class="el-icon-picture-outline"></i> 图片消息
                  </el-dropdown-item>
                  <el-dropdown-item command="video"><i class="el-icon-video-play"></i> 视频消息</el-dropdown-item>
                  <el-dropdown-item command="audio"><i class="el-icon-headset"></i> 音频消息</el-dropdown-item>
                  <el-dropdown-item command="share"><i class="el-icon-share"></i> 转载</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <div class="center-wrap">
          <div class="card">

            <el-form-item label="标题">
              <el-input v-model="currentFormData.title" maxlength="64" show-word-limit/>
            </el-form-item>
            <el-form-item label="作者">
              <el-input v-model="currentFormData.author" maxlength="8" show-word-limit/>
            </el-form-item>
            <el-form-item label="内容">
              <Editor
                  ref="editor"
                  v-model="currentFormData.content"
                  api-key="d05j6hnmh4pwgutpsu6qprw8uf35f1ikos4tv1gc7z6ro0x8"
                  :init="init"
                  @onInit="editorInit"
              />
            </el-form-item>

          </div>
        </div>
        <div class="right-wrap">
          <div class="card">
            <el-form-item label="封面">
              <DragUpload @success="handleThumbUploadSuccess">
                <template #content>
                  <BaseImage :src="currentFormData.thumb"
                             v-if="currentFormData.thumb&&currentFormData.thumb.trim().length>0"/>
                  <div v-else>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </div>
                </template>
                <template #tip>只能上传不超过300MB的文件</template>
              </DragUpload>
            </el-form-item>
            <el-form-item label="摘要">
              <el-input v-model="currentFormData.summary" type="textarea" :max="120" show-word-limit/>
            </el-form-item>
            <el-form-item>
              <el-switch
                  v-model="currentFormData.original"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
              />
              &nbsp;{{ form.original ? "已声明原创" : "未声明原创" }}
            </el-form-item>
            <el-checkbox style="display: block;margin: var(--margin-y) 0" v-model="currentFormData.sourceActive">原文链接
            </el-checkbox>
            <el-checkbox style="display: block;margin: var(--margin-y) 0" v-model="currentFormData.commit">允许评论
            </el-checkbox>
            <el-checkbox style="display: block;margin: var(--margin-y) 0" v-model="currentFormData.collection">合集
            </el-checkbox>
            <el-form-item label="发布时间">
              <el-date-picker
                  style="width: 100%"
                  v-model="currentFormData.postTime"
                  :picker-options="pickerOptions"
                  :default-time="getDefaultTime()"
                  type="datetime"
                  placeholder="选择发布时间"
                  @change="postTimeChange"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div class="card mt">
      <BaseBar>
        <template #left>
          正文字数：{{ contentWordsCount }}
        </template>
        <template #right>
          <el-row>
            <el-button type="success">存为草稿</el-button>
            <el-button>预览</el-button>
            <el-button type="primary">发布</el-button>
          </el-row>
        </template>
      </BaseBar>
    </div>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import BaseImage from "@/components/BaseImage/index.vue";
import BaseBar from "@/components/BaseBar/index.vue";
import DragUpload from "@/components/DragUpload/index.vue";

export default {
  name: "ContentEditor",
  components: {DragUpload, BaseBar, BaseImage, Editor},
  data() {
    return {
      currentIndex: 0,
      form: [{
        id: 1,
        title: "第一篇图文",
        author: "",
        summary: "",
        content: "",
        source: "",
        thumb: "",
        postTime: null,
        original: false,
        sourceActive: false,
        commit: false,
        collection: false
      }],
      pickerOptions: {
        disabledDate: (date) => {
          let nowDate = new Date();
          nowDate.setDate(nowDate.getDate() - 1);
          return date < nowDate;
        },
        selectableRange: "00:00:00-23:59:59"
      },
      init: {
        language: "zh-Hans",
        language_url: "/plugin/tinymce/zh-Hans.js",
        plugins: 'autoresize lists link image table code help wordcount',
        placeholder: "从这里开始写正文",
        min_height: 350, //编辑器高度
        resize: false,
        browser_spellcheck: true, // 拼写检查
        elementpath: false, //禁用编辑器底部的状态栏
        // statusbar: false, // 隐藏编辑器底部的状态栏
        paste_data_images: true, // 允许粘贴图像
        menubar: false, //最顶部文字信息
        branding: false, //是否禁用“Powered by TinyMCE”
        toolbar: "undo redo | fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | lineheight forecolor backcolor bold italic underline strikethrough | h1 h2 h3 h4 h5 h6 | link image quicklinkblockquote table numlist bullist code preview fullscreen", //工具栏
        toolbar_mode: "wrap",
        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
        font_formats: "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
      },
      editor: null,
      contentWordsCount: 0
    }
  },
  computed: {
    currentFormData() {
      return this.form[this.currentIndex];
    }
  },
  mounted() {

  },
  methods: {
    getTimeSelectableRange(time) {
      let nowDate = new Date();
      nowDate.setMinutes(nowDate.getMinutes() + 5);
      let chooseDate = new Date(time);
      let transform = time => time < 10 ? "0" + time : time;
      if (nowDate.getDate() === chooseDate.getDate()) {
        return `${transform(nowDate.getHours())}:${transform(nowDate.getMinutes())}:00-23:59:59`;
      }
      return "00:00:00-23:59:59";
    },
    postTimeChange(time) {
      let nowDate = new Date();
      nowDate.setMinutes(nowDate.getMinutes() + 5);
      if (nowDate.getDate() - 1 >= time.getDate() || nowDate.getDate() === time.getDate() && (nowDate.getHours() < nowDate.getHours() || (nowDate.getHours() === nowDate.getHours() && nowDate.getMinutes() > time.getMinutes()))) {
        this.form.postTime = nowDate;
      }
      this.pickerOptions.selectableRange = this.getTimeSelectableRange(time);
    },
    getDefaultTime() {
      let nowDate = new Date();
      nowDate.setMinutes(nowDate.getMinutes() + 5);
      let transform = time => time < 10 ? "0" + time : time;
      return `${transform(nowDate.getHours())}:${transform(nowDate.getMinutes())}:00;`;
    },
    editorInit(e) {
      this.editor = e.target;
      this.editor.on("WordCountUpdate", e => {
        this.contentWordsCount = e.wordCount.charactersWithoutSpaces
      })
    },
    handleThumbUploadSuccess(res) {
      this.form[this.currentIndex].thumb = res.data;
    },
    handleCreateContent(command) {
      const data = {
        id: this.form.length + 1,
        title: "",
        author: "",
        summary: "",
        content: "",
        source: "",
        thumb: "",
        postTime: null,
        original: false,
        sourceActive: false,
        commit: false,
        collection: false
      }
      switch (command) {
        case "create":
          this.form.push(data);
          break;
        default:
          console.log(command);
      }
    },
    handleContent(command) {
      const data = {
        id: 1,
        title: "",
        author: "",
        summary: "",
        content: "",
        source: "",
        thumb: "",
        postTime: null,
        original: false,
        sourceActive: false,
        commit: false,
        collection: false
      }
      switch (command) {
        case "create":
          this.form[0] = data;
          break;
        default:
          console.log(command);
      }
    },
  }
}
</script>

<style lang="less" scoped>
.editor-container {
  position: relative;
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: var(--margin-x);

  & > *::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .left-wrap {
    width: 370px;
    min-width: 370px;
    max-height: calc(100vh - 21rem);
    overflow: auto;

    .content-list {
      width: 310px;
      user-select: none;

      .content-item {
        cursor: pointer;
        position: relative;
        height: 130px;
        border-radius: .5rem;
        margin-top: var(--margin-y);

        &:first-child {
          margin-top: unset;
        }


        .content-info {
          width: 100%;
          height: 100%;
          border-radius: .5rem;
          overflow: hidden;
          border: 2px solid var(--panel-border-color);
          background-color: #E1E1E1;


          &::before {
            border-radius: .5rem;
            overflow: hidden;
            content: " ";
            position: absolute;
            left: 0;
            right: 0;
            top: 55px;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0);
            background-image: linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.15) 86%);
          }

          .content-thumb {
            width: 100%;
            height: 100%;
            //overflow: hidden;
          }

          .content-title {
            position: absolute;
            left: 15px;
            right: 15px;
            bottom: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            color: #FFFFFF;
            font-weight: 400;
            z-index: 1;
          }
        }

        .content-opt {
          cursor: default;
          position: absolute;
          top: 0;
          right: -75px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: .5rem;
          border-radius: 24px;
          //opacity: 0;
          transition: opacity .5s cubic-bezier(.4, 0, 1, 1);

          .opt-item {
            cursor: pointer;
            width: 2rem;
            height: 2rem;
            font-size: 1rem;
            margin-top: .5rem;
            padding: .5rem;
            line-height: 1rem;
            text-align: center;
            border-radius: 50%;

            &:first-child {
              margin-top: unset;
            }

            &:hover {
              background-color: var(--bg-dark-gray);
            }
          }
        }

        &.active .content-info {
          border-color: var(--panel-border-primary-color);
        }

        &:hover {
          .content-opt {
            opacity: 1;
          }
        }

      }

      .add-content-item {
        margin-top: unset;
        margin-bottom: -1rem;
        width: 100%;
        background-color: unset;
        height: 90px;
        font-size: 14px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border-color: transparent;

        &::before {
          display: none;
        }
      }
    }
  }

  .center-wrap {
    width: 768px;
    min-width: 375px;
    min-height: 350px;
    max-height: calc(100vh - 21rem);
    overflow: auto;

    :deep(.tox-tinymce) {
      border: 1px solid #DCDFE6;
      transition: border-color .2s cubic-bezier(.645, .045, .355, 1);

      &:hover {
        border-color: #C0C4CC;
      }
    }
  }

  .right-wrap {
    flex-grow: 1;
    min-width: 300px;
    max-width: 420px;
    max-height: calc(100vh - 21rem);
    overflow: auto;
  }
}
</style>
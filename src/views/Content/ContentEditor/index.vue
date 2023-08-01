<template>
  <div>
    <!--    <BaseHeader content="编辑内容"/>-->
    <div class="container" v-loading="loading">
      <!--    <div class="editor-header">-->
      <!--      <div id="toolbar"></div>-->
      <!--    </div>-->
      <el-form ref="form" :model="currentFormData" label-position="top">
        <div class="editor-container">
          <div class="left-wrap">
            <div class="card content-list">
              <div class="content-item" :class="currentIndex===index?'active':''" v-for="(item,index) in form"
                   :key="item.contentIndex" @click="currentIndex = index"
                   :title="item.title.length > 0 ? item.title : '标题'">
                <el-popover
                    placement="right"
                    trigger="hover"
                    :visible-arrow="false"
                    popper-class="content-opt-popover"
                    :disabled="form.length===1"
                >
                  <div class="content-info" slot="reference">
                    <div class="content-title">
                      {{ item.title.length > 0 ? item.title : "标题" }}
                    </div>
                    <div class="content-thumb"
                         :style="item.thumb&&item.thumb.trim().length>0?`background-image:url(${imageSrcHandler(item.thumb)})`:''">
                      <!--                  <BaseImage :src="item.thumb"-->
                      <!--                             v-if="item.thumb&&item.thumb.trim().length>0" fit="cover"/>-->
                    </div>
                  </div>
                  <div class="content-opt" v-if="form.length>1">
                    <!--                  <el-dropdown placement="bottom-start">-->
                    <!--                    <div class="el-dropdown-link">-->
                    <!--                      <div class="opt-item" v-if="index===0">-->
                    <!--                        <i class="el-icon-sort"/>-->
                    <!--                      </div>-->
                    <!--                    </div>-->
                    <!--                    <el-dropdown-menu slot="dropdown">-->
                    <!--                      <el-dropdown-item>-->
                    <!--                        <el-popconfirm-->
                    <!--                            title="创建新图文，当前内容不会保存"-->
                    <!--                            @confirm="handleContent('create')"-->
                    <!--                        >-->
                    <!--                          <div slot="reference"><i class="el-icon-document"></i> 写新图文</div>-->
                    <!--                        </el-popconfirm>-->

                    <!--                      </el-dropdown-item>-->
                    <!--                      <el-dropdown-item command="choose">-->
                    <!--                        <el-popconfirm-->
                    <!--                            title="选择已有图文，当前内容不会保存"-->
                    <!--                            @confirm="handleContent('choose')"-->
                    <!--                        >-->
                    <!--                          <div slot="reference"><i class="el-icon-document-checked"></i> 选择已有图文</div>-->
                    <!--                        </el-popconfirm>-->
                    <!--                      </el-dropdown-item>-->
                    <!--                      <el-dropdown-item command="picture">-->
                    <!--                        <el-popconfirm-->
                    <!--                            title="替换为图片消息，当前内容不会保存"-->
                    <!--                            @confirm="handleContent('picture')"-->
                    <!--                        >-->
                    <!--                          <div slot="reference"><i class="el-icon-picture-outline"></i> 图片消息</div>-->
                    <!--                        </el-popconfirm>-->
                    <!--                      </el-dropdown-item>-->
                    <!--                      <el-dropdown-item command="video">-->
                    <!--                        <el-popconfirm-->
                    <!--                            title="替换为视频消息，当前内容不会保存"-->
                    <!--                            @confirm="handleContent('video')"-->
                    <!--                        >-->
                    <!--                          <div slot="reference"><i class="el-icon-video-play"></i> 视频消息</div>-->
                    <!--                        </el-popconfirm>-->
                    <!--                      </el-dropdown-item>-->
                    <!--                      <el-dropdown-item command="audio">-->
                    <!--                        <el-popconfirm-->
                    <!--                            title="替换为音频消息，当前内容不会保存"-->
                    <!--                            @confirm="handleContent('audio')"-->
                    <!--                        >-->
                    <!--                          <div slot="reference"><i class="el-icon-headset"></i> 音频消息</div>-->
                    <!--                        </el-popconfirm>-->
                    <!--                      </el-dropdown-item>-->
                    <!--                      <el-dropdown-item command="share">-->
                    <!--                        <el-popconfirm-->
                    <!--                            title="替换为转载消息，当前内容不会保存"-->
                    <!--                            @confirm="handleContent('share')"-->
                    <!--                        >-->
                    <!--                          <div slot="reference"><i class="el-icon-share"></i> 转载</div>-->
                    <!--                        </el-popconfirm>-->
                    <!--                      </el-dropdown-item>-->
                    <!--                    </el-dropdown-menu>-->
                    <!--                  </el-dropdown>-->
                    <div class="opt-item" v-if="form.length>1&&index>0" @click="handleContent('up',index)">
                      <i class="el-icon-top"/>
                    </div>
                    <div class="opt-item" v-if="form.length>1&&index<form.length-1"
                         @click="handleContent('down',index)">
                      <i class="el-icon-bottom"/>
                    </div>
                    <div class="opt-item" v-if="index!==0" @click="handleContent('delete',index)">
                      <i class="el-icon-delete"/>
                    </div>
                  </div>
                </el-popover>

              </div>
              <div class="content-item add-content-item" v-if="form.length<8">
                <span class="el-dropdown-link" @click="handleCreateContent('create')">
                  <i class="el-icon-plus"></i> 添加图文
                </span>
                <!--              <el-dropdown placement="bottom" @command="handleCreateContent">-->
                <!--                <span class="el-dropdown-link">-->
                <!--                  <i class="el-icon-plus"></i> 添加图文-->
                <!--                </span>-->
                <!--                <el-dropdown-menu slot="dropdown">-->
                <!--                  <el-dropdown-item command="create"><i class="el-icon-document"></i> 写新图文</el-dropdown-item>-->
                <!--                  <el-dropdown-item command="choose"><i class="el-icon-document-checked"></i> 选择已有图文-->
                <!--                  </el-dropdown-item>-->
                <!--                  <el-dropdown-item command="picture"><i class="el-icon-picture-outline"></i> 图片消息-->
                <!--                  </el-dropdown-item>-->
                <!--                  <el-dropdown-item command="video"><i class="el-icon-video-play"></i> 视频消息</el-dropdown-item>-->
                <!--                  <el-dropdown-item command="audio"><i class="el-icon-headset"></i> 音频消息</el-dropdown-item>-->
                <!--                  <el-dropdown-item command="share"><i class="el-icon-share"></i> 转载</el-dropdown-item>-->
                <!--                </el-dropdown-menu>-->
                <!--              </el-dropdown>-->
              </div>
            </div>
          </div>
          <div class="center-wrap">
            <div class="card">

              <el-form-item label="标题">
                <el-input v-model="currentFormData.title" maxlength="64" show-word-limit
                          placeholder="请在这里输入标题"/>
              </el-form-item>
              <el-form-item label="作者">
                <el-input v-model="currentFormData.author" maxlength="8" show-word-limit placeholder="请输入作者"/>
              </el-form-item>
              <el-form-item label="内容">
                <div id="editor-toolbar">

                </div>
                <Editor
                    ref="editor"
                    v-model="currentFormData.content"
                    api-key="d05j6hnmh4pwgutpsu6qprw8uf35f1ikos4tv1gc7z6ro0x8"
                    :init="init"
                    tinymceScriptSrc="/plugin/tinymce/tinymce.min.js"
                    @onInit="editorInit"
                />
              </el-form-item>
              <div class="toolbar">
                <BaseBar>
                  <template #left>
                    正文字数：{{ contentWordsCount }}
                  </template>
                  <template #right>
                    <el-row>
                      <el-button type="success" @click="save">存为草稿</el-button>
                      <el-button @click="preview">预览</el-button>
                      <el-button type="primary" @click="showCheckDialog">提交审核</el-button>
                    </el-row>
                  </template>
                </BaseBar>
              </div>
            </div>
          </div>
          <div class="right-wrap">
            <div class="card">
              <el-form-item label="封面">
                <div class="thumb-container"
                     :style="`background-image:url(${thumbnails});aspect-ratio:${currentIndex===0?'2.35/1':'1/1'};width:${currentIndex===0?'100%':'150px'}`"
                     @click="fileSelectDialogVisible = true">
                  <div class="tip" v-if="!currentFormData.thumb">
                    <i class="el-icon-plus"></i>
                    <p>选择封面</p>
                  </div>
                </div>
                <thumb-select :type="currentIndex===0?'wx2.35':'wx1'" :visible="fileSelectDialogVisible"
                              v-if="fileSelectDialogVisible" @confirm="setThumb"
                              @close="fileSelectDialogVisible = false"/>
              </el-form-item>
              <el-form-item label="摘要">
                <el-input v-model="currentFormData.summary" type="textarea" :max="120" :rows="3"
                          placeholder="选填，摘要会在订阅号消息、转发链接等文章外的场景显露，帮助读者快速了解内容，如不填写则默认抓取正文前54字"
                          show-word-limit/>
              </el-form-item>
              <el-form-item>
                <el-switch
                    v-model="currentFormData.original"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                />
                &nbsp;{{ currentFormData.original ? "已声明原创" : "未声明原创" }}
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="currentFormData.sourceEnable">
                  原文链接&nbsp;
                </el-checkbox>
                <el-input v-model="currentFormData.source" size="mini" placeholder="在此输入原文链接"
                          :disabled="!currentFormData.sourceEnable"/>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="currentFormData.commit">允许评论
                </el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-checkbox v-model="currentFormData.collectionEnable">合集&nbsp;
                </el-checkbox>
                <el-select
                    size="mini"
                    clearable
                    :disabled="!currentFormData.collectionEnable"
                    v-model="currentFormData.collection"
                    multiple
                    filterable
                    allow-create
                    placeholder="请选择合集">
                  <el-option
                      v-for="item in collection"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <!--            <el-form-item label="发布时间">-->
              <!--              <el-date-picker-->
              <!--                  style="width: 100%"-->
              <!--                  v-model="postTime"-->
              <!--                  :picker-options="pickerOptions"-->
              <!--                  :default-time="getDefaultTime()"-->
              <!--                  type="datetime"-->
              <!--                  placeholder="选择发布时间"-->
              <!--                  @change="postTimeChange"-->
              <!--                  value-format="yyyy-MM-dd HH:mm:ss"-->
              <!--              >-->
              <!--              </el-date-picker>-->
              <!--            </el-form-item>-->
            </div>
          </div>
        </div>
      </el-form>
      <el-dialog
          title="审核人员"
          :visible.sync="isCheckDialogOpen"
          width="30%"
      >
        <el-form :model="checkUserForm" :rules="checkUserRules" ref="checkUserForm" label-width="100px"
                 class="check-user-form">
          <el-form-item :label="item.level+'人员'" v-for="(item,index) in checkUserForm.checkUser" :key="index"
                        :prop="`checkUser[${index}].uid`"
                        :rules="[{required:true,message:'请选择审核用户',trigger:'blur'}]"
          >
            <div style="display: flex;justify-content: space-between;">
              <el-select v-model="item.uid" placeholder="请选择" clearable filterable>
                <el-option :label="u.nickname?u.nickname:u.username" :value="u.uid" v-for="u in checkUserList"
                           :key="u.id"/>
              </el-select>
              <div class="opt-btn" style="flex-shrink: 0;">
                <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="checkUserRemove(index)"/>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="checkUserAdd" v-if="checkUserForm.checkUser.length!==10">新增</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isCheckDialogOpen = false">取 消</el-button>
          <el-button type="primary" @click="submitCheck">提交审核</el-button>
        </span>
      </el-dialog>
    </div>
    <BackFooter/>
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import BaseImage from "@/components/BaseImage/index.vue";
import BaseBar from "@/components/BaseBar/index.vue";
import DragUpload from "@/components/DragUpload/index.vue";
import {getContentListData, saveContent} from "@/api/content";
import {createUUID} from "@/utils";
import FileSelect from "@/components/FileSelect/index.vue";
import ThumbSelect from "@/views/Content/ContentEditor/ThumbSelect/index.vue";
import {requestUserListSelect} from "@/api/user";
import {imageSrcHandler} from "@/utils/fileUtils";
import BaseHeader from "@/components/BaseHeader/index.vue";
import BackFooter from "@/Layout/BackLayout/BackFooter/index.vue";
import {submitCheck} from "@/api/contentCheck";

export default {
  name: "ContentEditor",
  components: {BackFooter, BaseHeader, ThumbSelect, FileSelect, DragUpload, BaseBar, BaseImage, Editor},
  data() {
    return {
      loading: false,
      currentIndex: 0,
      initialFormItem: () => ({
        subId: createUUID(),
        title: "",
        author: "",
        summary: "",
        content: "",
        source: "",
        thumb: "",
        collection: [],
        original: false,
        sourceEnable: false,
        commit: false,
        collectionEnable: false
      }),
      postTime: null,
      form: [],
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
        language_url: "/plugin/tinymce/lang/zh-Hans.js",
        skin: "xiaolin-editor",
        skin_url: "/plugin/tinymce/skins/ui/xiaolin-editor/",
        plugins: 'autoresize lists link image table code help wordcount quickbars paste',
        placeholder: "从这里开始写正文",
        min_height: 300, //编辑器高度
        resize: false,
        browser_spellcheck: true, // 拼写检查
        elementpath: false, //禁用编辑器底部的状态栏
        // statusbar: false, // 隐藏编辑器底部的状态栏
        paste_data_images: true, // 允许粘贴图像
        menubar: false, //最顶部文字信息
        branding: false, //是否禁用“Powered by TinyMCE”
        toolbar: "undo redo | fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | lineheight forecolor backcolor bold italic underline strikethrough | h1 h2 h3 h4 h5 h6 | link image quicklinkblockquote table numlist bullist code preview fullscreen", //工具栏
        toolbar_mode: "wrap",
        quickbars_selection_toolbar: "undo redo | fontselect fontsizeselect | alignleft aligncenter alignright alignjustify | lineheight forecolor backcolor bold italic underline strikethrough | h1 h2 h3 h4 h5 h6 | link image quicklinkblockquote table numlist bullist code preview fullscreen",
        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
        font_formats: "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
        paste_preprocess: this.editorPastePreprocess,
        paste_webkit_styles: "all"
      },
      editor: null,
      contentWordsCount: 0,
      collection: [],
      contentId: null,
      fileSelectDialogVisible: false,
      selectFile: [],
      isCheckDialogOpen: false,
      checkUserForm: {
        checkUser: [{
          id: "",
          level: "一审",
          uid: "",
          index: 0
        }],
      },
      checkUserRules: {},
      checkUserList: []
    }
  },
  computed: {
    currentFormData() {
      return this.form[this.currentIndex];
    },
    thumbnails() {
      return imageSrcHandler(this.currentFormData.thumb);
    }
  },
  watch: {
    "$route.query.id": function (value) {
      if (value && value !== '') {
        this.contentId = value;
        this.getContentListData();
      }
    }
  },
  created() {
    this.metaUpdate("referrer", "no-referrer", true);
    this.getCheckUserList();
    let contentId = this.$route.query.id;
    if (contentId) {
      this.contentId = contentId;
      getContentListData(contentId).then(res => {
        let data = res.data;
        data.sort((a, b) => a.contentIndex - b.contentIndex);
        this.form = data;
        this.postTime = data[0].postTime;
      });
    } else {
      let initialData = this.initialFormItem();
      initialData.contentIndex = 1;
      this.form.push(initialData);
    }
  },
  beforeDestroy() {
    this.editor.destroy();
    this.metaUpdate("referrer");
  },
  methods: {
    imageSrcHandler,
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
        this.postTime = nowDate;
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
    async getCheckUserList() {
      let {data} = await requestUserListSelect();
      this.checkUserList = data;
    },
    handleCreateContent(command) {
      let initialData = this.initialFormItem();
      initialData.contentIndex = this.form.length + 1;
      switch (command) {
        case "create":
          this.form.push(initialData);
          break;
        default:
          console.log(command);
      }
    },
    handleContent(command, index) {
      let initialData = this.initialFormItem();
      initialData.contentIndex = 1;
      let temp = this.form[index];
      switch (command) {
        case "create":
          this.$set(this.form, 0, initialData);
          break;
        case "delete":
          this.$confirm('此操作将永久删除该内容, 是否继续?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.currentIndex === index) {
              this.currentIndex = index - 1;
            }
            this.form.splice(index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
          break;
        case "up":
          if (index === 0) {
            this.$message({
              type: 'warning',
              message: '已经是第一条了!'
            });
            return;
          }
          this.$set(this.form, index, this.form[index - 1]);
          this.$set(this.form, index - 1, temp);
          this.currentIndex = index - 1;
          break;
        case "down":
          if (index === this.form.length - 1) {
            this.$message({
              type: 'warning',
              message: '已经是最后一条了!'
            });
            return;
          }
          this.$set(this.form, index, this.form[index + 1]);
          this.$set(this.form, index + 1, temp);
          this.currentIndex = index + 1;
          break;
        default:
          console.log(command);
      }
    },
    save() {
      return new Promise((resolve, reject) => {
        for (let i = 0; i < this.form.length; i++) {
          const item = this.form[i];
          item.title = item.title.trim();
          if (item.title.length === 0) {
            this.$message({
              type: 'warning',
              message: '标题不能为空!'
            });
            this.currentIndex = i;
            reject("标题不能为空!");
            return;
          }
        }
        let data = () => {
          return {
            contentId: this.contentId,
            contents: this.form,
            postTime: this.postTime
          }
        }
        saveContent(data()).then(res => {
          this.$message.success(res.message);
          this.contentId = res.data;
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      })
    },
    async preview() {
      this.save().then(() => {
        let {href} = this.$router.resolve({
          path: "/content/preview",
          query: {
            id: this.currentFormData.subId
          }
        });
        window.open(href, "_blank");
      });

    },
    async showCheckDialog() {
      this.save().then(() => {
        this.isCheckDialogOpen = true;
      })
    },
    async submitCheck() {
      this.$refs.checkUserForm.validate((validate) => {
        if (validate) {
          let contents = this.form.map(item => ({
            id: item.subId,
            title: item.title
          }));
          let data = {
            checkUser: this.checkUserForm.checkUser,
            contents
          }
          submitCheck(data).then(res => {
            this.$message.success(res.message);
            this.isCheckDialogOpen = false;
          })
        }
      })
    },
    setThumb(url) {
      this.currentFormData.thumb = url;
      this.fileSelectDialogVisible = false;
    },
    handleCloseDialog() {
      this.selectFile = [];
      this.fileSelectDialogVisible = false;
    },
    async editorPastePreprocess(editor, {content}) {
      let r = RegExp(/<[img]+\s+(.*?)(?<id>\w*?)[\s'"](.*?)>/g);
      let matchResult = content.match(r);//返回数组['<img ... />','<img ... />']
      // console.log("matchResult===", matchResult)
      if (matchResult) {
        for (const item of matchResult) {
          const index = matchResult.indexOf(item);
          // let len = item.length
          // let _str = item.slice(0, len - 2);//追加之后的img
          // console.log(index, item, _str)
          // content = content.replace(item, _str)
          let reg = /src=['"]?([^'"]*)['"]?/;
          let match = item.match(reg);
          if (match[1]) {
            // 网络图片转为base64图片
            let base64Image = await this.internetImageToBase64(match[1]);
            let image = item.replace(match[1], base64Image);
            content = content.replace(item, image);
          }
        }
      }
      // this.actContents = parseHtml(contents);
    },
    internetImageToBase64(src) {
      return new Promise((resolve) => {
        let image = new Image();
        image.setAttribute('crossOrigin', 'Anonymous'); // 解决跨域
        image.setAttribute("referrer", "no-referrer");
        image.onload = function () {
          let canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          let base64Data = canvas.toDataURL("image/png", 1); //得到图片的base64编码数据
          resolve(base64Data);
        }
        image.src = src;
      });
    },
    metaUpdate(name, content, isAdd) {
      if (isAdd) {
        const meta = document.createElement('meta');
        meta.content = content;
        meta.name = name;
        meta.id = name;
        document.getElementsByTagName('head')[0].appendChild(meta);
      } else {
        document.getElementsByTagName('head')[0].removeChild(document.getElementById(name));
      }
    },
    checkUserAdd() {
      let index = this.checkUserForm.checkUser.length;
      if (index === 10) {
        this.$message.error("最多添加十位审核人员！");
        return;
      }
      let levelList = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十",];
      let data = {
        id: "",
        level: `${levelList[index]}审`,
        uid: "",
        index
      }
      this.checkUserForm.checkUser.push(data)
    },
    checkUserRemove(index) {
      this.checkUserForm.checkUser.splice(index, 1);
    }
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
  padding: calc(var(--back-header-height) + var(--margin-y)) var(--padding-x) 0;

  .card {
    max-height: calc(100vh - 10rem);
    overflow: auto;
  }

  .left-wrap {
    width: 370px;
    min-width: 370px;
    position: sticky;
    top: calc(var(--back-header-height) + var(--margin-y));
    overflow: auto;

    .content-list {
      width: 310px;
      user-select: none;

      .content-item {
        width: 100%;
        height: 72px;
        cursor: pointer;
        position: relative;
        margin-top: var(--margin-y);

        .content-info {
          position: relative;
          width: 100%;
          height: 100%;
          border: 2px solid var(--panel-border-color);
          border-radius: .5rem;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: .5rem;

          .content-title {
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-weight: 400;
          }

          .content-thumb {
            width: 48px;
            min-width: 48px;
            height: 48px;
            min-height: 48px;
            background-color: #E1E1E1;
            border-radius: .5rem;
            overflow: hidden;
            background-position: center;
            background-size: cover;
          }

          &:hover ~ .content-opt {
            opacity: 1;
          }
        }


        &:first-child {
          margin-top: unset;
          height: 130px;

          .content-info {
            padding: unset;
            border-color: #E1E1E1;

            .content-title {
              position: absolute;
              left: 15px;
              right: 15px;
              bottom: 15px;
              color: #ffffff;
            }

            .content-thumb {
              width: 100%;
              height: 100%;
              border-radius: unset;
            }

            &::before {
              content: " ";
              position: absolute;
              left: 0;
              right: 0;
              top: 55px;
              bottom: 0;
              background-color: rgba(0, 0, 0, 0);
              background-image: linear-gradient(-180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.15) 86%);
            }
          }
        }

        &.active .content-info {
          border-color: var(--panel-border-primary-color);
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

    .card {
      position: relative;
      min-height: 350px;
      padding-bottom: unset;

      :deep(.tox-tinymce) {
        border: 1px solid #DCDFE6;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);

        .tox-edit-area {
          cursor: text;
        }

        &:hover {
          border-color: #C0C4CC;
        }
      }

      .toolbar {
        margin: var(--margin-y) -1rem -1rem;
        position: sticky;
        bottom: 0;
        padding: var(--margin-y) var(--margin-x);
        background-color: #ffffff;
        border-top: 1px solid var(--panel-border-color);
        border-radius: 0 0 .5rem .5rem;
        overflow: hidden;
        z-index: 999;
      }
    }
  }

  .right-wrap {
    flex-grow: 1;
    min-width: 300px;
    max-width: 420px;
    position: sticky;
    top: calc(var(--back-header-height) + var(--margin-y));
    //max-height: calc(100vh - 15rem);
    //overflow: auto;

    .card {
      .thumb-container {
        margin: 0 auto;
        cursor: pointer;
        display: block;
        width: 100%;
        aspect-ratio: 2.35/1;
        box-sizing: border-box;
        border: 2px dashed var(--panel-border-color);
        text-align: center;
        padding-top: 12px;
        //transition: all 0.1s;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        transition: all .5s cubic-bezier(.4, 0, 1, 1);

        .tip {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-light-color);
        }

        &:hover {
          border-color: var(--panel-border-hover-color);
        }
      }
    }
  }
}

.content-opt {
  cursor: default;
  //position: absolute;
  //top: 0;
  //right: -75px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  //padding: .5rem;
  border-radius: 24px;
  //opacity: 1;
  //transition: opacity .5s cubic-bezier(.4, 0, 1, 1);

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

</style>
<template>
  <div class="check-view-container">
    <el-page-header class="check-view-header" @back="$router.back()" content="详情页面">
      <template #content>
        <div class="header-content">
          <div class="title">{{ content.title }}</div>
        </div>
      </template>
    </el-page-header>
    <div class="drawing-board-container">
      <div class="tool-bar" style="position: relative">
        <div class="mask" :class="isShowResult?'hidden':''"></div>
        <div class="tool-list">
          <div class="tool-item" :class="activeDrawToolIndex===item.id?'active':''" v-for="item in tools" :key="item.id"
               @click="item.handler()">
            <div class="tool-icon">
              <svg-icon :name="item.icon"></svg-icon>
            </div>
            <div class="tool-title">{{ item.title }}</div>
          </div>
        </div>
        <div class="divider-line" v-if="activeDrawToolIndex!==5&&activeDrawToolIndex!==7"></div>
        <div class="color-picker" v-if="activeDrawToolIndex!==5&&activeDrawToolIndex!==7">
          <div class="color-picker-item" v-if="activeDrawToolIndex===1">
            <div class="picker">
              <el-color-picker v-model="options.brushColor" color-format="hex" show-alpha></el-color-picker>
            </div>
            <div class="title">画笔颜色</div>
            <div class="value">{{ options.brushColor ? options.brushColor : '透明' }}</div>
          </div>
          <div class="color-picker-item"
               v-if="activeDrawToolIndex===2||activeDrawToolIndex===3||activeDrawToolIndex===4">
            <div class="picker">
              <el-color-picker v-model="options.strokeColor" color-format="hex" show-alpha></el-color-picker>
            </div>
            <div class="title">描边颜色</div>
            <div class="value">{{ options.strokeColor ? options.strokeColor : '透明' }}</div>
          </div>
          <div class="color-picker-item" v-if="activeDrawToolIndex===3||activeDrawToolIndex===4">
            <div class="picker">
              <el-color-picker v-model="options.fillColor" color-format="hex" show-alpha></el-color-picker>
            </div>
            <div class="title">填充颜色</div>
            <div class="value">{{ options.fillColor ? options.fillColor : '透明' }}</div>
          </div>
          <div class="color-picker-item" v-if="activeDrawToolIndex===6">
            <div class="picker">
              <el-color-picker v-model="options.textColor" color-format="hex" show-alpha></el-color-picker>
            </div>
            <div class="title">文字颜色</div>
            <div class="value">{{ options.textColor ? options.textColor : '透明' }}</div>
          </div>
        </div>
        <div class="divider-line"></div>
        <div class="size-control" v-if="activeDrawToolIndex!==7">
          <div class="size-control-item" v-if="activeDrawToolIndex===1">
            <div class="title">画笔尺寸
              <span class="emphasize">{{ options.brushSize }}px</span>
            </div>
            <div class="slider">
              <el-slider v-model="options.brushSize" :min="1"></el-slider>
            </div>
          </div>
          <div class="size-control-item" v-else-if="activeDrawToolIndex===5">
            <div class="title">橡皮尺寸
              <span class="emphasize">{{ options.rubberSize }}px</span>
            </div>
            <div class="slider">
              <el-slider v-model="options.rubberSize" :min="10"></el-slider>
            </div>
          </div>
          <div class="size-control-item" v-else-if="activeDrawToolIndex===6">
            <div class="title">文字大小
              <span class="emphasize">{{ options.fontSize }}px</span>
            </div>
            <div class="slider">
              <el-slider v-model="options.fontSize" :min="12" :max="72"></el-slider>
            </div>
          </div>
          <div class="size-control-item" v-else>
            <div class="title">描边尺寸
              <span class="emphasize">{{ options.brushSize }}px</span>
            </div>
            <div class="slider">
              <el-slider v-model="options.brushSize" :min="1"></el-slider>
            </div>
          </div>
          <div class="tool-list" v-if="activeDrawToolIndex===6" style="margin-top: var(--margin-y);">
            <div class="tool-item" :class="options.fontWeight===600?'active':''"
                 @click="options.fontWeight = options.fontWeight===600?300:600">
              <div class="tool-icon">
                <!--                <svg-icon :name=""></svg-icon>-->
                B
              </div>
              <div class="tool-title">粗体</div>
            </div>
          </div>
        </div>
        <div class="divider-line" v-if="activeDrawToolIndex!==7"></div>
        <!--        <div class="zoom-control tool-list">-->
        <!--          <div class="tool-item">-->
        <!--            <div class="tool-icon">-->
        <!--              <svg-icon name="zoom-in"/>-->
        <!--            </div>-->
        <!--            <div class="tool-title">放大</div>-->
        <!--          </div>-->
        <!--          <div class="tool-item">-->
        <!--            <div class="tool-icon">-->
        <!--              <svg-icon name="zoom-out"/>-->
        <!--            </div>-->
        <!--            <div class="tool-title">缩小</div>-->
        <!--          </div>-->
        <!--          <div class="tool-item">-->
        <!--            <div class="tool-icon">-->
        <!--              <svg-icon name="zoom-reset"/>-->
        <!--            </div>-->
        <!--            <div class="tool-title">重置</div>-->
        <!--          </div>-->
        <!--          <div class="scaling">100%</div>-->
        <!--        </div>-->
        <!--        <div class="divider-line"></div>-->
        <div class="draw-control tool-list">
          <div class="tool-item" :class="currentDraw.hasPrev?'':'disabled'" @click="handleCancel">
            <div class="tool-icon">
              <svg-icon name="cancel"/>
            </div>
            <div class="tool-title">撤销</div>
          </div>
          <div class="tool-item" :class="currentDraw.hasNext?'':'disabled'" @click="handleReDo">
            <div class="tool-icon">
              <svg-icon name="redo"/>
            </div>
            <div class="tool-title">重做</div>
          </div>
          <div class="tool-item" @click="handleClear">
            <div class="tool-icon">
              <svg-icon name="clear"/>
            </div>
            <div class="tool-title">清空</div>
          </div>
        </div>
      </div>
      <div class="drawing-board card" ref="board">
        <div class="text-input-container" ref="textInputContainer">
          <input class="drawInput el-input__inner" v-model="text" placeholder="请输入文字"
                 ref="textInput"
                 :style="`cursor:${cursor};color:${options.textColor};font-size:${options.fontSize}px;font-family:${options.fontFamily};font-weight:${options.fontWeight};height:${options.fontSize+40}px;line-height:${options.fontSize+40}px;`"/>
          <div class="opt-btn" :style="`height:${options.fontSize+40}px;`">
            <el-button type="success" icon="el-icon-check" size="mini" circle @click="handleTextInputConfirm(true)"/>
            <el-button type="danger" icon="el-icon-close" size="mini" circle @click="handleTextInputConfirm(false)"/>
          </div>
        </div>
        <div class="eraser" ref="eraser"
             @mousedown="handleMouseDown"
             @mouseup="handleMouseUp"
             @mousemove="handleMouseMove"
             :style="`width:${options.rubberSize}px;height:${options.rubberSize}px;left:${this.currentDraw.tx - options.rubberSize / 2}px;top:${this.currentDraw.ty - options.rubberSize / 2}px;`"></div>
        <canvas class="drawCanvas" ref="drawCanvas"
                @mousedown="handleMouseDown"
                @mouseup="handleMouseUp"
                @mousemove="handleMouseMove"
                v-show="isShowResult"
                :style="`cursor:${cursor}; width:${currentDraw.width}px;height:${currentDraw.height}px;z-index:5;`"></canvas>
        <canvas class="drawCanvas" ref="baseCanvas"
                :style="`width:${currentDraw.width}px;height:${currentDraw.height}px;`" v-show="isShowResult"></canvas>
        <!--        width:${currentDraw.width}px;height:${currentDraw.height}px;-->
        <div class="check-result-container" :style="`width:${currentDraw.width}px;height:${currentDraw.height}px;`">
          <div class="result-item" v-for="item in checkUserList" :key="item.id">
            <img :src="imageSrcHandler(item.checkResult)"
                 v-if="item.checkResult&&item.checkResult!==''&&item.isShowResult" alt="">
          </div>
        </div>
        <div class="rich-text-content" ref="richContent"
             draggable="false"
             ondragstart="return false;">
        </div>
      </div>
      <div class="tool-bar">
        <div class="audit-user-list">
          <div class="audit-user-item" :class="item.isCurrent?'is-current':''" v-for="item in checkUserList"
               :key="item.id">
            <div class="user-info-container">
              <div class="thumb"
                   :style="`background-image:url(/api/upload/avatar/b1cbdbd6aef54908be265ef9ad419de8.png);`"></div>
              <div class="info">
                <div class="nickname">{{ item.user.nickname ? item.user.nickname : item.user.username }}</div>
                <div class="level">{{ item.level }}</div>
              </div>
            </div>
            <div class="result">
              <div class="status">
                <el-tag :type="statusTag(item.status).type">{{ statusTag(item.status)?.title }}</el-tag>
              </div>
              <div class="is-show" v-if="item.isCurrent||(item.checkResult&&item.checkResult!=='')">
                <label @click="item.isShowResult = !item.isShowResult">显示批注：</label>
                <el-switch v-model="item.isShowResult"></el-switch>
              </div>
            </div>
          </div>
        </div>
        <div class="divider-line"></div>
        <div class="show-canvas">
          <label>显示画布：</label>
          <el-switch v-model="isShowResult"></el-switch>
        </div>
        <div class="divider-line"></div>
        <div class="tool-list">
          <div class="tool-item" v-for="item in operations" :key="item.id"
               @click="item.handler()">
            <div class="tool-icon" :style="item.color?`color:${item.color}`:''">
              <svg-icon :name="item.icon"></svg-icon>
            </div>
            <div class="tool-title">{{ item.title }}</div>
          </div>
        </div>
        <!--        <div class="divider-line"></div>-->
        <!--        <div class="remarks">-->
        <!--          <el-input type="textarea" v-model="commit" :maxlength="500" placeholder="在此输入审核意见"/>-->
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
import richText from "@/assets/data/richText"
import cursors from "@/assets/images/base64/cursors"
import {getCheckInfo, submitCheckResult} from "@/api/contentCheck";
import {imageSrcHandler} from "@/utils/fileUtils";

export default {
  name: "ContentCheckView",
  data() {
    return {
      activeDrawToolIndex: 7,
      tools: [
        {
          id: 7,
          icon: "move",
          title: "箭头",
          handler: () => {
            this.activeDrawToolIndex = 7;
          }
        }, {
          id: 1,
          icon: "painting-brush",
          title: "画笔",
          handler: () => {
            this.activeDrawToolIndex = 1;
            this.currentDraw.cursorOffsetY = 20;
          }
        },
        {
          id: 2,
          icon: "line",
          title: "直线",
          handler: () => {
            this.activeDrawToolIndex = 2;
            this.currentDraw.cursorOffsetX = -5;
            this.currentDraw.cursorOffsetY = -5;
          }
        },
        {
          id: 3,
          icon: "circle",
          title: "圆形",
          handler: () => {
            this.activeDrawToolIndex = 3;
            this.currentDraw.cursorOffsetX = -5;
            this.currentDraw.cursorOffsetY = -5;
          }
        },
        {
          id: 4,
          icon: "rectangle",
          title: "矩形",
          handler: () => {
            this.activeDrawToolIndex = 4;
            this.currentDraw.cursorOffsetX = -5;
            this.currentDraw.cursorOffsetY = -5;
          }
        },
        {
          id: 5,
          icon: "rubber",
          title: "橡皮",
          handler: () => {
            this.activeDrawToolIndex = 5;
          }
        },
        {
          id: 6,
          icon: "text",
          title: "文字",
          handler: () => {
            this.activeDrawToolIndex = 6;
          }
        }],
      operations: [
        {
          id: 1,
          icon: "save",
          title: "保存批注",
          handler: () => {
            this.saveCheckResult(2);
          }
        },
        {
          id: 2,
          icon: "pass",
          title: "审核通过",
          color: "#67C23A",
          handler: () => {
            this.saveCheckResult(3);
          }
        },
        {
          id: 3,
          icon: "fail",
          title: "退回稿件",
          color: "#F56C6C",
          handler: () => {
            this.saveCheckResult(0);
          }
        }
      ],
      options: {
        brushColor: "#000000",
        strokeColor: "#000000",
        fillColor: null,
        textColor: "#1e293b",
        brushSize: 1,
        rubberSize: 1,
        fontSize: 14,
        fontFamily: "sans-serif",
        fontWeight: 300,

      },
      board: null,
      drawCanvas: null,
      baseCanvas: null,
      ctx: null,
      baseCtx: null,
      text: "",
      drawHistory: [],
      currentDraw: {
        width: 0,
        height: 0,
        scale: 1,
        index: 0,
        cursorOffsetX: 0,
        cursorOffsetY: 0,
        mx: 0,
        my: 0,
        tx: 0,
        ty: 0,
        hasPrev: false,
        hasNext: false
      },
      content: {},
      checkUserList: [
        {
          id: 1,
          nickname: "小王",
          thumb: "",
          level: "一级审核",
          status: 3,
          isShowResult: false,
          isCurrent: false
        }, {
          id: 2,
          nickname: "小张",
          thumb: "",
          level: "二级审核",
          status: 3,
          isShowResult: false,
          isCurrent: false
        }, {
          id: 3,
          nickname: "小林",
          thumb: "",
          level: "三级审核",
          status: 2,
          isShowResult: true,
          isCurrent: true
        }
      ],
      currentCheckIndex: -1,
      drawing: false,
      saveImage: false,
      isShowResult: true,
      commit: "",
      processIndex: -1,
      checkVersion: 1
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    cursor() {
      let cursor = ""
      switch (this.activeDrawToolIndex) {
        case 1:
          cursor = `url('${cursors.pen}'),auto`;
          break;
        case 2:
          cursor = `crosshair`;
          break;
        case 3:
          cursor = `crosshair`;
          break;
        case 4:
          cursor = `crosshair`;
          break;
        case 5:
          cursor = `none`;
          // cursor = `url('${cursors.eraser}'),auto`;
          break;
        case 6:
          cursor = `url('${cursors.text}'),auto`;
          break;
        case 7:
          cursor = `url('${cursors.move}'),auto`;
          break;
        default:
          cursor = `url('${cursors.move}'),auto`;
          break;
      }
      return cursor;
    }
  },
  watch: {
    activeDrawToolIndex(value) {
      if (value === 5) {
        this.$refs.eraser.style.display = 'block';
      } else {
        this.$refs.eraser.style.display = 'none';
      }
    },
    '$route.params.id': {
      handler(value) {
        this.getRichText();
      },
      immediate: true
    }
  },
  methods: {
    imageSrcHandler,
    statusTag(status) {
      let tag = {}
      switch (status) {
        case 0:
          tag.title = "已退回";
          tag.type = "danger";
          break;
        case 1:
          tag.title = "待审核";
          tag.type = "info";
          break;
        case 2:
          tag.title = "正在审核";
          tag.type = "";
          break;
        case 3:
          tag.title = "已通过";
          tag.type = "success";
          break;
      }
      return tag;
    },
    getRichText() {
      if (this.id) {
        getCheckInfo(this.id).then(res => {
          let {data} = res;
          this.content = data.content;
          this.processIndex = data.processIndex;
          this.checkVersion = data.checkVersion;
          this.checkUserList = data.checkUsers.map(item => {
            let isShowResult = data.processIndex === item.index;
            let isCurrent = data.processIndex === item.index;
            return {
              isCurrent,
              isShowResult,
              ...item
            }
          });
          this.initialDraw();
        })
      } else {
        this.$message.error("参数错误");
      }
    },
    initialDraw() {
      this.$nextTick(() => {
        this.board = this.$refs.board;
        const richContent = this.$refs.richContent;
        richContent.innerHTML = this.content.content;
        try {
          this.currentDraw.width = this.board.scrollWidth;
          this.currentDraw.height = this.board.scrollHeight;
          this.drawCanvas = this.$refs.drawCanvas
          this.drawCanvas.width = this.currentDraw.width;
          this.drawCanvas.height = this.currentDraw.height;
          this.ctx = this.drawCanvas.getContext("2d");
          this.baseCanvas = this.$refs.baseCanvas
          this.baseCanvas.width = this.currentDraw.width;
          this.baseCanvas.height = this.currentDraw.height;
          this.baseCtx = this.baseCanvas.getContext("2d");
          this.drawHistory.push(this.drawCanvas.toDataURL());
          window.tempDrawUrl = [];
        } catch (e) {
          this.currentDraw.width = 0;
          this.currentDraw.height = 0;
          this.drawCanvas = null;
          this.ctx = null;
          this.baseCanvas = null;
          this.baseCtx = null;
          console.log(e)
          this.$message.error("初始化失败[" + e + "]，请重试")
        }

      })
    },
    handleMouseDown(e) {
      if (this.activeDrawToolIndex === 7) {
        console.log("")
      } else {
        this.ctx.lineCap = 'round';
        this.drawing = true
        this.currentDraw.mx = e.clientX - this.drawCanvas.offsetLeft - this.board.offsetLeft + this.board.scrollLeft + this.currentDraw.cursorOffsetX;
        this.currentDraw.my = e.clientY - this.drawCanvas.offsetTop - this.board.offsetTop + this.board.scrollTop + this.currentDraw.cursorOffsetY;
        this.ctx.moveTo(this.currentDraw.mx, this.currentDraw.my);
        // console.log("startTo-x:", e.clientX - this.drawCanvas.offsetLeft - this.board.offsetLeft, "startTo-y:", e.clientY - this.drawCanvas.offsetTop - this.board.offsetTop)
        this.ctx.lineWidth = this.options.brushSize;
        let baseImage = null;
        let textInputContainer = this.$refs.textInputContainer;
        let textInput = this.$refs.textInput;
        switch (this.activeDrawToolIndex) {
          case 1:
            this.ctx.strokeStyle = this.options.brushColor;
            this.ctx.beginPath();
            break;
          case 5:
            this.currentDraw.cursorOffsetX = this.options.rubberSize / 2;
            this.currentDraw.cursorOffsetY = this.options.rubberSize / 2;
            break;
          case 6:
            this.text = "";
            textInputContainer.style.left = e.clientX + 'px';
            textInputContainer.style.top = e.clientY + 'px';
            textInputContainer.style.display = 'flex';
            setTimeout(() => textInput.focus(), 100)
            // textInput.style.width = (this.board.clientWidth - this.currentDraw.mx - 10 >= 120 ? this.board.clientWidth - this.currentDraw.mx - 10 : 120) + 'px';
            break;
          default:
            this.ctx.strokeStyle = this.options.strokeColor ? this.options.strokeColor : 'rgba(0,0,0,0)';
            this.ctx.fillStyle = this.options.fillColor ? this.options.fillColor : 'rgba(0,0,0,0)';
        }
        this.handleMouseMove(e);
      }
    },
    handleMouseUp(e) {
      if (this.activeDrawToolIndex === 7) {
        return;
      }
      if (this.activeDrawToolIndex !== 6) {
        // switch (this.activeDrawToolIndex) {
        //
        // }
        const dataURL = this.drawCanvas.toDataURL();
        let image = new Image();
        const _this = this;
        this.saveImage = true;
        image.onload = function () {
          _this.ctx.clearRect(0, 0, _this.currentDraw.width, _this.currentDraw.height);
          _this.baseCtx.drawImage(
              this,
              0,
              0,
              _this.currentDraw.width,
              _this.currentDraw.height
          );
          const tempImage = _this.baseCanvas.toDataURL();
          if (_this.drawHistory.length > 1 && _this.drawHistory.length !== (_this.currentDraw.index + 1)) {
            _this.drawHistory.splice(_this.currentDraw.index + 1)
          }
          _this.drawHistory.push(tempImage);
          _this.currentDraw.index++;
          _this.saveImage = false;
        }
        image.src = dataURL;
        this.currentDraw.hasPrev = true;
        this.currentDraw.hasNext = false;
        this.drawing = false
      }
    },
    handleMouseMove(e) {
      if (this.activeDrawToolIndex === 5 && this.drawing === false) {
        this.currentDraw.tx = e.clientX - this.drawCanvas.offsetLeft - this.board.offsetLeft + this.board.scrollLeft + this.currentDraw.cursorOffsetX;
        this.currentDraw.ty = e.clientY - this.drawCanvas.offsetTop - this.board.offsetTop + this.board.scrollTop + this.currentDraw.cursorOffsetY;
      }
      if (!this.drawing || this.saveImage) {
        return;
      }
      this.currentDraw.tx = e.clientX - this.drawCanvas.offsetLeft - this.board.offsetLeft + this.board.scrollLeft + this.currentDraw.cursorOffsetX;
      this.currentDraw.ty = e.clientY - this.drawCanvas.offsetTop - this.board.offsetTop + this.board.scrollTop + this.currentDraw.cursorOffsetY;
      let radius = 0;
      let rx = 0;
      let ry = 0;
      let baseImage = null;
      switch (this.activeDrawToolIndex) {
        case 1:
          this.ctx.lineTo(this.currentDraw.tx, this.currentDraw.ty);
          this.ctx.stroke();
          break;
        case 2:
          this.clearDraw();
          this.ctx.beginPath();
          this.ctx.moveTo(this.currentDraw.mx, this.currentDraw.my);
          this.ctx.lineTo(this.currentDraw.tx, this.currentDraw.ty);
          this.ctx.stroke();
          break;
        case 3:
          this.clearDraw();
          this.ctx.beginPath();
          rx = (this.currentDraw.tx - this.currentDraw.mx) / 2;
          ry = (this.currentDraw.ty - this.currentDraw.my) / 2;
          radius = Math.sqrt(rx * rx + ry * ry);
          this.ctx.arc(this.currentDraw.tx - radius, this.currentDraw.ty - radius, radius, 0, Math.PI * 2, false);
          this.ctx.stroke();
          this.ctx.fill();
          break;
        case 4:
          this.clearDraw();
          this.ctx.beginPath();
          this.ctx.rect(this.currentDraw.mx, this.currentDraw.my, Math.abs(this.currentDraw.tx - this.currentDraw.mx), Math.abs(this.currentDraw.ty - this.currentDraw.my))
          this.ctx.stroke();
          this.ctx.fill();
          break;
        case 5:
          this.baseCtx.clearRect(this.currentDraw.tx - this.options.rubberSize / 2, this.currentDraw.ty - this.options.rubberSize / 2, this.options.rubberSize, this.options.rubberSize);
          break;
      }
    },
    clearDraw() {
      this.ctx.clearRect(0, 0, this.currentDraw.width, this.currentDraw.height);
    },
    handleClear() {
      if (this.baseCanvas.toDataURL() === this.drawHistory[0]) {
        return;
      }
      if (this.drawHistory.length > 1 && this.drawHistory.length !== (this.currentDraw.index + 1)) {
        this.drawHistory.splice(this.currentDraw.index + 1)
      }
      this.drawCanvasImage(this.drawHistory[0]);
      this.drawHistory.push(this.drawHistory[0]);
      this.currentDraw.index++;
      this.currentDraw.hasNext = false;
    },
    handleCancel() {
      if (this.currentDraw.index === 0) {
        this.currentDraw.hasPrev = false;
        return;
      }
      let url = this.drawHistory[--this.currentDraw.index];
      this.drawCanvasImage(url);
      this.currentDraw.hasNext = true
      if (this.currentDraw.index === 0) {
        this.currentDraw.hasPrev = false;
      }
    },
    handleReDo() {
      if (this.currentDraw.index + 1 === this.drawHistory.length) {
        this.currentDraw.hasNext = false;
        return;
      }
      let url = this.drawHistory[++this.currentDraw.index];
      this.drawCanvasImage(url);
      this.currentDraw.hasPrev = true
      if (this.currentDraw.index + 1 === this.drawHistory.length) {
        this.currentDraw.hasNext = false;
      }
    },
    handleTextInputConfirm(isSave) {
      if (isSave) {
        this.ctx.font = `${this.options.fontWeight} ${this.options.fontSize}px ${this.options.fontFamily}`;
        this.ctx.fillStyle = this.options.textColor;
        this.ctx.fillText(this.text, this.currentDraw.mx, this.currentDraw.my);
        const dataURL = this.drawCanvas.toDataURL();
        let image = new Image();
        const _this = this;
        this.saveImage = true;
        image.onload = function () {
          _this.ctx.clearRect(0, 0, _this.currentDraw.width, _this.currentDraw.height);
          _this.baseCtx.drawImage(
              this,
              0,
              0,
              _this.currentDraw.width,
              _this.currentDraw.height
          );
          const tempImage = _this.baseCanvas.toDataURL();
          if (_this.drawHistory.length > 1 && _this.drawHistory.length !== (_this.currentDraw.index + 1)) {
            _this.drawHistory.splice(_this.currentDraw.index + 1)
          }
          _this.drawHistory.push(tempImage);
          _this.currentDraw.index++;
          _this.saveImage = false;
        }
        image.src = dataURL;
        this.currentDraw.hasPrev = true;
        this.currentDraw.hasNext = false;
      }
      this.drawing = false
      this.$refs.textInputContainer.style.display = 'none';
      this.text = "";
    },
    drawCanvasImage(url) {
      let image = new Image();
      const _this = this;
      image.onload = function () {
        _this.ctx.clearRect(0, 0, _this.currentDraw.width, _this.currentDraw.height);
        _this.baseCtx.clearRect(0, 0, _this.currentDraw.width, _this.currentDraw.height);
        _this.baseCtx.drawImage(
            this,
            0,
            0,
            _this.currentDraw.width,
            _this.currentDraw.height
        );
      }
      image.src = url;
    },
    saveCheckResult(status) {
      let data = {
        id: this.id,
        processIndex: this.processIndex,
        checkVersion: this.checkVersion,
        status,
        checkResult: this.baseCanvas.toDataURL(),
        commit: this.commit
      }
      submitCheckResult(data).then(res => {
        this.$message.success(res.message);
        if (status === 3 || status === 0) {
          this.$router.back();
        }
      })
    },
    passContentCheck() {

    },
    failContentCheck() {

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
  },
  created() {
    // console.log(this)
    // this.initialDraw()
    this.metaUpdate("referrer", "no-referrer", true);
    this.getRichText();
  },
  beforeDestroy() {
    this.metaUpdate("referrer");
  }
}
</script>

<style lang="less" scoped>
.check-view-container {
  min-width: 1400px;
  height: 100%;
  position: relative;

  :deep(.check-view-header) {
    width: 100%;
    height: var(--back-header-height);
    position: fixed;
    top: 0;
    left: 0;
    padding: var(--padding-y) var(--padding-x);
    display: flex;
    align-items: center;
    background-color: #fff;
    box-shadow: var(--shadow);

    .el-page-header__left {
      flex-shrink: 0;
    }

    .el-page-header__content {
      width: 100%;
      padding-right: 92px;
    }

    .header-content {
      width: 100%;
      display: flex;
      gap: var(--margin-x);
      justify-content: center;
      align-items: center;
    }
  }

  .drawing-board-container {
    padding-top: calc(var(--back-header-height) + var(--margin-y));
    padding-bottom: var(--margin-y);
    height: 100%;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;

    .tool-bar {
      position: relative;
      width: 300px;
      //height: 400px;
      overflow: auto;
      background-color: var(--bg-white);
      box-shadow: var(--shadow);
      border-radius: .5rem;
      padding: var(--padding-y) var(--padding-x);
      overflow-x: hidden;

      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--panel-background-color);
        opacity: 1;
        transition: opacity .5s cubic-bezier(.4, 0, 1, 1);
        z-index: 10;

        &.hidden {
          width: 0;
          height: 0;
          opacity: 0;
        }
      }

      .tool-list {
        display: flex;
        justify-content: center;
        gap: var(--margin-y) var(--margin-y);
        flex-wrap: wrap;

        .tool-item {
          width: 70px;
          height: 70px;
          color: var(--text-light-color);
          border-radius: .5rem;
          border: 2px solid var(--panel-border-hover-color);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          user-select: none;
          cursor: pointer;

          .tool-icon {
            width: 30px;
            height: 30px;
          }

          .tool-title {
            font-size: 14px;
            font-weight: 600;
          }

          &:hover {
            background-color: var(--bg-light-primary);
          }

          &:active {
            color: var(--text-white);
            background-color: var(--bg-dark-primary);
            border-color: var(--panel-border-primary-color);

            .tool-icon {
              color: var(--text-white) !important;
            }
          }

          &.active {
            color: var(--text-white);
            background-color: var(--bg-dark-primary);
            border-color: var(--panel-border-primary-color);
          }
        }
      }

      .divider-line {
        margin: var(--margin-y) 0;
        width: 100%;
        height: 1px;
        background-color: var(--bg-dark-gray-60);
      }

      .color-picker {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: var(--margin-x);

        .color-picker-item {
          //width: 70px;
          //height: 70px;
          color: var(--text-light-color);
          border-radius: .5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          user-select: none;
          //white-space: nowrap;

          .title {
            font-size: 14px;
            font-weight: 600;
            color: var(--text-light-color);
          }

          .value {
            color: var(--text-light-sub-color);
            font-size: 10px;
          }

          .picker {
            :deep(.el-color-picker) {
              .el-color-picker__trigger {
                padding: 0;
                border: 2px solid var(--panel-border-hover-color);
                border-radius: .5rem;
                overflow: hidden;

                .el-color-picker__color {
                  border: none;
                }
              }
            }
          }
        }
      }

      .size-control {
        .size-control-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--padding-x);

          .title {
            flex-shrink: 0;
            color: var(--text-light-color);
            font-weight: 600;
            font-size: 14px;

            .emphasize {
              display: inline-block;
              width: 45px;
              text-align: center;
            }
          }

          .slider {
            flex-shrink: 0;
            flex-grow: 1;
          }
        }
      }

      .zoom-control {
        .scaling {
          font-size: 12px;
          text-align: center;
          font-weight: 600;
          color: var(--text-light-sub-color);
        }
      }

      .draw-control {
        .tool-item {
          &.disabled {
            cursor: not-allowed;
            background-color: var(--bg-dark-gray);

            &:active {
              color: var(--text-light-color);
              background-color: var(--bg-dark-gray);
              border-color: var(--panel-border-hover-color);

              .tool-icon {
                color: var(--text-light-color) !important;
              }
            }
          }
        }
      }
    }

    .drawing-board {
      position: relative;
      user-select: none;
      max-height: 100%;
      height: 100%;
      overflow: auto;
      width: 768px;
      min-width: 375px;
      padding: 0;
      border: 5px solid var(--panel-border-primary-color);
      //padding: var(--padding-y) var(--padding-x);
      //background-color: var(--bg-light-primary);
      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      .text-input-container {
        position: fixed;
        display: none;
        top: 0;
        left: 0;
        z-index: 6;
        align-items: center;

        .drawInput {
          width: 381px;
          border-width: 2px;
          border-radius: .5rem;
          padding-right: calc(81px + var(--padding-x));
        }

        .opt-btn {
          position: absolute;
          top: 0;
          right: var(--padding-x);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }
      }

      .eraser {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 50px;
        height: 50px;
        overflow: hidden;
        border: 2px solid var(--panel-border-primary-color);
        background-color: var(--bg-dark-gray-60);
        z-index: 6;
        display: none;
      }

      .drawCanvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        //border: 5px solid var(--panel-border-primary-color);
        //border: 2px solid var(--panel-border-primary-color);
      }

      .rich-text-content {
        width: 100%;
        -webkit-user-drag: none;
        //border: 1px solid var(--panel-border-primary-color)
        * ::-webkit-scrollbar {
          width: 20px;
          height: 20px;
          cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuMTY0NzUzLCAyMDIxLzAyLzE1LTExOjUyOjEzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMyAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA1LTAzVDIxOjMwOjA5KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNS0wM1QyMTozODo1OSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMy0wNS0wM1QyMTozODo1OSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4NjUxZTMzYS01ZDlmLTRmNDQtYTNkMi0yNzMzODI5OGNlZDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6ODY1MWUzM2EtNWQ5Zi00ZjQ0LWEzZDItMjczMzgyOThjZWQ3IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ODY1MWUzM2EtNWQ5Zi00ZjQ0LWEzZDItMjczMzgyOThjZWQ3Ij4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo4NjUxZTMzYS01ZDlmLTRmNDQtYTNkMi0yNzMzODI5OGNlZDciIHN0RXZ0OndoZW49IjIwMjMtMDUtMDNUMjE6MzA6MDkrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4zIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6m0NfZAAACNElEQVRYhcXUv4vTYBgH8G/f2mshpfaHad+0tE2GNkEQT5Dbuoo4inCj+E84qJso+B84iLOgdHBwd3TSgkKblJz94aUkbRqhNNbai8OR4sHptZr4fqdneB++n+HhjXieBwBoNBqfeZ6vLpdLbzgcPpYk6QFCSrPZXM/EHziOKwJALBaLiKJ4fzAYvAwL8GvWAM/zjvw5EomgXC7fGo1Gn9rt9s5/AZwWSunFfD4/UFVVYQIAgGw2my+VSi1N024yAQAAx3E7oii+0nU98MPcCACsj/Nh0Me5MQAACCH+cX5gAvBDKb08nU4tVVXrTAAAkMlkLhSLxZamadeYAAAgmUwmKpXKG13X7zEBAEA8Ho9KkvSo3++/YAIAjn/OSqWybxjG+3a7vd1hBwHwIwjCLs/zh51OR2ACAIBcLlcQBEHTNO0GEwAApFIprlwuv9Z1/S4TAAAkEomoJElPer3ecyYA4Pg4q9XqHcMw3jEB+BEEYc+yrINOp1NlAgAAnufFQqHQ6na7t5kAACCdTp+nlD5lBjgt5/5myTTNg8Vi0SKEZAF4m+wQQhKr1cp2XffZPwFGo9FHSumlbfd+C9vmsWma3SDLtwJYltWzbVsOsnxjwHg8PpxMJruKohyd/TpggG3b1mQyuaooihN0+ZkAx3G+WpZ1RZZlI4zyPwJms9k30zT3ZFn+Elb5CQAhJOrPruv+MAzjer1eV8MsPwFwHKe1Wq28+Xz+fTgc7tdqtbdhlwPATwVaxuIaFVvwAAAAAElFTkSuQmCC'), auto !important;
        }
      }
    }

    .check-result-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .audit-user-list {
      width: 100%;

      .audit-user-item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--padding-y) var(--padding-x);

        .user-info-container {
          display: flex;
          align-items: center;

          .thumb {
            width: 50px;
            height: 50px;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            border-radius: 50%;
            overflow: hidden;
            border: 1px solid var(--panel-border-color);
            margin-right: var(--padding-x);
          }

          .info {
            .nickname {
              font-size: 16px;
              color: var(--text-default-color);
              font-weight: 600;
              line-height: 32px;
              margin-bottom: .5rem;
            }

            .level {
              font-size: 12px;
              color: var(--text-light-color);
            }
          }
        }

        .result {
          text-align: right;

          .status {
            margin-bottom: .5rem;
          }

          .is-show {
            color: var(--text-light-color);
            font-size: 12px;
            line-height: 20px;
            display: flex;
            align-items: center;

            label {
              cursor: pointer;
            }
          }
        }

        &:hover {
          background-color: var(--bg-light-primary);
        }

        &.is-current {

          background-color: var(--bg-dark-light-primary);
        }
      }
    }
  }
}
</style>
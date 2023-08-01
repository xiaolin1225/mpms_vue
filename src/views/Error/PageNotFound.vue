<template>
  <div class="container">
    <div class="content">
      <div class="error-image-container">
        <img class="error-image" src="@/assets/images/404/404.png" alt="403">
        <img class="error-image-cloud left" src="@/assets/images/404/404_cloud.png" alt="404">
        <img class="error-image-cloud mid" src="@/assets/images/404/404_cloud.png" alt="404">
        <img class="error-image-cloud right" src="@/assets/images/404/404_cloud.png" alt="404">
      </div>
      <div class="err-info-container">
        <div class="title">
          页面飞走了!
        </div>
        <!--        <div class="message">-->
        <!--          {{ message }}-->
        <!--        </div>-->
        <div class="info">
          对不起，您正在寻找的页面不存在。尝试检查访问地址是否正确，然后按浏览器上的刷新按钮或尝试在本站中浏览其他内容。
        </div>
        <div class="operation-button">
          <el-button type="primary" @click="backHome">返回首页</el-button>
          <el-button type="primary" @click="backPrev">返回上一页</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PageNotFound',
  computed: {
    message() {
      return '找不到网页！'
    }
  },
  methods: {
    backHome() {
      this.$router.push("/");
    },
    backPrev() {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--bg-white);

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%) translateY(-50%);
    width: 100%;
    max-width: 700px;
    //overflow-y: auto;
    //padding: 20rem 10rem;
    display: flex;
    align-items: center;

    .error-image-container {
      flex-shrink: 0;
      position: relative;
      width: 100%;
      max-width: 400px;

      .error-image {
        width: 100%;
        height: 100%;
      }

      .error-image-cloud {
        position: absolute;

        &.left {
          width: 80px;
          top: -80px;
          left: 130px;
          opacity: 0;
          animation-name: cloudLeft;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }

        &.mid {
          width: 46px;
          top: 10px;
          left: 420px;
          opacity: 0;
          animation-name: cloudMid;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1.2s;
        }

        &.right {
          width: 62px;
          top: 100px;
          left: 500px;
          opacity: 0;
          animation-name: cloudRight;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
          animation-delay: 1s;
        }

        @keyframes cloudLeft {
          0% {
            top: -80px;
            left: 130px;
            opacity: 0;
          }
          20% {
            top: -64px;
            left: 98px;
            opacity: 1;
          }
          80% {
            top: -16px;
            left: 2px;
            opacity: 1;
          }
          100% {
            top: 23px;
            left: -70px;
            opacity: 0;
          }
        }
        @keyframes cloudMid {
          0% {
            top: 10px;
            left: 420px;
            opacity: 0;
          }
          20% {
            top: 40px;
            left: 360px;
            opacity: 1;
          }
          70% {
            top: 130px;
            left: 180px;
            opacity: 1;
          }
          100% {
            top: 160px;
            left: 120px;
            opacity: 0;
          }
        }
        @keyframes cloudRight {
          0% {
            top: 100px;
            left: 500px;
            opacity: 0;
          }
          20% {
            top: 120px;
            left: 460px;
            opacity: 1;
          }
          80% {
            top: 180px;
            left: 340px;
            opacity: 1;
          }
          100% {
            top: 200px;
            left: 300px;
            opacity: 0;
          }
        }
      }
    }

    .err-info-container {
      margin-left: var(--margin-x);

      .title {
        font-size: 2rem;
        font-weight: 600;
        text-align: center;
        color: var(--text-primary-color);
      }

      .message {
        margin-top: var(--margin-y);
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-default-color);
      }

      .info {
        line-height: 1.5rem;
        margin-top: var(--margin-y);
        font-size: 1rem;
        color: var(--text-light-color);
      }

      .operation-button {
        margin-top: var(--margin-y);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .container {
    .content {
      .error-image-container {
        width: 50%;
      }
    }
  }
}

@media screen and (max-width: 576px) {
  .container {
    overflow-y: auto;

    .content {
      width: 100%;
      min-height: 350px;
      overflow: hidden;
      display: block;
      padding: var(--padding-y) var(--padding-x);

      .error-image-container {
        width: 100%;
        max-width: unset;
      }

      .err-info-container {
        margin-top: var(--margin-y);
        margin-left: 0;
      }
    }
  }
}
</style>

<template>
  <div class="chat-container card">
    <div class="contacts-list-container">
      <h1 class="contact-list-title">联系人</h1>
      <div class="contact-list">
        <div class="contact-list-item" :class="item.id===currentIndex?'active':''" v-for="item in userList"
             :key="item.id" @click="changeUser(item.id)">
          <div class="user-info">
            <div class="thumb"
                 :style="`background-image: url(${item.avatar})`">
              <div class="status" :class="item.online?'online':''"></div>
            </div>
            <div class="nickname">{{ item.nickname ? item.nickname : item.username }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="chat-window-container">
      <div class="chat-window-header" v-if="toUser">
        <div class="user-info">
          <div class="thumb"
               :style="`background-image: url(${toUser.avatar})`">
            <div class="status" :class="toUser.online?'online':''"></div>
          </div>
          <div class="nickname">{{ toUser.nickname ? toUser.nickname : toUser.username }}</div>
        </div>
      </div>
      <div class="chat-window" ref="chatWindow" v-loading="chatWindowLoad">
        <div class="message-list" v-if="toUser">
          <div class="chat-message"
               :class="item.fromUser.uid===uid?'right':''"
               v-for="(item,index) in messageList"
               :key="index">
            <div class="thumb"
                 :style="`background-image: url(${item.fromUser.avatar})`">
            </div>
            <div class="message-container">
              <div class="nickname">{{ item.fromUser.nickname ? item.fromUser.nickname : item.fromUser.username }}</div>
              <div class="message">
                {{ JSON.parse(item.content) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-window-footer" v-if="toUser">
        <el-input class="message-send-input" v-model="message" @keyup.enter.native="send"></el-input>
        <el-button class="message-send-button" type="primary" @click="send" :disabled="message.trim().length===0">发送
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {getMessageList} from "@/api/chat";
import {imageSrcHandler} from "@/utils/fileUtils";

export default {
  name: "ChatView",
  data() {
    return {
      currentIndex: -1,
      userList: [],
      toUserIndex: [],
      message: "",
      messageList: [],
      messageLog: [],
      socket: null,
      chatWindowLoad: false
    }
  },
  computed: {
    ...mapState("user", ["userinfo", "token"]),
    toUser() {
      return this.userList.find(item => item.id === this.currentIndex);
    },
    uid() {
      return this.userinfo.uid;
    }
  },
  updated() {
    this.scrollBottom();
  },
  methods: {
    init() {
      let _this = this;
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        let uid = this.uid;
        console.log("您的浏览器支持WebSocket");
        let socketUrl = "ws://localhost/chat/" + uid;
        if (this.socket != null) {
          this.socket.close();
          this.socket = null;
        }
        // 开启一个websocket服务
        this.socket = new WebSocket(socketUrl, [this.token]);

        //打开事件
        this.socket.onopen = function () {
          console.log("websocket已打开");
        };
        //  浏览器端收消息，获得从服务端发送过来的文本消息
        this.socket.onmessage = function (res) {
          let {data} = JSON.parse(res.data);
          console.log("收到数据:", data)
          if (data.type === "user") {
            let {operation, user} = data;
            if (operation === "add") {
              let index = _this.userList.findIndex(item => item.uid === user);
              if (index !== -1) {
                let info = _this.userList[index];
                info.online = true;
                _this.$set(_this.userList, index, info);
              }
            } else if (operation === "list") {
              let online = data.online;
              _this.userList = user.map(item => {
                item.avatar = imageSrcHandler(item.avatar);
                return item;
              });
              online?.forEach(uid => {
                let index = _this.userList.findIndex(item => item.uid === uid);
                if (index !== -1) {
                  let info = _this.userList[index];
                  info.online = true;
                  _this.$set(_this.userList, index, info);
                }
              })
            } else if (operation === "remove") {
              let index = _this.userList.findIndex(item => item.uid === user);
              if (index !== -1) {
                let info = _this.userList[index];
                info.online = false;
                _this.$set(_this.userList, index, info);
              }
            }
          } else {
            if (data.to === _this.toUser.uid)
              _this.messageList.push(data);
          }
        };
        //关闭事件
        this.socket.onclose = function (e) {
          for (let i = 0; i < _this.userList.length; i++) {
            let info = _this.userList[i];
            info.online = false;
            _this.$set(_this.userList, i, info);
          }
          _this.$message.error("服务器已下线，请刷新页面重新连接！")
          console.log("websocket已关闭", e);
        };
        //发生了错误事件
        this.socket.onerror = function (e) {
          console.log("websocket发生了错误", e);
        }
      }
    },
    send() {
      if (!this.toUser) {
        this.$message.error("请选择聊天对象");
        return;
      }
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        let content = this.message;
        if (content.trim() === "") {
          return;
        }
        // 组装待发送的消息 json
        let message = {
          to: this.toUser.uid,
          content
        }
        this.socket.send(JSON.stringify(message)); // 将组装好的json发送给服务端，由服务端进行转发
        console.log({fromUser: this.userinfo, content: JSON.stringify(content)})
        this.messageList.push({fromUser: this.userinfo, content: JSON.stringify(content)})
        this.message = "";
      }
    },
    changeUser(id) {
      this.currentIndex = id;
      this.getMessage();
    },
    scrollBottom() {
      let chatWindow = this.$refs.chatWindow;
      chatWindow.scrollTo({top: chatWindow.scrollHeight, behavior: "smooth"})
    },
    getMessage() {
      this.messageList = [];
      this.chatWindowLoad = true;
      getMessageList({uid: this.toUser.uid}).then(res => {
        let {data} = res;
        this.messageList = data.map(item => {
          try {
            item.fromUser.avatar = imageSrcHandler(item.fromUser.avatar);
            item.toUser.avatar = imageSrcHandler(item.toUser.avatar);
          } catch (e) {
            return item;
          }
          return item;
        });
      }).finally(() => {
        this.chatWindowLoad = false;
      })

    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style lang="less" scoped>
.thumb {
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 50%;
  border: 2px solid var(--panel-border-white-color);

  .status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 11px;
    height: 11px;
    border: 1px solid var(--panel-border-white-color);
    background-color: var(--bg-dark-gray);
    border-radius: 50%;

    &.online {
      background-color: var(--bg-dark-primary);
    }
  }
}

.chat-container {
  display: flex;
  height: calc(100vh - 16rem);

  .contacts-list-container {
    width: 360px;
    height: 100%;
    padding-right: var(--padding-x);
    border-right: 1px solid var(--panel-border-color);

    .contact-list-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary-color);
      margin-bottom: var(--margin-y);
      padding-bottom: var(--padding-y);
      border-bottom: 1px solid var(--panel-border-color);
    }

    .contact-list {
      .contact-list-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        //border: 1px solid var(--panel-border-color);
        padding: var(--padding-y) var(--padding-x);
        border-radius: .5rem;

        .user-info {
          display: flex;
          align-items: center;

          .thumb {
            width: 42px;
            height: 42px;
          }

          .nickname {
            margin-left: var(--margin-x);
          }
        }

        &:hover {
          background-color: var(--bg-light);
        }

        &.active {
          color: var(--text-white);
          background-image: linear-gradient(45deg, var(--bg-dark-primary), var(--bg-dark-primary-gray));
        }
      }
    }
  }

  .chat-window-container {
    flex-grow: 1;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-left: var(--padding-y);

    .chat-window-header,
    .chat-window-footer {
      display: flex;
      width: 100%;
      height: 65px;
      background-color: var(--bg-white);
    }

    .chat-window-header {
      justify-content: space-between;
      align-items: center;
      padding-bottom: var(--padding-y);
      flex-shrink: 0;

      .user-info {
        display: flex;
        align-items: center;

        .thumb {
          width: 42px;
          height: 42px;
        }

        .nickname {
          margin-left: var(--margin-x);
        }
      }
    }

    .chat-window-footer {
      padding-top: var(--padding-y);
      align-items: center;

      .message-send-input {
        height: 100%;
        margin-right: var(--margin-x);

        :deep(.el-input__inner) {
          height: 100%;
        }
      }

      .message-send-button {
        height: 100%;
      }
    }

    .chat-window {
      flex-grow: 1;
      width: 100%;
      background-color: var(--bg-light-primary);
      padding: var(--padding-y) var(--padding-x);
      overflow: auto;

      .time {
        font-size: .5rem;
        color: var(--text-light-color);
        margin-top: .5rem;
        text-align: center;
      }

      .chat-message {
        display: flex;
        margin-bottom: var(--margin-y);
        width: 100%;

        .thumb {
          width: 36px;
          height: 36px;
          margin-top: 1.5rem;
        }

        .message-container {
          width: 100%;
          margin-left: var(--padding-x);

          .nickname {
            font-size: .5rem;
            color: var(--text-light-color);
            margin-bottom: .5rem;
          }

          .message {
            width: fit-content;
            max-width: 50%;
            color: var(--text-default-color);
            background-color: var(--bg-white);
            padding: var(--padding-y) var(--padding-x);
            border-radius: .5rem;
          }
        }

        &.right {
          flex-direction: row-reverse;

          .message-container {
            display: flex;
            flex-direction: column;
            align-items: end;
            margin-left: 0;
            margin-right: var(--padding-x);

            .message {
              color: var(--text-white);
              background-color: var(--bg-dark-primary);
            }
          }
        }
      }
    }
  }
}
</style>
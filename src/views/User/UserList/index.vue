<template>
  <div class="container">
    <div class="card">
      <ToolBar @delete="handleBatchDelete" @filter="handleFilterData" @add="addItem"/>
    </div>
    <div class="card mt">
      <el-table
          :data="list"
          fit
          @selection-change="itemCheckedToggle"
          v-loading="loading"
          style="min-height: 373px"
      >
        <el-table-column
            type="selection"
            width="55"
            align="center">
        </el-table-column>
        <el-table-column
            prop="id"
            label="序号"
            type="index"
            align="center"
        />
        <el-table-column type="expand">
          <template v-slot="scoped">
            {{ scoped.row }}
          </template>
        </el-table-column>
        <el-table-column
            prop="username"
            label="用户名"
            min-width="200"
        >
          <template v-slot="scope">
            <div class="username-container">
              <BaseImage class="avatar" :src="scope.row.avatar" fit="cover"/>
              <div class="username">{{ scope.row.username }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="nickname"
            label="昵称"
            min-width="200"
            align="center"
        />
        <el-table-column
            prop="email"
            label="邮箱"
            min-width="200"
            align="center"
        />
        <el-table-column
            prop="phone"
            label="电话"
            min-width="120"
            align="center"
        />
        <el-table-column
            prop="status"
            label="状态"
            width="200"
            align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.isEnable ? 'success' : 'danger'">{{
                scope.row.isEnable ? '正常' : '禁用'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="updateTime"
            label="注册时间"
            width="200"
            align="center">
        </el-table-column>
        <el-table-column
            prop="id"
            label="操作"
            width="200"
            align="center"
            fixed="right"
        >
          <template v-slot="scope">
            <el-tooltip class="opt-btn-tip" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle @click="editItem(scope.row.id)"/>
            </el-tooltip>
            <el-popconfirm
                class="pl"
                icon="el-icon-info"
                icon-color="red"
                title="你确定要删除该用户吗？"
                @confirm="deleteItem(scope.row.id)"
            >
              <el-tooltip class="opt-btn-tip" content="删除" placement="top" slot="reference">
                <el-button type="danger" icon="el-icon-delete" circle/>
              </el-tooltip>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <BasePagination v-model="current" :page-num="pageNum" :total="total" @size-change="handleSizeChange"/>
      <el-drawer
          :visible.sync="isDrawerOpen"
          direction="rtl"
          size="80%"
          :before-close="handleDrawerClose"
          style="z-index: 6666"
      >
        <el-descriptions class="p user-drawer-container" title="用户信息" :column="1" border>
          <template slot="extra">
            <el-button type="primary" size="small" @click="resetPassword" v-if="drawerData.status!==0">重置密码
            </el-button>
          </template>

          <el-descriptions-item v-if="drawerData.status!==0">
            <template slot="label">
              <i class="el-icon-s-order"></i>
              序号
            </template>
            {{ drawerData.id }}
          </el-descriptions-item>

          <el-descriptions-item v-if="drawerData.status!==0">
            <template slot="label">
              <i class="el-icon-s-flag"></i>
              uuid
            </template>
            {{ drawerData.uid }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              用户名 <span class="emphasize" v-if="drawerData.status===0">*</span>
            </template>
            <el-input v-model="drawerData.username" placeholder="请输入用户名" required v-if="drawerData.status===0"/>
            <span v-else>{{ drawerData.username }}</span>
          </el-descriptions-item>

          <el-descriptions-item v-if="drawerData.initialPassword">
            <template slot="label">
              <i class="el-icon-lock"></i>
              初始密码
            </template>
            <el-tooltip content="点击复制" placement="top-start">
              <div id="initial-password" @click="copyInitialPassword">
                {{ drawerData.initialPassword }}
              </div>
            </el-tooltip>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user-solid"></i>
              昵称
            </template>
            <el-input v-model="drawerData.nickname" placeholder="请输入昵称"/>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-picture-outline"></i>
              头像
            </template>
            <el-upload class="avatar-uploader" action="/api/file/upload" :data="drawerAvatarData"
                       :show-file-list="false"
                       accept="image/jpeg,image/png,image/gif"
                       :on-success="handleAvatarSuccess" :before-upload="handleAvatarBeforeUpload">
              <BaseImage v-if="drawerData.avatar" :src="drawerData.avatar" class="avatar"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-marketing"></i>
              电子邮箱
            </template>
            <el-input v-model="drawerData.email" placeholder="请输入电子邮箱"/>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              手机号码
            </template>
            <el-input v-model="drawerData.phone" placeholder="请输入手机号码"/>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-flag"></i>
              状态
            </template>
            <el-switch v-model="drawerData.isEnable" active-color="#13ce66" active-text="正常" :active-value="true"
                       inactive-color="#ff4949" inactive-text="禁用" :inactive-value="false"/>
          </el-descriptions-item>

          <el-descriptions-item v-if="drawerData.status!==0">
            <template slot="label">
              <i class="el-icon-date"></i>
              注册时间
            </template>
            {{ drawerData.createTime }}
          </el-descriptions-item>
        </el-descriptions>
        <div class="p" style="text-align: center;margin-left: 0;">
          <el-button type="primary" @click="saveItem">保存</el-button>
          <el-button @click="closeDrawer">取消</el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import ToolBar from "./ToolBar";
import BasePagination from "@/components/BasePagination/index.vue";
import {
  addUser,
  deleteUser,
  deleteUsers,
  requestUserInfo,
  requestUserList,
  resetUserPassword,
  updateUser
} from "@/api/user";
import BaseImage from "@/components/BaseImage/index.vue";
import {generateInitialPassword} from "@/utils";
import Clipboard from "clipboard";
import file2md5 from "file2md5";

export default {
  name: "UserList",
  components: {BaseImage, BasePagination, ToolBar},
  data() {
    return {
      list: [],
      current: 1,
      pageNum: 0,
      size: 5,
      total: 0,
      loading: false,
      checkList: [],
      filter: {},
      isDrawerOpen: false,
      drawerData: {},
      drawerAvatarData: {folderId: 2},
      isDrawerDataUnsaved: false,
    }
  },
  methods: {
    addItem() {
      this.drawerData = {
        status: 0,
        avatar: "",
        isEnable: true,
        username: "",
        initialPassword: generateInitialPassword(8)
      }
      this.isDrawerOpen = true;
    },
    saveItem() {
      let data = this.drawerData;
      if (data.id) {
        // 修改
        updateUser(data.id, data).then(() => {
          this.$message.success("保存成功");
          this.getUserList();
          this.closeDrawer();
        })
      } else {
        // 新增
        if (data.username === "") {
          this.$message.error("用户名不能为空");
          return;
        }
        addUser(data).then(() => {
          this.$message.success("保存成功");
          this.getUserList();
          this.closeDrawer();
        })
      }
    },
    copyInitialPassword() {
      Clipboard.copy(this.drawerData.initialPassword);
      this.$message.success("复制成功");
    },
    async editItem(id) {
      let res = await requestUserInfo(id)
      this.drawerData = res.data;
      this.$nextTick(() => {
        this.isDrawerOpen = true;
        this.isDrawerDataUnsaved = false;
      });
    },
    resetPassword() {
      let id = this.drawerData.id;
      this.$confirm('确定要重置密码吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let initialPassword = generateInitialPassword(8);
        resetUserPassword(id, initialPassword).then(() => {
          this.$message.success("重置成功");
          this.drawerData.initialPassword = initialPassword;
        });
      })
    },
    deleteItem(id) {
      deleteUser(id).then(() => {
        this.$message.success("删除成功");
        this.getUserList();
      })
    },
    itemCheckedToggle(val) {
      this.checkList = val
    },
    handleBatchDelete() {
      this.$confirm('确定要删除这些用户吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        let ids = this.checkList.map(item => item.id);
        deleteUsers(JSON.stringify(ids)).then(() => {
          this.$message.success("删除成功");
          this.getUserList();
        })
      })
    },
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      this.getUserList();
    },
    handleFilterData(filter) {
      this.filter = filter;
      this.getUserList();
    },
    async getUserList() {
      this.loading = true
      let res = await requestUserList({current: this.current, size: this.size, ...this.filter});
      const page = res.data;
      this.current = page.current;
      this.pageNum = page.pageNum;
      this.total = page.total;
      this.list = page.records;
      this.loading = false;
    },
    closeDrawer() {
      this.drawerData = {};
      this.isDrawerOpen = false;
      this.isDrawerDataUnsaved = false;
    },
    handleDrawerClose() {
      if (this.isDrawerDataUnsaved) {
        this.$confirm('当前数据未保存，确定要关闭吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.closeDrawer();
        })
      } else {
        this.closeDrawer();
      }
    },
    handleAvatarSuccess(res) {
      this.$message.success("上传成功");
      this.drawerData.avatar = res.data.url;
    },
    async handleAvatarBeforeUpload(file) {
      const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        return false;
      }

      try {
        const md5 = await file2md5(file, {chunkSize: 3 * 1024 * 1024});
        console.log('md5 string:', md5);
        this.drawerAvatarData.md5 = md5;
      } catch (e) {
        console.error('error', e);
        return false;
      }
      return true;
    },
  },
  computed: {
    jsonDrawerData() {
      return JSON.stringify(this.drawerData)
    },
  },
  watch: {
    current(newVal, oldVal) {
      if (newVal !== oldVal)
        this.getUserList();
    },
    jsonDrawerData(newVal, oldVal) {
      if (this.isDrawerOpen && JSON.stringify(newVal) !== JSON.stringify(oldVal))
        this.isDrawerDataUnsaved = true;
    }
  },
  mounted() {
    this.getUserList();
  },
}
</script>

<style lang="less" scoped>
.username-container {
  display: flex;
  align-items: center;

  .avatar {
    width: 30px;
    height: 30px;
    margin-right: 10px;
    overflow: hidden;
    border-radius: 50%;
  }

  .username {
    font-size: 14px;
  }
}

.user-drawer-container {

  .el-descriptions-item {
    .el-input {
      width: 100%;
    }
  }

  #initial-password {
    width: 100%;
    height: 100%;
    padding: 0 .5rem;
    font-size: 14px;
    line-height: 40px;
    color: var(--text-light-color);
    white-space: nowrap;
    background-color: var(--bg-light);
    border: 1px solid var(--panel-border-color);
    border-radius: .5rem;
    cursor: pointer;
  }

  .avatar-uploader {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--panel-border-color);
    border-radius: 6px;
    cursor: pointer;
    background-color: var(--bg-light);
    overflow: hidden;
    position: relative;

    .avatar-uploader-icon {
      font-size: 28px;
      color: var(--text-light-color);
      z-index: 1;
    }
  }
}

:deep(.el-table-column--selection) {
  .cell {
    padding-left: 10px;
  }
}

</style>
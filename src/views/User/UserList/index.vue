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
            <el-form-item label="状态">
              <el-select v-model="filter.isEnable" clearable placeholder="请选择用户状态">
                <el-option label="正常" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="搜索">
              <el-input v-model="filter.keyword" placeholder="请输入关键词"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getList">查询</el-button>
              <el-button type="danger" @click="handleFilterReset">重置</el-button>
            </el-form-item>
          </el-form>
        </template>

      </BaseBar>
    </div>
    <div class="card mt">
      <el-table
          :data="list"
          fit
          @selection-change="itemCheckedToggle"
          v-loading="loading"
          height="450px"
      >
        <el-table-column
            type="selection"
            width="55"
            align="center">
        </el-table-column>
        <el-table-column
            prop="id"
            label="序号"
            align="center"
        />
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
            prop="isEnable"
            label="状态"
            width="200"
            align="center">
          <template v-slot="scope">
            <el-switch
                v-model="scope.row.isEnable"
                @change="handleUserStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            prop="createTime"
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
      <BasePagination v-model="current" :page-size="size" :page-num="pageNum" :total="total"
                      @size-change="handleSizeChange"/>
      <el-drawer
          :visible.sync="isDialogOpen"
          direction="rtl"
          size="60%"
          :before-close="handleDialogClose"
          style="z-index: 6666"
          v-if="isDialogOpen"
          ref="drawer"
      >
        <el-form ref="form" :model="tempData" :rules="rules">
          <el-descriptions class="p user-drawer-container" title="用户信息" :column="1" border>
            <template slot="extra">
              <el-button type="primary" size="small" @click="resetPassword" v-if="tempData.status!==0">重置密码
              </el-button>
            </template>

            <el-descriptions-item v-if="tempData.status!==0">
              <template slot="label">
                <i class="el-icon-s-order"></i>
                序号
              </template>
              {{ tempData.id }}
            </el-descriptions-item>

            <el-descriptions-item v-if="tempData.status!==0">
              <template slot="label">
                <i class="el-icon-s-flag"></i>
                uuid
              </template>
              {{ tempData.uid }}
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user"></i>
                用户名 <span class="emphasize">*</span>
              </template>
              <el-form-item prop="username">
                <el-input v-model="tempData.username" placeholder="请输入用户名" required
                          v-if="tempData.status===0"/>
                <span v-else>{{ tempData.username }}</span>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item v-if="tempData.initialPassword">
              <template slot="label">
                <i class="el-icon-lock"></i>
                初始密码
              </template>
              <el-form-item prop="initialPassword">
                <el-tooltip content="点击复制" placement="top-start">
                  <div id="initial-password" @click="copyInitialPassword">
                    {{ tempData.initialPassword }}
                  </div>
                </el-tooltip>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-user-solid"></i>
                昵称
              </template>
              <el-form-item prop="nickname">
                <el-input v-model="tempData.nickname" placeholder="请输入昵称"/>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-picture-outline"></i>
                头像
              </template>
              <el-form-item prop="avatar" style="margin-bottom: unset;">
                <!--                <el-upload class="avatar-uploader" action="/api/file/upload" :headers="{Authorization:getToken}"-->
                <!--                           :show-file-list="false"-->
                <!--                           accept="image/jpeg,image/png,image/gif"-->
                <!--                           :on-success="handleAvatarSuccess" :before-upload="handleAvatarBeforeUpload">-->
                <!--                  <BaseImage v-if="tempData.avatar" :src="API_URL + tempData.avatar"-->
                <!--                             class="avatar"/>-->
                <!--                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
                <!--                </el-upload>-->
                <div class="avatar-uploader" @click="isCropperOpen = true">
                  <BaseImage
                      :src="tempData.avatar"
                      class="avatar"/>
                </div>
                <el-dialog title="头像编辑" :visible.sync="isCropperOpen" :close-on-click-modal="false" width="800px"
                           append-to-body>
                  <AvatarCropper :src="tempData.avatar" @cropper-confirm="handleCropperConfirm" v-if="isCropperOpen"/>
                </el-dialog>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-message"></i>
                电子邮箱
              </template>
              <el-form-item prop="email">
                <el-input v-model="tempData.email" placeholder="请输入电子邮箱"/>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-mobile-phone"></i>
                手机号码
              </template>
              <el-form-item prop="phone">
                <el-input v-model="tempData.phone" placeholder="请输入手机号码"/>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-postcard"></i>
                角色 <span class="emphasize">*</span>
              </template>
              <el-form-item prop="roleIds">
                <el-select v-model="tempData.roleIds" multiple placeholder="请选择用户角色" style="width: 100%">
                  <el-option
                      v-for="item in roles"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-postcard"></i>
                部门 <span class="emphasize">*</span>
              </template>
              <el-form-item prop="did">
                <tree-select :options="departments" v-model="tempData.did" :filterable="true"
                             :normalizer="normalizer" placeholder="请选择用户所在部门"/>
              </el-form-item>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-postcard"></i>
                职位 <span class="emphasize">*</span>
              </template>
              <el-form-item prop="pid">
                <el-select v-model="tempData.pid" placeholder="请选择用户职位" style="width: 100%">
                  <el-option
                      v-for="item in positions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item>
              <template slot="label">
                <i class="el-icon-s-flag"></i>
                状态 <span class="emphasize">*</span>
              </template>
              <el-form-item prop="isEnable">
                <el-switch v-model="tempData.isEnable" active-color="#13ce66" active-text="正常"
                           :active-value="true"
                           inactive-color="#ff4949" inactive-text="禁用" :inactive-value="false"/>
              </el-form-item>
            </el-descriptions-item>

            <el-descriptions-item v-if="tempData.status!==0">
              <template slot="label">
                <i class="el-icon-date"></i>
                注册时间
              </template>
              <el-form-item prop="createTime">
                {{ tempData.createTime }}
              </el-form-item>
            </el-descriptions-item>
          </el-descriptions>
        </el-form>
        <div class="p" style="text-align: center;margin-left: 0;">
          <el-button type="primary" @click="saveItem">保存</el-button>
          <el-button @click="closeDialog">取消</el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import BasePagination from "@/components/BasePagination/index.vue";
import BaseImage from "@/components/BaseImage/index.vue";
import BaseBar from "@/components/BaseBar/index.vue";
import TreeSelect from "@riophae/vue-treeselect";
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  deleteUser,
  deleteUsers,
  requestUserInfo,
  requestUserListPage, requestUserRole, resetUserPassword,
  saveUserInfo,
  updateUserInfo
} from "@/api/user";
import {generateInitialPassword} from "@/utils";
import md5 from "md5";
import AvatarCropper from "@/components/AvatarCropper/index.vue";
import Clipboard from "clipboard";
import {requestDepartmentTreeList} from "@/api/department";
import {requestPositionList} from "@/api/position";
import {imageSrcHandler} from "@/utils/fileUtils";
import {encrypt} from "@/utils/jsencrypt";

export default {
  name: "UserList",
  components: {AvatarCropper, BaseImage, TreeSelect, BasePagination, BaseBar},
  data() {
    return {
      list: [],
      rules: {
        username: [
          {required: true, message: "用户名不能为空", trigger: "blur"},
          {min: 2, max: 20, message: '用户名长度必须介于 2 和 20 之间', trigger: 'blur'}
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: "blur"
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
        roleIds: [
          {required: true, message: "至少要选择一个角色", trigger: "blur"},
        ],
        did: [{required: true, message: "请选择用户所在部门", trigger: "blur"},],
        pid: [{required: true, message: "请选择用户职位", trigger: "blur"},]
      },
      roles: [],
      departments: [],
      positions: [],
      current: 1,
      pageNum: 0,
      size: 5,
      total: 0,
      loading: false,
      checkList: [],
      filter: {},
      tempData: {},
      isDialogOpen: false,
      isCropperOpen: false,
      isTempDataUnsaved: false,
      API_URL: process.env.VUE_APP_API_URL,
    }
  },
  methods: {
    async getList() {
      this.loading = true
      let res = await requestUserListPage({current: this.current, size: this.size, ...this.filter});
      const page = res.data;
      this.current = page.current;
      this.pageNum = page.pages;
      this.total = page.total;
      this.list = page.records.map(item => ({
        ...item,
        avatar: imageSrcHandler(item.avatar),
      }));
      this.loading = false;
    },
    async getRoleList() {
      let res = await requestUserRole();
      this.roles = res.data;
    },
    async getDepartmentList() {
      let res = await requestDepartmentTreeList();
      this.departments = res.data;
    },
    async getPositionList() {
      let res = await requestPositionList();
      this.positions = res.data;
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    addItem() {
      this.tempData = {
        status: 0,
        avatar: "",
        isEnable: true,
        username: "",
        initialPassword: generateInitialPassword(8)
      }
      this.isDialogOpen = true;
    },
    async editItem(id) {
      this.tempData = {};
      let res = await requestUserInfo(id);
      delete res.data.roles;
      this.tempData = res.data;
      // this.tempData.roles = this.tempData.roles.map(item => (item.id));
      this.tempData.avatar = imageSrcHandler(this.tempData.avatar);
      this.$nextTick(() => {
        this.isDialogOpen = true;
        this.isTempDataUnsaved = false;
      });
    },
    saveItem() {
      this.$refs.form.validate(validate => {
        if (validate) {
          let data = {...this.tempData};
          // data.roles = data.roles.map(item => ({id: item}));
          data.avatar = data.avatar.replaceAll(process.env.VUE_APP_API_URL, "");
          if (data.id) {
            // 修改
            updateUserInfo(data).then(() => {
              this.$message.success("保存成功");
              this.getList();
              this.closeDialog();
            })
          } else {
            data.initialPassword = md5(data.initialPassword);
            // 新增
            saveUserInfo(data).then(() => {
              this.$message.success("保存成功");
              this.getList();
              this.closeDialog();
            })
          }
        }
      });
    },
    deleteItem(id) {
      deleteUser(id).then(() => {
        this.$message.success("删除成功");
        this.getList();
      })
    },
    handleStatusChange(row) {
      let text = row.status ? "启用" : "停用";
      this.$confirm('确认要' + text + row.name + '吗？').then(function () {
        return updateUserInfo({id: row.id, status: row.status});
      }).then(() => {
        this.$message.success(text + "成功");
      }).catch(function () {
        row.status = row.status === 1 ? 0 : 1;
      });
    },
    resetPassword() {
      let id = this.tempData.id;
      this.$confirm('确定要重置密码吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let initialPassword = generateInitialPassword(8);
        let formData = new FormData();
        formData.set("id", id);
        formData.set("initialPassword", encrypt(initialPassword));
        resetUserPassword(formData).then(() => {
          this.$message.success("重置成功");
          this.tempData.initialPassword = initialPassword;
        });
      })
    },
    copyInitialPassword() {
      Clipboard.copy(this.tempData.initialPassword);
      this.$message.success("复制成功");
    },
    handleCropperConfirm(data) {
      this.tempData.avatar = data;
      this.isCropperOpen = false;
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
        deleteUsers(JSON.stringify(ids)).then(async () => {
          this.$message.success("删除成功");
          await this.getList();
          if (this.current > this.pageNum) {
            this.current = this.pageNum;
            await this.getList();
          }
        })
      })
    },
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      this.getList();
    },
    handleFilterReset() {
      this.filter = {
        status: "",
        keyword: ""
      }
      this.getList();
    },
    getCheckedKey(node, {checkedKeys}) {
      this.tempData.menuIds = checkedKeys;
      // this.tempData.menuIds = this.$refs.menuTree.getCheckedKeys();
    },
    closeDialog() {
      this.isDialogOpen = false;
      this.isTempDataUnsaved = false;
    },
    handleDialogClose() {
      if (this.isTempDataUnsaved) {
        this.$confirm('当前数据未保存，确定要关闭吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.closeDialog();
        })
      } else {
        this.closeDialog();
      }
    },
  },
  computed: {
    jsonTempData() {
      return JSON.stringify(this.tempData)
    },
  },
  watch: {
    current(newVal, oldVal) {
      if (newVal !== oldVal)
        this.getList();
    },
    jsonTempData(newVal, oldVal) {
      if (this.isDialogOpen && JSON.stringify(newVal) !== JSON.stringify(oldVal))
        this.isTempDataUnsaved = true;
    },
    isDialogOpen(value) {
      if (!value) {
        this.$refs["form"].resetFields();
      }
    }
  },
  mounted() {
    this.getList();
    this.getRoleList();
    this.getDepartmentList();
    this.getPositionList();
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

    .avatar {
      width: 100px;
      height: 100px;
    }

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

:deep(.el-form-item) {
  margin-bottom: 0;

  .el-form-item__error {
    position: relative;
  }
}

.search-filter-form {
  //margin-bottom: -22px;
}

@media screen and (max-width: 992px) {

  .search-filter-form {
    width: 100%;
    text-align: center;

    .el-form-item {
      width: 100%;
      display: block;
    }
  }
}
</style>
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
              <el-select v-model="filter.status" clearable placeholder="请选择角色状态">
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
            prop="name"
            label="角色名称"
            min-width="200"
        />
        <el-table-column
            prop="key"
            label="角色标识"
            min-width="200"
            align="center"
        />
        <el-table-column
            prop="order"
            label="优先级"
            width="100"
            align="center"
        />
        <el-table-column
            prop="status"
            label="状态"
            width="200"
            align="center">
          <template v-slot="scope">
            <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
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
                title="你确定要删除该角色吗？"
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
      <el-dialog
          title="角色信息"
          :visible.sync="isDialogOpen"
          width="30%"
          center>
        <el-form ref="form" :rules="rules" :model="tempData" label-width="100px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="tempData.name"></el-input>
          </el-form-item>
          <el-form-item label="角色标识" prop="key">
            <span slot="label">
            <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`hasAuthority('home')`)" placement="top">
              <i class="el-icon-question"></i>
            </el-tooltip>
            角色标识
          </span>
            <el-input v-model="tempData.key"></el-input>
          </el-form-item>
          <el-form-item label="优先级" prop="order">
            <el-input-number controls-position="right" v-model="tempData.order" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="角色状态" prop="status">
            <el-switch
                v-model="tempData.status"
                :active-value="1"
                :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
          <el-form-item label="菜单权限" prop="menuIds">
            <el-tree
                ref="menuTree"
                :data="menuTreeList"
                show-checkbox
                node-key="id"
                :default-checked-keys="tempData.menuIds"
                :props="defaultProps"
                v-if="tempData.menuIds"
            >
            </el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDialogOpen = false">取 消</el-button>
          <el-button type="primary" @click="saveItem">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BasePagination from "@/components/BasePagination/index.vue";
import BaseImage from "@/components/BaseImage/index.vue";
import BaseBar from "@/components/BaseBar/index.vue";
import {deleteRole, deleteRoles, requestRoleInfo, requestRoleList, saveRoleInfo, updateRoleInfo} from "@/api/role";
import {requestRoleEditList} from "@/api/menus";

export default {
  name: "RoleList",
  components: {BaseImage, BasePagination, BaseBar},
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
      tempData: {},
      rules: {
        name: [
          {required: true, message: "角色名称不能为空", trigger: "blur"}
        ],
        key: [
          {required: true, message: "角色标识不能为空", trigger: "blur"}
        ],
        order: [
          {required: true, message: "优先级不能为空", trigger: "blur"}
        ],
      },
      isDialogOpen: false,
      isTempDataUnsaved: false,
      menuTreeList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      API_URL: process.env.VUE_APP_API_URL,
    }
  },
  methods: {
    async getList() {
      this.loading = true
      let res = await requestRoleList({current: this.current, size: this.size, ...this.filter});
      const page = res.data;
      this.current = page.current;
      this.pageNum = page.pages;
      this.total = page.total;
      this.list = page.records;
      this.loading = false;
    },
    async getMenuTreeList() {
      let res = await requestRoleEditList();
      let data = res.data;
      this.menuTreeList = data.filter(item => item.title && item.title !== "").map(item => ({
        id: item.id,
        title: item.title,
        children: item.children
      }));
      // this.menuTreeList = getTreeList(data, 0);
    },
    addItem() {
      this.tempData = {
        name: "",
        key: "",
        order: 0,
        status: 1,
      }
      this.isDialogOpen = true;
    },
    async editItem(id) {
      this.tempData = {};
      let res = await requestRoleInfo(id);
      this.tempData = res.data;
      this.$nextTick(() => {
        this.isDialogOpen = true;
        this.isTempDataUnsaved = false;
      });
    },
    saveItem() {
      console.log(this.$refs.menuTree.getCheckedKeys())
      this.$refs.form.validate(validate => {
        console.log("validate", validate)
        if (validate) {
          let data = {...this.tempData};
          let halfCheckedKeys = this.$refs.menuTree.getHalfCheckedKeys();
          let checkedKeys = this.$refs.menuTree.getCheckedKeys();
          data.menuIds = halfCheckedKeys.concat(checkedKeys);
          if (data.id) {
            // 修改
            updateRoleInfo(data).then(() => {
              this.$message.success("保存成功");
              this.getList();
              this.closeDialog();
            })
          } else {
            // 新增
            saveRoleInfo(data).then(() => {
              this.$message.success("保存成功");
              this.getList();
              this.closeDialog();
            })
          }
        }
      });
    },
    deleteItem(id) {
      deleteRole(id).then(() => {
        this.$message.success("删除成功");
        this.getList();
      })
    },
    handleStatusChange(row) {
      let text = row.status ? "启用" : "停用";
      this.$confirm('确认要' + text + row.name + '吗？').then(function () {
        return updateRoleInfo({id: row.id, status: row.status});
      }).then(() => {
        this.$message.success(text + "成功");
      }).catch(function () {
        row.status = row.status === 1 ? 0 : 1;
      });
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
        deleteRoles(JSON.stringify(ids)).then(async () => {
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
    getCheckedKey(node, {checkedKeys, halfCheckedKeys}) {
      this.tempData.menuIds = halfCheckedKeys.concat(checkedKeys);
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
        this.$refs.menuTree.setCheckedKeys([]);
        this.$refs["form"].resetFields();
      }
    }
  },
  mounted() {
    this.getList();
    this.getMenuTreeList();
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
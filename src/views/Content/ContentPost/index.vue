<template>
  <div class="container">
    <div class="card">
      <BaseBar>
        <template #left>

        </template>
        <template #right>
          <el-form :inline="true" :model="filter" class="search-filter-form">
            <el-form-item label="状态">
              <el-select v-model="filter.status" clearable placeholder="请选择内容状态">
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
            prop="contentTitle"
            label="标题"
            min-width="200"
        />
        <el-table-column
            prop="status"
            label="状态"
            width="200"
            align="center">
          <template slot-scope="scope">
            <el-tag :type="statusTag(scope.row.status)?.type">{{ statusTag(scope.row.status)?.title }}</el-tag>
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
            <el-tooltip class="opt-btn-tip" content="发布" placement="top">
              {{ scope.row.id }}
              <el-button type="primary" icon="el-icon-s-promotion" @click="showPostDialog(scope.row.id)" circle/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <BasePagination v-model="current" :page-size="size" :page-num="pageNum" :total="total"
                      @size-change="handleSizeChange"/>
      <el-dialog
          title="发布内容"
          :visible.sync="isDialogOpen"
          width="30%"
          center>
        <el-form ref="form" :rules="rules" :model="tempData" label-width="100px">

          <el-form-item label="发布平台" prop="platformIds">
            <el-select v-model="tempData.platformIds" multiple placeholder="请选择要发布的平台">
              <el-option :label="item.title" :value="item.id" :key="item.id" v-for="item in platformList"/>
            </el-select>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isDialogOpen = false">取 消</el-button>
          <el-button type="primary" @click="postContent">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import BasePagination from "@/components/BasePagination/index.vue";
import BaseImage from "@/components/BaseImage/index.vue";
import BaseBar from "@/components/BaseBar/index.vue";
import {getPostList, postContent} from "@/api/contentPsot";
import {getPlatformSelectList} from "@/api/platform";

export default {
  name: "ContentPost",
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
      tempData: {
        platformIds: []
      },
      rules: {
        platformIds: [
          {required: true, message: "请选择要发布的平台", trigger: "blur"}
        ],
      },
      isDialogOpen: false,
      isTempDataUnsaved: false,
      platformList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      API_URL: process.env.VUE_APP_API_URL,
    }
  },
  methods: {
    statusTag(status) {
      let tag = {}
      switch (status) {
        case 0:
          tag.title = "发布失败";
          tag.type = "danger";
          break;
        case 1:
          tag.title = "待发布";
          tag.type = "";
          break;
        case 2:
          tag.title = "正在发布";
          tag.type = "warning";
          break;
        case 3:
          tag.title = "已发布";
          tag.type = "success";
          break;
      }
      return tag;
    },
    async getList() {
      this.loading = true
      let res = await getPostList({current: this.current, size: this.size, ...this.filter});
      const page = res.data;
      this.current = page.current;
      this.pageNum = page.pages;
      this.total = page.total;
      this.list = page.records;
      this.loading = false;
    },
    async getPlatformList() {
      let {data} = await getPlatformSelectList();
      this.platformList = data;
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
    showPostDialog(postId) {
      this.tempData = {postId, platformIds: []}
      this.isDialogOpen = true;
    },
    postContent() {
      this.$refs.form.validate((validate) => {
        if (validate) {
          postContent(this.tempData).then(res => {
            this.$message.success(res.message);
            this.closeDialog();
          })
        }
      })
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
        this.$refs["form"].resetFields();
      }
    }
  },
  mounted() {
    this.getList();
    this.getPlatformList();
    // this.getMenuTreeList();
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
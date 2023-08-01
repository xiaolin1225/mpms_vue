<template>
  <div class="container">
    <div class="card">
      <BaseBar>
        <template #left>
          <!--          <el-button type="success" icon="el-icon-check">通过</el-button>-->
          <!--          <el-button type="danger" icon="el-icon-close">退回</el-button>-->
        </template>
        <template #right>
          <el-form :inline="true" :model="filter" class="search-filter-form">
            <el-form-item label="状态">
              <el-select v-model="filter.status" clearable placeholder="请选择审核状态">
                <el-option label="正常" :value="1"></el-option>
                <el-option label="禁用" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="搜索">
              <el-input v-model="filter.keyword" placeholder="请输入关键词"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">查询</el-button>
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
            prop="contentTitle"
            label="内容标题"
            min-width="200"
        />
        <el-table-column
            prop="process"
            label="审核进程"
            min-width="200"
            align="center"
        />
        <el-table-column
            prop="checkUsers"
            label="审核用户"
            min-width="200"
            align="center"
            :formatter="(row,column,value)=>{
                      return value.map(item=>item.user.nickname?item.user.nickname:item.user.username).join('，');
                    }"
        />
        <el-table-column
            prop="status"
            label="状态"
            width="200"
            align="center">
          <template v-slot="scope">
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
            <el-link type="danger" v-if="!scope.row.enableCheck || scope.row.status===3" disabled>暂无权限</el-link>
            <el-link type="primary" v-else-if="scope.row.status===1||scope.row.status===2"
                     @click="checkContent(scope.row.id)">开始审核
            </el-link>
            <el-link type="warning" v-else-if="scope.row.status===0">提醒编辑修改</el-link>
          </template>
        </el-table-column>
      </el-table>
      <BasePagination v-model="current" :page-size="size" :page-num="pageNum" :total="total"
                      @size-change="handleSizeChange"/>
    </div>
  </div>
</template>

<script>
import BasePagination from "@/components/BasePagination/index.vue";
import BaseImage from "@/components/BaseImage/index.vue";
import BaseBar from "@/components/BaseBar/index.vue";
import {getCheckList} from "@/api/contentCheck";

export default {
  name: "ContentApproval",
  components: {BaseImage, BasePagination, BaseBar},
  data() {
    return {
      list: [],
      current: 1,
      pageNum: 0,
      size: 5,
      total: 4,
      loading: false,
      checkList: [],
      filter: {}
    }
  },
  methods: {
    async getListData() {
      let {data} = await getCheckList({current: this.current, size: this.size, ...this.filter});
      this.list = data.records;
      this.pageNum = data.pages;
      this.total = data.total;
    },
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
    itemCheckedToggle(val) {
      this.checkList = val
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
    closeDialog() {
      this.isDialogOpen = false;
      this.isTempDataUnsaved = false;
    },
    checkContent(id) {
      this.$router.push({
        name: "contentCheckView",
        params: {id}
      })
    }
  },
  created() {
    this.getListData();
  }
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
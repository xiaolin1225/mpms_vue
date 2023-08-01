<template>
  <div class="container">
    <div class="card">
      <BaseBar>
        <template #right>
          <el-form :inline="true" :model="filter" class="search-filter-form">
            <el-form-item label="状态">
              <el-select v-model="filter.status" clearable placeholder="请选择状态">
                <el-option label="成功" :value="1"></el-option>
                <el-option label="失败" :value="0"></el-option>
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
          stripe
          highlight-current-row
          row-key="id"
      >
        <el-table-column
            prop="id"
            label="序号"
            align="center"
        />
        <el-table-column
            prop="title"
            label="用户操作"
            min-width="200"
        />
        <el-table-column
            prop="operationMessage"
            label="操作结果"
            min-width="100"
            align="center"
        />
        <el-table-column
            prop="errorMessage"
            label="错误信息"
            min-width="200"
            align="center"
        />
        <el-table-column
            prop="operationIp"
            label="IP地址"
            min-width="200"
            align="center"
        />
        <el-table-column
            prop="operationLocation"
            label="位置"
            min-width="150"
            align="center"
        />
        <el-table-column
            prop="status"
            label="状态"
            width="100"
            align="center">
          <template v-slot="scope">
            <el-tag :type="scope.row.status===1?'':'danger'">{{ scope.row.status === 1 ? "成功" : "失败" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="costTime"
            label="耗费时间"
            min-width="100"
            align="center"
            :formatter="(row, column, cellValue)=>(`${cellValue} 毫秒`)"
        />
        <el-table-column
            prop="createTime"
            label="操作时间"
            width="200"
            align="center">
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
import {deleteRole, deleteRoles, requestRoleInfo, requestRoleList, saveRoleInfo, updateRoleInfo} from "@/api/role";
import {requestMenuList} from "@/api/menus";
import {getTreeList} from "@/utils/menuUtils";

export default {
  name: "LoginLog",
  components: {BaseImage, BasePagination, BaseBar},
  data() {
    return {
      list: [],
      current: 1,
      pageNum: 0,
      size: 10,
      total: 0,
      loading: false,
      filter: {},
      tempData: {},
    }
  },
  methods: {
    async getList() {
      this.loading = true
      let res = await this.$store.dispatch("user/getLoginLog", {
        current: this.current,
        size: this.size, ...this.filter
      });
      const page = res.data;
      this.current = page.current;
      this.pageNum = page.pages;
      this.total = page.total;
      this.list = page.records;
      this.loading = false;
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
  },
  watch: {
    current(newVal, oldVal) {
      if (newVal !== oldVal)
        this.getList();
    },
  },
  mounted() {
    this.getList();
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

//.search-filter-form {
//  margin-bottom: -22px;
//}

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
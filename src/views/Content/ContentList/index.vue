<template>
  <div class="container">
    <div class="card">
      <ToolBar/>
    </div>
    <div class="card mt">
      <el-table
          :data="contentList"
      >
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column type="expand">
          <template v-slot="scoped">
            {{scoped.row}}
          </template>
        </el-table-column>
        <el-table-column
            prop="title"
            label="内容详情"
            min-width="500px"
        >
          <template v-slot="scope">
            <ContentItem :content="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态"
            width="200"
            align="center">
          <template v-slot="scope">
            <el-tag>{{ scope.row.status === 1 ? '待发布' : '已发布' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="update_time"
            label="更新时间"
            width="200"
            align="center">
        </el-table-column>
        <el-table-column
            prop="id"
            label="操作"
            width="200"
            align="center">
          <template v-slot="scope">
            <el-tooltip class="opt-btn-tip" content="预览" placement="top">
              <el-button icon="el-icon-view" circle @click="editItem(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip class="opt-btn-tip" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" circle @click="editItem(scope.row.id)"/>
            </el-tooltip>
            <el-tooltip class="opt-btn-tip" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteItem(scope.row.id)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <BasePagination/>
    </div>
  </div>
</template>

<script>
import ToolBar from "@/views/Content/ContentList/ToolBar";
import BasePagination from "@/components/BasePagination/index.vue";
import ContentItem from "@/views/Content/ContentList/ContentItem/index.vue";

export default {
  name: "ContentList",
  components: {ContentItem, BasePagination, ToolBar},
  data() {
    return {
      contentList: [
        {
          id: 1,
          title: "测试文章1",
          author: "小林",
          digest: "",
          content_source_url: "",
          thumb: "",
          status: 1,
          update_time: "2023年02月07日 17:03:04"
        },
        {
          id: 2,
          title: "测试文章2",
          author: "小林",
          digest: "",
          content_source_url: "",
          thumb: "https://s1.ax1x.com/2023/02/07/pS2FeXV.png",
          status: 1,
          update_time: "2023年02月02日 13:03:04"
        }]
    }
  },
  methods: {
    editItem(id) {
      console.log(id)
    },
    deleteItem(id) {
      console.log(id)
    }
  }
}
</script>

<style scoped>
>>> .el-table-column--selection .cell {
  padding-left: 10px;
}
</style>
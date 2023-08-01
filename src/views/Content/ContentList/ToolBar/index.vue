<template>
  <BaseBar>
    <template #left>
      <el-button type="primary" icon="el-icon-plus">新建</el-button>
      <el-button type="danger" icon="el-icon-delete">删除</el-button>
    </template>
    <template #right>
      <el-form :inline="true" :model="filter" class="search-filter-form">
        <el-form-item label="分类">
          <el-select v-model="filter.category" filterable multiple clearable placeholder="请选择分类">
            <el-option label="科技" value="1"></el-option>
            <el-option label="知识" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filter.keyword" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </template>

  </BaseBar>
</template>

<script>
import BaseBar from "@/components/BaseBar";

export default {
  name: "ToolBar",
  components: {BaseBar},
  data() {
    return {
      filter: {
        category: "",
        status: 0,
        keyword: ""
      }
    }
  },
  methods: {
    onSubmit() {
      console.log(this.filter)
    }
  }
}
</script>

<style lang="less" scoped>


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
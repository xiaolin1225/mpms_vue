<template>
  <BaseBar>
    <template #left>
      <el-button type="primary" icon="el-icon-plus" @click="add">新建</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="handleDeleteClick">删除</el-button>
    </template>
    <template #right>
      <el-form :inline="true" :model="filter" class="search-filter-form">
        <el-form-item label="状态">
          <el-select v-model="filter.status" clearable placeholder="请选择用户状态">
            <el-option label="正常" :value="1"></el-option>
            <el-option label="禁用" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filter.keyword" placeholder="请输入关键词"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="danger" @click="onReset">重置</el-button>
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
        status: "",
        keyword: ""
      }
    }
  },
  methods: {
    onSubmit() {
      this.$emit("filter", this.filter);
    },
    onReset() {
      this.filter = {
        status: "",
        keyword: ""
      }
      this.$emit("filter", this.filter);
    },
    add() {
      this.$emit("add");
    },
    handleDeleteClick() {
      this.$emit("delete");
    }
  }
}
</script>

<style lang="less" scoped>


.search-filter-form {
  margin-bottom: -22px;
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
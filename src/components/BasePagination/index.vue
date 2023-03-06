<template>
  <BaseBar class="container mt">
    <template #left>
      <span>每页显示&nbsp;
        <span class="emphasize">
          <el-select v-model="size" size="mini" placeholder="请选择每页显示的条数" class="page-size-select">
            <el-option
                v-for="(item,index) in pageSizes"
                :key="index"
                :label="item"
                :value="item">
              <span>{{ item }} 条 / 页</span>
            </el-option>
          </el-select>
        </span>
        &nbsp;条数据，共&nbsp;
        <span class="emphasize">
          {{ total }}
        </span>
        &nbsp;条数据
      </span>
    </template>
    <template #right>
      <el-pagination
          class="pagination"
          background
          layout="prev, pager, next, jumper"
          :page-size="size"
          :page-count="pageNum"
          :current-page="value"
          :pager-count="5"
          :total="total"
          @current-change="$emit('input', $event)"
      >
      </el-pagination>
    </template>
  </BaseBar>
</template>

<script>
import BaseBar from "@/components/BaseBar";

export default {
  name: "BasePagination",
  components: {BaseBar},
  data() {
    return {
      size: 5,
      pageSizes: [5, 10, 15, 20, 50, 100]
    }
  },
  props: {
    value: {
      type: Number,
      default: 1
    },
    pageNum: {
      type: Number,
      default: 0
    },
    pageSize: Number,
    total: {
      type: Number,
      default: 0
    },
  },
  watch: {
    size(val) {
      this.$emit('size-change', val);
    }
  },
  mounted() {
    if (this.pageSize) {
      this.size = this.pageSize
    }
  }
}
</script>

<style scoped>

.container {
  color: var(--text-light-color);
}

.page-size-select {
  width: 80px;
}

>>> .el-input__inner {
  color: var(--text-primary-color);
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}
</style>
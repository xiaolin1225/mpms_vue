<template>
  <BaseBar>
    <template #left>
      <!--      <el-button type="primary" @click="handleUploadButtonClick">上传文件</el-button>-->
      <el-dropdown placement="bottom" @command="handleDropdownClick">
        <el-button type="primary">
          新建 / 上传<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" style="text-align: center">
          <el-dropdown-item command="upload">上传文件</el-dropdown-item>
          <el-dropdown-item command="create">新建文件夹</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="file-path-container">
        <input v-model="path" placeholder="请输入文件路径" class="file-path-input" @blur="handlePathChange"/>
      </div>
    </template>
    <template #right>
      <el-form v-model="filter" inline class="form">
        <el-form-item label="查询范围">
          <el-select
              v-model="filter.range"
              placeholder="请选择查询范围">
            <el-option label="此文件夹" :value="1"/>
            <el-option label="所有文件" :value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item label="文件类型">
          <!--          <el-select-->
          <!--              v-model="filter.type"-->
          <!--              multiple-->
          <!--              filterable-->
          <!--              remote-->
          <!--              reserve-keyword-->
          <!--              placeholder="请选择文件类型"-->
          <!--              :remote-method="remoteMethod"-->
          <!--              :loading="loading">-->
          <!--            <el-option-->
          <!--                v-for="item in options"-->
          <!--                :key="item.value"-->
          <!--                :label="item.label"-->
          <!--                :value="item.value">-->
          <!--            </el-option>-->
          <!--          </el-select>-->
          <el-cascader
              v-model="filter.type"
              :options="options"
              :props="props"
              clearable
              @change="handleCheckChange"
          ></el-cascader>
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
import BaseBar from "@/components/BaseBar/index.vue";
import {requestFileType} from "@/api/file";

let id = 0;
export default {
  name: "ToolBar",
  components: {BaseBar},
  data() {
    return {
      filter: {
        range: 1,
        type: [],
        keyword: ""
      },
      options: [],
      loading: false,
      props: {
        lazy: true,
        checkStrictly: true,
        async lazyLoad(node, resolve) {
          console.log(node)
          const {data, level} = node;
          let fid = 0;
          if (level !== 0)
            fid = data.id;
          console.log(fid, level);
          let res = await requestFileType({fid, lazy: true})
          resolve(res.data);
        }
      }
    }
  },
  props: {
    value: {
      type: String,
      default: "/资源库"
    },
  },
  computed: {
    path: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    onSubmit() {
      console.log(this.form)
    },
    handleUploadButtonClick() {
      this.$emit("handleUploadButtonClick");
    },
    handleDropdownClick(command) {
      this.$emit("handleDropdownClick", command);
    },
    handlePathChange() {
      this.$emit("change");
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;

      } else {
        this.options = [];
      }
    },
    async getOptionList() {
      let res = await requestFileType();
      this.options = res.data;
    },
    handleCheckChange(data) {
      console.log(data)
    }
  },
  mounted() {
    // this.getOptionList();
  }
}
</script>

<style lang="less" scoped>
.form {
  margin-bottom: -22px;
}

.file-path-container {
  width: 400px;
  height: 40px;
  border-radius: .5rem;
  margin-left: var(--margin-x);

  .file-path-input {
    width: 100%;
    height: 100%;
    padding: 0 .5rem;
    font-size: 14px;
    line-height: 40px;
    color: var(--text-light-color);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    direction: rtl;
    unicode-bidi: revert;
    background-color: var(--bg-light);
    border: 1px solid var(--panel-border-color);
    border-radius: .5rem;

    &:focus {
      background-color: #ffffff;
      direction: ltr;
      border-color: var(--panel-border-primary-color);
    }
  }
}

@media screen and (max-width: 992px) {
  .form {
    .el-form-item {
      width: 100%;
      display: block;
    }
  }

  .file-path-container {
    width: 100%;
    margin-top: var(--margin-y);
    margin-left: 0;
  }
}
</style>
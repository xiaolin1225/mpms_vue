<template>
  <div class="container">
    <el-row class="row">
      <el-col :span="24">
        <div class="card profile-container">
          <div class="left-wrap">
            <div class="avatar">
              <el-image :src="avatar" class="image">
                <div slot="placeholder" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="user-profile">
              <div class="welcome">{{ timeFix() }}，{{ nickname }}，{{ welcome() }}</div>
              <div class="detail">
                <span class="position">{{ roleName }}</span>
                <span class="line" v-if="workerInfo.department&&workerInfo.position">|</span>
                <span class="work-info">
                  <span class="info-item">{{ workerInfo.department }}</span>
                  <span class="info-item" v-if="workerInfo.position"> - {{ workerInfo.position }}</span>
                </span>
              </div>
            </div>
          </div>
          <!--          <div class="right-wrap">-->
          <!--            <div class="extra-content">-->
          <!--              <div class="extra-item">-->
          <!--                <div class="static-item">-->
          <!--                  <div class="title">我的文章</div>-->
          <!--                  <div class="content">56</div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--              <div class="extra-item">-->
          <!--                <div class="static-item">-->
          <!--                  <div class="title">我的消息</div>-->
          <!--                  <div class="content">6</div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--              <div class="extra-item">-->
          <!--                <div class="static-item">-->
          <!--                  <div class="title">我的任务</div>-->
          <!--                  <div class="content">20</div>-->
          <!--                </div>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="row">
      <el-col :span="16">
        <!--        <div class="card">-->
        <!--          <div class="card-header">-->
        <!--            <div class="card-title">待办事项</div>-->
        <!--          </div>-->
        <!--          <div class="card-body">-->
        <!--            <el-table-->
        <!--                :data="tableData"-->
        <!--                border-->
        <!--                style="width: 100%">-->
        <!--              <el-table-column-->
        <!--                  prop="date"-->
        <!--                  label="日期"-->
        <!--                  width="180">-->
        <!--              </el-table-column>-->
        <!--              <el-table-column-->
        <!--                  prop="name"-->
        <!--                  label="姓名"-->
        <!--                  width="180">-->
        <!--              </el-table-column>-->
        <!--              <el-table-column-->
        <!--                  prop="address"-->
        <!--                  label="地址">-->
        <!--              </el-table-column>-->
        <!--            </el-table>-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="card mt">
          <div class="card-header">
            <div class="card-title">
              <h1>本周文章数据统计</h1>
              <p>2023年05月08日 - 2023年05月14日</p>
            </div>
          </div>
          <div class="card-body" style="height:400px;">
            <ECharts :options="chartsOption"/>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <div class="card-header">
            <div class="card-title">通知公告</div>
          </div>
          <div class="card-body">
            <el-table
                :data="noticeData"
                :show-header="false"
                style="width: 100%">
              <el-table-column prop="content">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="card mt">
          <div class="card-header">
            <div class="card-title">系统日志</div>
            <div class="extend">
              <el-button type="text" @click="$router.push('/log')"
                         v-if="systemLog&&systemLog.records&&systemLog.records.length>0">阅读更多 <i
                  class="el-icon-arrow-right"/>
              </el-button>
            </div>
          </div>
          <div class="card-body">
            <el-timeline v-if="systemLog&&systemLog.records&&systemLog.records.length>0">
              <el-timeline-item :timestamp="item.createTime" placement="top" :color="index===0?'#0054FE':''"
                                v-for="(item,index) in systemLog.records" :key="item.id">
                <div class="timeline-item">
                  <h4>{{ item.title }}</h4>
                  <p><span class="emphasize">{{ item.operationUser }}</span>进行了<span class="emphasize">{{
                      logOperationType(item.operationType)
                    }}</span>操作</p>
                </div>
              </el-timeline-item>
            </el-timeline>
            <div v-else>
              暂无数据
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>


import {timeFix, welcome} from "@/utils";
import AnalyticsCard from "@/components/AnalyticsCard/index.vue";
import ECharts from "@/components/EChats/index.vue";
import {mapGetters} from "vuex";
import {logOperationType} from "@/utils/statusConvert";

export default {
  name: 'HomeView',
  components: {ECharts, AnalyticsCard},
  data() {
    return {
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ],
      noticeData: [
        {
          id: 1,
          content: "《九九重阳节，岁岁重阳情》已发布"
        },
      ],
      chartsOption: {
        legend: {
          // Try 'horizontal'
          orient: 'vertical',
          right: 10,
          top: 'center'
        },
        xAxis: {
          name: "日期",
          data: ['05月08日', '05月09日', '05月10日', '05月11日', '05月12日', '05月13日', '05月14日']
        },
        yAxis: {},
        series: [
          {
            name: '阅读数',
            type: 'bar',
            data: [125, 220, 346, 120, 150, 200, 1200]
          },
          {
            name: '点赞数',
            type: 'bar',
            data: [231, 332, 454, 221, 231, 453, 121]
          },
          {
            name: '收藏数',
            type: 'bar',
            data: [666, 22, 12, 33, 55, 111, 343]
          }
        ]
      },
    }
  },
  computed: {
    ...mapGetters("user", ["getUserInfo", "getUserRoles"]),
    ...mapGetters("system", ["systemLog"]),
    nickname() {
      if (!this.getUserRoles)
        return "";
      return this.getUserInfo.nickname ? this.getUserInfo.nickname : this.getUserInfo.username;
    },
    avatar() {
      if (!this.getUserRoles)
        return "";
      return this.getUserInfo.avatar;
    },
    roleName() {
      return this.getUserRoles[0]?.name;
    },
    workerInfo() {
      return {
        department: this.getUserInfo.department?.name,
        position: this.getUserInfo.position?.name
      }
    }
  },
  methods: {
    logOperationType,
    welcome,
    timeFix,
    toggle() {
      document.body.classList.toggle("dark");
    },
  },
  mounted() {
    this.$store.dispatch("system/getSystemLog");
  }
}
</script>

<style lang="less" scoped>
.analytics-list-container {
  display: grid;
  grid-template-columns: repeat(2, calc(50% - 0.75rem));
  grid-gap: var(--margin-x);
}

.profile-container {
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left-wrap {
    display: flex;
    align-items: center;

    .avatar {
      flex-shrink: 1;
      width: 77px;
      min-width: 77px;
      height: 77px;
      min-height: 77px;
      text-align: center;
      vertical-align: middle;
      line-height: 77px;
      border-radius: 50%;
      border: 1px solid #ececec;
      overflow: hidden;

      .image {
        width: 100%;
        height: 100%;
      }
    }

    .user-profile {
      margin-left: var(--margin-x);

      .welcome {
        color: var(--text-default-color);
        font-size: 20px;
        font-weight: 600;
      }

      .detail {
        margin-top: 5px;
        color: var(--text-light-color);
        font-size: 14px;

        .line {
          margin: 0 .5rem;
        }
      }
    }
  }

  .right-wrap {
    display: flex;
    align-items: center;

    .extra-content {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .extra-item {
        padding: 0 2rem;
        border-right: 1px solid var(--panel-border-color);

        &:first-child {
          padding-left: 0;
        }

        &:last-child {
          padding-right: 0;
          border-right: none;
        }
      }

      .static-item {
        .title {
          font-size: 1rem;
          color: var(--text-light-color);
        }

        .content {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-default-color);
          word-spacing: .1rem;
        }
      }
    }
  }
}

.row {
  margin-top: var(--margin-y);
}

.timeline-item {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-default-color);

  & > * {
    margin-bottom: .5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  p {
    font-size: .5rem;
    color: var(--text-light-color);
    font-weight: 300;
  }
}

@media screen and (max-width: 768px) {
  .profile-container {
    display: block;

    .left-wrap {
      justify-content: center;
    }

    .right-wrap {
      margin-top: var(--margin-y);
      justify-content: center;
    }
  }

  .analytics-list-container {
    display: block;

    & > * {
      margin-top: var(--margin-y);

      &:first-child {
        margin-top: 0;
      }
    }
  }

  .row {
    & > * {
      width: 100%;
      margin-top: var(--margin-y);

      &:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>

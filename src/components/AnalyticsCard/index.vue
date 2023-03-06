<template>
  <div class="analytics-card"
       style="--analytics-icon-background-color:#5B93FF1A;--analytics-icon-font-color:#5b93ff;">
    <div class="left-wrap">
      <i class="el-icon-user-solid"></i>
    </div>
    <div class="right-wrap">
      <el-statistic group-separator="," :precision="2" :value="2000000"></el-statistic>
      <h1 class="title">人数</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnalyticsCard"
}
</script>

<style lang="less" scoped>


.analytics-card {
  width: 100%;
  display: flex;
  align-items: center;
  padding: var(--padding-y) var(--padding-x);
  border-radius: .5rem;
  border: 1px solid var(--panel-border-color);

&:hover {
   --shadow: 0 0 5px 2px #302E150F;
 }

.left-wrap {
  margin-right: var(--margin-x);

i {
  width: 60px;
  height: 60px;
  background-color: var(--analytics-icon-background-color);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: var(--analytics-icon-font-color);
}
}

.right-wrap {
.title {
  margin-top: .5rem;
  font-size: 14px;
}
}
}
</style>
<template>
  <div class="charts-container" ref="chartsContainer" style="width:100%;height: 100%">

  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: "ECharts",
  data() {
    return {
      charts: null,
      listener: null,
      recordOldValue: {width: 0, height: 0}
    }
  },
  props: {
    options: {
      type: Object,
      default: () => {
      }
    }
  },
  methods: {
    resizeCharts() {
      this.charts.resize();
    },
    /*observeContainerResize() {
      let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
      let element = this.$refs.chartsContainer;
      this.observer = new MutationObserver((mutationList) => {
        let width = getComputedStyle(element).getPropertyValue('width');
        let height = getComputedStyle(element).getPropertyValue('height');
        if (width === this.recordOldValue.width && height === this.recordOldValue.height) {
          return
        }
        this.recordOldValue = {
          width,
          height
        }
        this.resizeCharts();
      })
      this.observer.observe(element, {
        attributes: true,
        subtree: true,
        characterData: true,
        attributeFilter: ['style'],
        attributeOldValue: true
      })
    }*/
  },
  watch: {
    options: {
      handler(newValue) {
        this.charts.setOption(newValue)
      },
      deep: true
    }
  },
  mounted() {
    this.charts = echarts.init(this.$refs.chartsContainer);
    this.charts.setOption(this.options);
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeDestroyed() {
    window.removeEventListener('resize', this.resizeCharts)
  }
}
</script>

<style scoped>
.charts-container {
  overflow: auto;
}
</style>
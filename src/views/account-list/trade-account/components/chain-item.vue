<template>
  <a-spin style="width: 100%">
    <a-card
      class="general-card"
      :title="title"
      :header-style="{ paddingBottom: '12px' }"
    >
      <div class="content">
        <a-statistic
          :value="count"
          :show-group-separator="true"
          :value-from="0"
          :precision="precision"
          animation
        >
          <template #suffix> {{ suffix }}</template>
        </a-statistic>
        <a-typography-text
          class="percent-text"
          :type="isUp ? 'success' : 'danger'"
        >
          {{ Math.abs(growth) }}%
          <icon-arrow-rise v-if="isUp" />
          <icon-arrow-fall v-else />
        </a-typography-text>
      </div>
      <div class="chart">
        <Chart :option="chartOption" />
      </div>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import useChartOption from '@/hooks/chart-option';
  import { ValData } from '@/api/visualization';

  const props = withDefaults(
    defineProps<{
      title: string;
      chartType: string;
      chartData: ValData[];
      precision: number;
      suffix?: string;
    }>(),
    {
      title: '',
      chartType: 'bar',
      chartData: [] as ValData[],
      precision: 0,
      suffix: '',
    }
  );

  const count = computed(() => {
    if (props.chartData.length > 0) {
      return props.chartData.slice(-1)[0].val;
    }
    return 0;
  });
  const growth = computed(() => {
    if (props.chartData.length > 1) {
      const last = props.chartData.slice(-2);
      return last[0].val
        ? Number(((last[1].val / last[0].val - 1) * 100).toFixed(2))
        : 100;
    }
    return 0;
  });

  const isUp = computed(() => growth.value >= 0);
  const { chartOption } = useChartOption(() => {
    return {
      grid: {
        left: 0,
        right: 0,
        top: 5,
        bottom: 5,
      },
      xAxis: {
        type: 'category',
        show: false,
      },
      yAxis: {
        show: false,
        scale: true,
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter: '{c}',
      },
      series: [
        {
          data: props.chartData.map((item) => item.val),
          ...(props.chartType === 'bar'
            ? {
                type: 'bar',
                barWidth: 7,
                barGap: '0',
                color: 'rgb(145,93,243)',
              }
            : {
                type: 'line',
                showSymbol: false,
                smooth: true,
                lineStyle: {
                  color: '#4080FF',
                },
              }),
        },
      ],
    };
  });
  // const fetchData = async (params: DataChainGrowth) => {
  //   try {
  //     const { data } = await queryDataChainGrowth(params);
  //     const { chartData: resChartData } = data;
  //     count.value = data.count;
  //     growth.value = data.growth;
  //     resChartData.data.value.forEach((el, idx) => {
  //       if (props.chartType === 'bar') {
  //         chartData.value.push({
  //           value: el,
  //           itemStyle: {
  //             color: idx % 2 ? '#468DFF' : '#86DF6C',
  //           },
  //         });
  //       } else {
  //         chartData.value.push(el);
  //       }
  //     });
  //   } catch (err) {
  //     // you can report use errorHandler or other
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // fetchData({ quota: props.quota });
</script>

<style scoped lang="less">
  .general-card {
    min-height: 204px;
  }

  .content {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 12px;
  }

  .percent-text {
    margin-left: 16px;
  }

  .chart {
    width: 100%;
    height: 80px;
    vertical-align: bottom;
  }

  .unit {
    padding-left: 8px;
    font-size: 12px;
  }

  .label {
    padding-right: 8px;
    font-size: 12px;
  }
</style>

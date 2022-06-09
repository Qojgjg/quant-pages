<template>
  <a-spin style="width: 100%">
    <a-card class="general-card" title="数据总览">
      <a-row justify="space-between">
        <a-col v-for="(item, idx) in renderData" :key="idx" :span="6">
          <a-statistic
            :title="item.title"
            :value="item.value"
            :precision="item.precision || 3"
            show-group-separator
            :value-from="0"
            animation
          >
            <template #prefix>
              <span
                class="statistic-prefix"
                :style="{ background: item.prefix.background }"
              >
                <component
                  :is="item.prefix.icon"
                  :style="{ color: item.prefix.iconColor }"
                />
              </span>
            </template>
            <template #suffix>
              {{ item.suffix || '' }}
            </template>
          </a-statistic>
        </a-col>
      </a-row>
      <Chart style="height: 328px; margin-top: 20px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { LineSeriesOption } from 'echarts';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import useThemes from '@/hooks/themes';
  import useChartOption from '@/hooks/chart-option';

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class='content-panel'>
        <p>
          <span style='background-color: ${
            el.color
          }' class='tooltip-item-icon'></span><span>${el.seriesName}</span>
        </p>
        <span class='tooltip-value'>${el.value.toLocaleString()}</span>
      </div>`
      )
      .reverse()
      .join('');
  };
  const generateSeries = (
    name: string,
    lineColor: string,
    itemBorderColor: string,
    data: number[]
  ): LineSeriesOption => {
    return {
      name,
      data,
      stack: 'Total',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 10,
      itemStyle: {
        color: lineColor,
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          color: lineColor,
          borderWidth: 2,
          borderColor: itemBorderColor,
        },
      },
      lineStyle: {
        width: 2,
        color: lineColor,
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.1,
        color: lineColor,
      },
    };
  };
  const { isDark } = useThemes();
  const props = defineProps<{
    currentBalance: number;
    initAssetsBalance: number;
    totalProfit: number;
    avgProfit: number;
    xAxis: string[];
    balanceList: number[];
    initAssetsAmountList: number[];
  }>();
  const renderData = computed(() => [
    {
      title: '实时保证金',
      value: props.currentBalance || 0,
      prefix: {
        icon: 'icon-user',
        background: isDark.value ? '#593E2F' : '#FFE4BA',
        iconColor: isDark.value ? '#F29A43' : '#F77234',
      },
    },
    {
      title: '初始保证金',
      value: props.initAssetsBalance || 0,
      prefix: {
        icon: 'icon-thunderbolt',
        background: isDark.value ? '#3D5A62' : '#E8FFFB',
        iconColor: isDark.value ? '#6ED1CE' : '#33D1C9',
      },
    },
    {
      title: '总计盈利',
      value: props.totalProfit || 0,
      prefix: {
        icon: 'icon-layers',
        background: isDark.value ? '#354276' : '#E8F3FF',
        iconColor: isDark.value ? '#4A7FF7' : '#165DFF',
      },
    },
    {
      title: '年化收益',
      value: props.avgProfit || 0,
      prefix: {
        icon: 'icon-trophy',
        background: isDark.value ? '#3F385E' : '#F5E8FF',
        iconColor: isDark.value ? '#8558D3' : '#722ED1',
      },
      suffix: '%',
      precision: 2,
    },
  ]);
  const { chartOption } = useChartOption((dark) => {
    return {
      grid: {
        left: '80',
        right: '4',
        top: '40',
        bottom: '40',
      },
      xAxis: {
        type: 'category',
        offset: 2,
        data: props.xAxis,
        boundaryGap: false,
        axisLabel: {
          color: '#4E5969',
          formatter(value: number, idx: number) {
            if (idx === 0) return '';
            if (idx === props.xAxis.length - 1) return '';
            return `${value}`;
          },
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisPointer: {
          show: true,
          lineStyle: {
            color: '#23ADFF',
            width: 2,
          },
        },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter(value: number, idx: number) {
            if (idx === 0) return String(value);
            return `${value}`;
          },
        },
        splitLine: {
          lineStyle: {
            color: dark ? '#2E2E30' : '#F2F3F5',
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
            <p class='tooltip-title'>${firstElement.axisValueLabel}</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
          </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      graphic: {
        elements: [
          {
            type: 'text',
            left: '2.6%',
            bottom: '18',
            style: {
              text: props.xAxis[0] || '',
              textAlign: 'center',
              fill: '#4E5969',
              fontSize: 12,
            },
          },
          {
            type: 'text',
            right: '0',
            bottom: '18',
            style: {
              text: props.xAxis?.length
                ? props.xAxis[props.xAxis.length - 1]
                : '',
              textAlign: 'center',
              fill: '#4E5969',
              fontSize: 12,
            },
          },
        ],
      },
      series: [
        generateSeries(
          '初始保证金',
          '#F77234',
          '#FFE4BA',
          props.initAssetsAmountList
        ),
        generateSeries('当日收益', '#722ED1', '#F5E8FF', props.balanceList),
      ],
    };
  });
</script>

<style scoped lang="less">
  :deep(.arco-statistic) {
    .arco-statistic-title {
      color: rgb(var(--gray-10));
      font-weight: bold;
    }

    .arco-statistic-value {
      display: flex;
      align-items: center;
    }
  }

  .statistic-prefix {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-right: 8px;
    color: var(--color-white);
    font-size: 16px;
    line-height: 32px;
    border-radius: 6px;
  }
</style>

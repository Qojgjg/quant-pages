<template>
  <a-card class="general-card" title="实时仓位">
    <a-result
      v-if="!props.shortPosition?.length && !props.longPosition?.length"
      class="result"
      status="404"
      subtitle="暂时没有持仓～"
      style="height: 419px"
    />
    <Chart v-else height="419px" :option="chartOption" />
  </a-card>
</template>

<script lang="ts" setup>
  import useChartOption from '@/hooks/chart-option';
  import { PositionData } from '@/api/visualization';

  const props = defineProps<{
    shortPosition: PositionData[];
    longPosition: PositionData[];
  }>();

  const { chartOption } = useChartOption((isDark: boolean) => {
    return {
      grid: {
        left: 0,
        right: 20,
        top: 0,
        bottom: 20,
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          formatter(value: number, idx: number) {
            if (idx === 0) return String(value);
            return `${Number(value)}`;
          },
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: isDark ? '#484849' : '#E5E8EF',
          },
        },
      },
      yAxis: {
        type: 'category',
        data: props.longPosition
          .map((item) => `${item.symbol.replace('USDT', '')}`)
          .concat(
            props.shortPosition.map(
              (item) => `${item.symbol.replace('USDT', '')}`
            )
          ),
        axisLabel: {
          show: true,
          color: '#4E5969',
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: isDark ? '#282828' : '#c8cbde',
          },
        },
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter(params: any) {
          const { value, positionSide } = params[0].data;
          return positionSide === 'LONG'
            ? `看多: ${value.toFixed(2)}USDT`
            : `看空: ${value.toFixed(2)}USDT`;
        },
      },
      series: [
        {
          data: props.longPosition
            .map((item) => ({
              value: Math.abs(item.qty),
              positionSide: 'LONG',
            }))
            .concat(
              props.shortPosition.map((item) => ({
                value: Math.abs(item.qty),
                positionSide: 'SHORT',
              }))
            ),
          type: 'bar',
          barWidth: 7,
          itemStyle: {
            normal: {
              color(params: any) {
                return params.data.positionSide === 'LONG'
                  ? '#0bcb80'
                  : '#f6465d';
              },
              borderRadius: 4,
            },
          },
        },
      ],
    };
  });
</script>

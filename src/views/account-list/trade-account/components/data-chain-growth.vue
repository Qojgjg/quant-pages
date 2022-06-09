<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="6">
        <ChainItem
          title="当日年化"
          :chart-data="props.annuitizationList"
          :precision="2"
          suffix="%"
          chart-type="line"
        />
      </a-col>
      <a-col :span="6">
        <ChainItem
          title="当日盈利"
          :chart-data="props.profits"
          :precision="3"
          chart-type="bar"
        />
      </a-col>
      <a-col :span="6">
        <ChainItem
          title="BTC价格"
          :chart-data="props.btcPrices"
          :precision="2"
          chart-type="line"
        />
      </a-col>
      <a-col :span="6">
        <ChainItem
          title="当日订单量"
          :chart-data="props.totalNums"
          :precision="0"
          chart-type="bar"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { ValData } from '@/api/visualization';
  import ChainItem from './chain-item.vue';

  const props = defineProps<{
    annuitizationList: ValData[];
    btcPrices: ValData[];
    totalNums: ValData[];
    profits: ValData[];
  }>();
</script>

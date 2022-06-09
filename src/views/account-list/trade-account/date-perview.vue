<template>
  <div class="container">
    <Breadcrumb :items="['账号列表', '交易账号', '运行数据']" />
    <a-spin :loading="loading" style="width: 100%">
      <a-page-header title="运行数据" @back="back">
        <template #extra>
          <a-range-picker
            v-model="dateRangeValue"
            style="width: 254px"
            @change="onDateChange"
          />
        </template>
      </a-page-header>
      <a-space direction="vertical" :size="16" fill>
        <a-grid :cols="24" :col-gap="16" :row-gap="16">
          <a-grid-item
            :span="{ xs: 24, sm: 24, md: 24, lg: 18, xl: 18, xxl: 18 }"
          >
            <DataOverview
              :x-axis="xAxis"
              :avg-profit="statsData.avgProfit"
              :balance-list="balanceList"
              :current-balance="statsData.currentBalance"
              :init-assets-amount-list="initAssetsBalanceList"
              :init-assets-balance="statsData.initAssetsBalance"
              :total-profit="statsData.totalProfit"
            />
          </a-grid-item>
          <a-grid-item :span="{ xs: 24, sm: 24, md: 24, lg: 6, xl: 6, xxl: 6 }">
            <UserPosition
              :short-position="statsData.shortPosition"
              :long-position="statsData.longPosition"
            />
          </a-grid-item>
        </a-grid>
        <DataChainGrowth
          :annuitization-list="statsData.annuitizationList"
          :btc-prices="statsData.btcPrices"
          :total-nums="statsData.totalNums"
          :profits="statsData.profits"
        />
        <a-card class="general-card" title="最近15条成交记录">
          <a-table :data="tableData" :bordered="false" :pagination="false">
            <template #columns>
              <a-table-column title="合约" data-index="symbol" />
              <a-table-column title="操作">
                <template #cell="{ record }">
                  <span
                    v-if="record.side === 'SELL'"
                    style="color: rgb(207, 48, 74); font-weight: bold"
                  >
                    {{ record.positionSide === 'LONG' ? '平多' : '开空' }}
                  </span>
                  <span
                    v-else
                    style="color: rgb(3, 166, 109); font-weight: bold"
                  >
                    {{ record.positionSide === 'SHORT' ? '平空' : '开多' }}
                  </span>
                </template>
              </a-table-column>
              <a-table-column title="价格" data-index="price" />
              <a-table-column title="数量" data-index="qty" />
              <a-table-column title="总值" data-index="quoteQty" />
              <a-table-column title="实现盈亏" data-index="realizedPnl" />
              <a-table-column title="手续费" data-index="commission" />
              <a-table-column title="时间" data-index="time">
                <template #cell="{ record }">
                  {{ record.time.replace('T', ' ').slice(0, 19) }}
                </template>
              </a-table-column>
            </template>
          </a-table>
        </a-card>
      </a-space>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import {
    DataOverviewRes,
    queryDataOverview,
    RecentTrade,
  } from '@/api/visualization';
  import DataOverview from './components/data-overview.vue';
  import UserPosition from './components/user-position.vue';
  import DataChainGrowth from './components/data-chain-growth.vue';

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(
      -2
    )}-${`0${date.getDate()}`.slice(-2)}`;
  };

  const router = useRouter();
  const route = useRoute();
  const loading = ref(true);
  const statsData = ref<DataOverviewRes>({
    currentBalance: 0,
    initAssetsBalance: 0,
    totalProfit: 0,
    avgProfit: 0,
    balanceDataList: [],
    longPosition: [],
    shortPosition: [],
    annuitizationList: [],
    btcPrices: [],
    totalNums: [],
    recentTrades: [],
    profits: [],
  });

  const xAxis = ref<string[]>([]);
  const balanceList = ref<number[]>([]);
  const initAssetsBalanceList = ref<number[]>([]);
  const tableData = ref<RecentTrade[]>([]);
  const dateRangeValue = ref([
    formatDate(Date.now() - 7 * 24 * 60 * 60 * 1000),
    formatDate(Date.now()),
  ]);

  const back = () => router.back();

  async function fetchData(
    beginDate: string,
    endDate: string,
    accountId: number
  ) {
    statsData.value = (
      await queryDataOverview({
        beginDate,
        endDate,
        accountId,
      })
    ).data;
    xAxis.value = statsData.value.balanceDataList.map((item) =>
      item.date.slice(-5).replace('-', '.')
    );
    balanceList.value = statsData.value.balanceDataList.map(
      (item) => item.totalAssetsBalance
    );
    initAssetsBalanceList.value = statsData.value.balanceDataList.map(
      (item) => item.initAssetsBalance
    );
    tableData.value = statsData.value.recentTrades;

    loading.value = false;
  }

  fetchData(
    dateRangeValue.value[0],
    dateRangeValue.value[1],
    parseInt(route.params.id as string, 10)
  );

  const onDateChange = () => {
    fetchData(
      dateRangeValue.value[0],
      dateRangeValue.value[1],
      parseInt(route.params.id as string, 10)
    );
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    background-color: var(--color-bg-2);

    :deep(.arco-form) {
      .arco-form-item {
        &:last-child {
          margin-top: 20px;
        }
      }
    }
  }

  .steps {
    margin-bottom: 76px;
  }
</style>

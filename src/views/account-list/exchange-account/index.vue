<template>
  <div class="container">
    <Breadcrumb :items="['账号列表', '监听账号']" />
    <a-card class="general-card" title="监听账号">
      <a-row>
        <a-col :flex="1">
          <a-form
            :label-col-props="{ span: 4 }"
            :wrapper-col-props="{ span: 20 }"
            :model="formModel"
            label-align="left"
            style="margin-bottom: 0"
          >
            <a-row :gutter="32">
              <a-col :span="8">
                <a-form-item field="nickname" label="昵称">
                  <a-input
                    v-model="formModel.nickname"
                    placeholder="请输入昵称"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="exchange" label="交易所">
                  <a-select
                    v-model="formModel.exchange"
                    :options="exchangeOptions"
                    placeholder="请选择交易所"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="accountStatus" label="状态">
                  <a-select
                    v-model="formModel.accountStatus"
                    placeholder="请选择状态"
                  >
                    <a-option :value="'Enable'">
                      <a-space>
                        <a-badge status="success" />
                        <span>启用</span>
                      </a-space>
                    </a-option>
                    <a-option :value="'Disable'">
                      <a-space>
                        <a-badge status="normal" />
                        <span>停用</span>
                      </a-space>
                    </a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-col :flex="'96px'" style="margin-left: 30px; text-align: right">
          <a-space direction="horizontal" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              搜索
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />
      <a-row style="margin-bottom: 16px">
        <a-col :span="16">
          <a-space>
            <a-button type="primary" @click="() => toEdit()">
              <template #icon>
                <icon-plus />
              </template>
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="pagination"
        :data="renderData"
        :bordered="false"
        @page-change="onPageChange"
      >
        <template #columns>
          <a-table-column title="昵称" data-index="nickname" />
          <a-table-column title="备注" data-index="remark" />
          <a-table-column title="状态" data-index="accountStauts">
            <template #cell="{ record }">
              <a-badge
                :status="
                  record.accountStatus === 'Enable' ? 'success' : 'normal'
                "
                :text="record.accountStatus === 'Enable' ? '启用' : '停用'"
              />
            </template>
          </a-table-column>
          <a-table-column title="交易所" data-index="exchange">
            <template #cell="{ record }">
              <a-space size="mini">
                <icon-font :type="'icon-' + record.exchange" :size="24" />
                <span>{{ record.exchange === 'Binance' ? '币安' : '-' }}</span>
              </a-space>
            </template>
          </a-table-column>
          <a-table-column title="创建时间" data-index="createTime">
            <template #cell="{ record }">
              {{ record.createTime?.replace('T', ' ') || '' }}
            </template>
          </a-table-column>
          <!--          <a-table-column title="操作" data-index="operations">-->
          <!--            <template #cell>-->
          <!--              <a-button type="text" size="small"> 数据统计 </a-button>-->
          <!--            </template>-->
          <!--          </a-table-column>-->
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';

  import useLoading from '@/hooks/loading';
  import {
    queryExchangeAccountList,
    ExchangeAccount,
    PageParam,
  } from '@/api/account-list';
  import { Pagination } from '@/types/global';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import { Message, Icon } from '@arco-design/web-vue';

  const IconFont = Icon.addFromIconFontCn({
    src: '//at.alicdn.com/t/font_3446482_33f1ihhtatl.js',
  });

  const toEdit = () => {
    Message.error({
      content: '尚不支持',
    });
  };

  const generateFormModel = () => {
    return {
      nickname: '',
      accountStatus: '',
      exchange: '',
    };
  };
  const { loading, setLoading } = useLoading(true);

  const renderData = ref<ExchangeAccount[]>([]);
  const formModel = ref(generateFormModel());
  const basePagination: Pagination = {
    current: 0,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const exchangeOptions = computed<SelectOptionData[]>(() => [
    {
      label: '币安',
      value: 'Binance',
    },
  ]);
  const fetchData = async (params: PageParam = { page: 0, size: 10 }) => {
    setLoading(true);
    try {
      const { data } = await queryExchangeAccountList(params);
      renderData.value = data.list;
      pagination.current = params.page + 1;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData({
      page: basePagination.current,
      size: basePagination.pageSize,
      ...formModel.value,
    } as unknown as PageParam);
  };
  const onPageChange = (page: number) => {
    fetchData({ page, size: basePagination.pageSize, ...formModel.value });
  };

  fetchData();
  const reset = () => {
    formModel.value = generateFormModel();
  };
</script>

<script lang="ts">
  export default {
    name: 'SearchTable',
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }
</style>

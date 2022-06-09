<template>
  <a-spin :loading="loading" tip="正在加载数据...">
    <a-form
      ref="formRef"
      :model="formData"
      class="form"
      :label-col-props="{ span: 6 }"
      :wrapper-col-props="{ span: 18 }"
    >
      <a-form-item
        field="nickname"
        label="昵称"
        :rules="[
          {
            required: true,
            message: '请输入昵称',
          },
        ]"
      >
        <a-input v-model="formData.nickname" placeholder="请输入昵称" />
      </a-form-item>
      <a-form-item
        field="follow.id"
        label="追踪账号"
        :rules="[
          {
            required: true,
            message: '请选择追踪账号',
          },
        ]"
      >
        <a-select v-model="formData.follow.id" placeholder="请选择追踪账号">
          <a-option
            v-for="item in allExchangeAccount"
            :key="item.id"
            :value="item.id"
            :label="item.nickname"
          />
        </a-select>
        <a-button
          style="margin-left: 20px"
          @click="exchangeAccountPositionQuery"
          >保证金查询
        </a-button>
        <template #extra>
          <div>{{ tips }}</div>
        </template>
      </a-form-item>
      <a-form-item
        field="apiKey"
        label="API KEY"
        :rules="[
          {
            required: true,
            message: '请输入APIKEY',
          },
        ]"
      >
        <a-input v-model="formData.apiKey" placeholder="请输入APIKEY" />
      </a-form-item>
      <a-form-item
        field="apiSecret"
        label="API SECRET"
        :rules="[
          {
            required: true,
            message: '请输入APISECRET',
          },
        ]"
      >
        <a-input v-model="formData.apiSecret" placeholder="请输入APISECRET" />
        <a-button style="margin-left: 20px" @click="tradeAccountPosition"
          >保证金查询
        </a-button>
        <template #extra>
          {{ tradeTips }}
        </template>
      </a-form-item>
      <a-form-item
        field="factor"
        label="仓位因子"
        :rules="[
          {
            required: true,
            message: '请输入仓位因子',
          },
          {
            type: 'number',
            min: 0,
            message: '因子不能小于0',
          },
        ]"
      >
        <a-input-number
          v-model="formData.factor"
          placeholder="请输入仓位因子"
          :step="0.1"
          :min="0"
          :max="100"
        >
        </a-input-number>
      </a-form-item>
      <a-form-item
        field="exchange"
        label="交易所"
        :rules="[
          {
            required: true,
            message: '请选择交易所',
          },
        ]"
      >
        <a-select v-model="formData.exchange" placeholder="请选择交易所">
          <a-option value="Binance">Binance</a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="accountStatus" label="状态">
        <a-switch
          v-model="formData.accountStatus"
          checked-value="Enable"
          unchecked-value="Disable"
        >
        </a-switch>
      </a-form-item>
      <a-form-item field="remark" label="备注">
        <a-input v-model="formData.remark" type="text" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" long :loading="submitLoading" @click="submit"
          >提交</a-button
        >
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    ExchangeAccount,
    queryAllExchangeAccount,
    queryExchangeAccountPosition,
    querySingleTradeAccount,
    queryTradeAccountPosition,
    saveTradeAccount,
    TradeAccount,
  } from '@/api/account-list';
  import { useRoute, useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';

  const allExchangeAccount = ref<ExchangeAccount[]>();
  queryAllExchangeAccount().then((resp) => {
    allExchangeAccount.value = resp.data;
  });

  const formData = ref<TradeAccount>({
    follow: {},
  });

  const loading = ref(true);
  const submitLoading = ref(false);
  const { id } = useRoute().params;
  const router = useRouter();
  const tips = ref();
  const tradeTips = ref();

  if (id) {
    querySingleTradeAccount({ id })
      .then((resp) => {
        const account: TradeAccount = resp.data;
        Object.assign(formData.value, account);
        formData.value.follow = { id: formData.value.follow };
        loading.value = false;
      })
      .catch(() => {
        router.replace({
          path: '/exception/404',
        });
      });
  } else {
    loading.value = false;
  }

  const tradeAccountPosition = () => {
    const { apiKey, apiSecret } = formData.value;
    if (apiKey && apiSecret) {
      queryTradeAccountPosition({ apiKey, apiSecret }).then((resp) => {
        tradeTips.value = `保证金余额: ${resp.data.toFixed(2)}`;
      });
    } else {
      Message.error({
        content: '请填入API KEY和API SECRET',
      });
    }
  };

  const submit = () => {
    submitLoading.value = true;
    saveTradeAccount(formData.value)
      .then(() => {
        Message.success('成功！');
        router.push({
          name: 'TradeAccountList',
        });
      })
      .finally(() => {
        submitLoading.value = false;
      });
  };

  const exchangeAccountPositionQuery = () => {
    if (formData.value.follow?.id) {
      queryExchangeAccountPosition({ id: formData.value.follow?.id }).then(
        (resp) => {
          tips.value = `保证金余额: ${resp.data.toFixed(2)}`;
        }
      );
    } else {
      Message.error({
        content: '请选择追踪账号',
      });
    }
  };
</script>

<style scoped lang="less">
  .container {
    padding: 20px;

    .keep-margin {
      margin-bottom: 20px;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 64px 0;
    background-color: var(--color-bg-2);
  }

  .steps {
    margin-bottom: 36px;
  }

  .form {
    width: 500px;
  }

  .form-content {
    padding: 8px 50px 0 30px;
  }
</style>

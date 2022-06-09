<template>
  <div class="container">
    <Breadcrumb :items="['账号列表', '交易账号', pageTitle]" />
    <a-spin :loading="loading" style="width: 100%">
      <a-card class="general-card">
        <template #title>
          <a-page-header :title="pageTitle" @back="back" />
        </template>
        <div class="wrapper">
          <EditForm />
        </div>
      </a-card>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import EditForm from './edit-form.vue';

  const loading = ref(false);
  const route = useRoute();
  const router = useRouter();

  const { id } = route.params;

  const pageTitle = ref();

  const back = () => {
    router.back();
  };

  if (id) {
    pageTitle.value = '编辑账号';
  } else {
    pageTitle.value = '添加账号';
  }
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

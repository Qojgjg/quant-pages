<template>
  <div class="container">
    <div class="content">
      <a-result class="result" status="404" subtitle="页面找不到啦～">
      </a-result>
      <div class="operation-row">
        <a-button key="back" type="primary" @click="back"> 返回 </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const back = () => router.back();
</script>

<style scoped lang="less">
  .container {
    height: calc(100% - 40px);
    padding: 0 20px 20px 20px;

    :deep(.content) {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      background-color: var(--color-bg-1);
      border-radius: 4px;
    }
  }
</style>

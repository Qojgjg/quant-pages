<template>
  <a-spin style="display: block" :loading="loading">
    <a-result v-if="!renderList.length" status="404">
      <template #subtitle>还没有消息哦</template>
    </a-result>
    <List
      :render-list="renderList"
      :unread-count="unreadCount"
      @item-click="handleItemClick"
    />
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref, reactive, toRefs, computed } from 'vue';
  import {
    queryMessageList,
    setMessageStatus,
    MessageRecord,
    MessageListType,
  } from '@/api/message';
  import useLoading from '@/hooks/loading';
  import List from './list.vue';

  const { loading, setLoading } = useLoading(true);
  const messageType = ref('message');
  const messageData = reactive<{
    renderList: MessageRecord[];
    messageList: MessageRecord[];
  }>({
    renderList: [],
    messageList: [],
  });
  toRefs(messageData);

  async function fetchSourceData() {
    setLoading(true);
    try {
      const { data } = await queryMessageList();
      messageData.messageList = data;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  }

  async function readMessage(data: MessageListType) {
    const ids = data.map((item) => item.id);
    await setMessageStatus({ ids });
    fetchSourceData();
  }

  const renderList = computed(() => {
    return messageData.messageList.filter(
      (item) => messageType.value === item.type
    );
  });
  const unreadCount = computed(() => {
    return renderList.value.filter((item) => !item.status).length;
  });
  const handleItemClick = (items: MessageListType) => {
    if (renderList.value.length) readMessage([...items]);
  };
  fetchSourceData();
</script>

<style scoped lang="less">
  :deep(.arco-popover-popup-content) {
    padding: 0;
  }

  :deep(.arco-list-item-meta) {
    align-items: flex-start;
  }

  :deep(.arco-tabs-nav) {
    padding: 14px 0 12px 16px;
    border-bottom: 1px solid var(--color-neutral-3);
  }

  :deep(.arco-tabs-content) {
    padding-top: 0;

    .arco-result-subtitle {
      color: rgb(var(--gray-6));
    }
  }
</style>

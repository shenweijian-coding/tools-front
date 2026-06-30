<template>
  <a-input-search :loading="loading"
    placeholder="粘贴素材详情页链接，按回车开始搜索" v-model="url" button-text="立即搜索" search-button
    class="sucai-search-input" @search="getPlay" size="large">
  </a-input-search>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
const props = defineProps({
  loading: {
    type: Boolean
  }
})

const emit = defineEmits(['getPlay'])
const url = ref('')
const getPlay = () => {
  if (!url.value) {
    {
      Message.warning('输入框不能为空')
      return
    }
  }
  emit('getPlay', url)
}

// 处理黄蜂链接
const href = window.location.href
const hfUrl = href.match(/url=(\S*)/)?.[1] // 匹配链接
if (hfUrl) {
  url.value = hfUrl
  getPlay()
}
</script>
<style scoped>
.sucai-search-input {
  width: 100%;
  height: 62px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.13);
}

.sucai-search-input :deep(.arco-input-wrapper) {
  height: 62px;
  padding-left: 20px;
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.sucai-search-input :deep(.arco-input) {
  font-size: 16px;
  color: #111827;
}

.sucai-search-input :deep(.arco-input::placeholder) {
  color: #94a3b8;
}

.sucai-search-input :deep(.arco-input-append) {
  background: transparent;
  border: 0;
}

.sucai-search-input :deep(.arco-input-append button) {
  height: 62px;
  min-width: 128px;
  border-radius: 0;
  border: 0;
  background: #111827;
  color: #fff;
  font-weight: 600;
}

.sucai-search-input :deep(.arco-input-append button:hover) {
  background: #0f766e;
}

@media (max-width: 640px) {
  .sucai-search-input,
  .sucai-search-input :deep(.arco-input-wrapper),
  .sucai-search-input :deep(.arco-input-append button) {
    height: 54px;
  }

  .sucai-search-input :deep(.arco-input-append button) {
    min-width: 94px;
  }
}
</style>

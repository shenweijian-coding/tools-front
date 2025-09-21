<template>
  <a-input-search :loading="loading" style="height: 58px;background-color: #ffa00c;width: 70%;"
    placeholder="复制链接到此处，回车或者点击搜索，输入框底部会出现下载按钮，再次点击稍等片刻即可！" v-model="url" button-text="搜索" search-button
    class="rounded-md" @search="getPlay" size="large">
    <template #prefix>
      <icon-search size="20"/>
    </template>
  </a-input-search>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import { IconSearch } from '@arco-design/web-vue/es/icon';
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
<style>
.arco-input-append button {
  height: 100%;
  width: 120px;
}
</style>
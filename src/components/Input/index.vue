<template>
  <a-input-search
    :loading="loading"
    style="height: 44px"
    placeholder="复制链接到此处，点击搜索，稍等片刻即可！"
    v-model="url"
    button-text="搜索"
    search-button
    @search="getPlay"
    size="large"/>
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
  if(!url.value) {{
    Message.warning('输入框不能为空')
    return
  }}
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
.arco-input-append button{
  height: 100%;
  width: 100px;
}
</style>
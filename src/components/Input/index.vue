<template>
  <a-input-search
    :loading="loading"
    style="height: 44px;border: 1px solid #eceff7"
    :placeholder="placeholder"
    v-model="url"
    :button-text="btnText"
    search-button
    @search="getPlay"
    size="large"/>
</template>

<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
const props = defineProps({
  loading: {
    type: Boolean
  },
  time: {
    type: Number
  },
  placeholder: {
    type: String,
    default: '复制链接到此处，百度搜索一下'
  },
  btnText: {
    type: String,
    default: '百度一下'
  }
})
const emit = defineEmits(['getPlay'])
const url = ref('')
const getPlay = () => {
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
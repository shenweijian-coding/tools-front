<template>
  <a-input-search
    :loading="loading"
    style="height: 44px"
    placeholder="复制链接到此处，百度搜索一下"
    v-model="url"
    button-text="百度一下"
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
</script>
<style>
.arco-input-append button{
  height: 100%;
  width: 100px;
}
</style>
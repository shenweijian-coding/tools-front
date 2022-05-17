<template>
  <a-input-search
    :loading="loading"
    style="height: 44px"
    placeholder="复制链接到此处，点击解析，稍等片刻即可！"
    v-model="url"
    button-text="解析"
    search-button
    @search="getPlay"
    size="large"/>
</template>

<script setup>
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
    Message.warning('url不能为空')
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
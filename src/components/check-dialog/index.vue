<template>
  <!-- <a-modal 
    v-model:visible="visible" 
    :closable="false" 
    width="300px"
    title="人机校验(验证成功继续下载)"
    :footer="false" 
    @close="close">
      <a-input-search placeholder="请输入5位校验码" button-text="点击验证" v-model="downCode" search-button @search="checkCode"></a-input-search>
      <QR class="mt-4" tip="校验码"/>
  </a-modal> -->
  <s-dialog
    v-model:visible="visible"
    width="300px"
    title="人机校验(验证成功继续下载)"
    @close="close"
  >
    <a-input-search placeholder="请输入5位校验码" button-text="点击验证" v-model="downCode" search-button @search="checkCode"></a-input-search>
    <QR class="mt-4" tip="校验码" v-if="visible"/>
  </s-dialog>
</template>
<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import QR from '@/components/dialog/index.vue'
import sDialog from '@/components/s-dialog/index.vue';
const downCode = ref('')
const emit = defineEmits(['checkCode', 'close'])
const props = defineProps({
  visible: Boolean
})
const close = () => {
  downCode.value = ''
  emit('close')
}
const checkCode = () => {
  if(!downCode.value) {
    Message.warning('请前往公众号获取“校验码”')
    return
  }
  emit('checkCode', downCode.value)
}

</script>
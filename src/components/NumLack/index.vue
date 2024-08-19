<template>
  <s-dialog :visible="visible" width="600px" title="积分不足提醒" @close="close">
    积分不足，无法搜索哦~
  </s-dialog>
</template>
<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import sDialog from '@/components/s-dialog/index.vue';

const emit = defineEmits(['close', 'getDetail'])
const props = defineProps({
  visible: Boolean
})
const close = () => {
  emit('close')
}
const getDetail = () => {
  emit('getDetail')
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}
</style>
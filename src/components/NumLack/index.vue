<template>
  <s-dialog v-model:visible="visible" width="500px" title="积分不足提醒" @close="close">
    <p style="line-height: 30px;">您可以选择如下方式获取积分<br>
    1. 【免费】完任务送积分，点击右上角免费获取按钮了解详情<br>
    2. 【赞助】赞助本站送积分，<a-button size="mini" type="text" status="success" href="#/shop">点我跳转</a-button>
    </p>
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
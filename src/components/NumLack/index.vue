<template>
  <s-dialog v-model:visible="visible" width="500px" title="【提示】您的账号积分不足-无法下载" @close="close">
    <p style="line-height: 22px;">您可以选择如下方式获取积分<br>
    1. 微信小程序内观看广告，免费获取积分【点击右上角免费获取】<br>
    2. 赞助本站获取积分，【点击顶部站内商店获取】
    </p>
  </s-dialog>
</template>
<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import sDialog from '@/components/s-dialog/index.vue';

const emit = defineEmits(['close'])
const props = defineProps({
  visible: Boolean
})
const close = () => {
  emit('close')
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}
</style>
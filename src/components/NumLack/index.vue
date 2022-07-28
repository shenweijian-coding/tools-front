<template>
  <s-dialog v-model:visible="visible" width="600px" title="【提示】您的账号积分不足" @close="close">
    <p style="line-height: 24px;">本站已免费提供素材下载数月<br>
      由于官方风控、封号严重、服务器运营成本等问题<br>需要不断的购买官方VIP账号来维持，被迫无法给大家继续提供免费服务<br>决定对下载做一定限制。感谢您的理解和支持</p>
    <br>
    <p style="font-weight: bold">不需要您一分钱;通过完成每日任务免费获取积分;即可继续使用本站下载服务</p>
    <!-- <br> -->
    <div style="display:flex;">
      <!-- <div>
        <p>点我完任务免费获取积分！</p>
        <br>
      </div> -->
      <!-- <div style="margin-left: 30px;text-align: center;">
        <p>2. 直接赞助本站获取积分</p>
        <a-button status="success" style="margin-top:12px;">立即赞助</a-button>
        <canvas id="qrcodeCanvas"> </canvas>
      </div> -->
    </div>
    <br>
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
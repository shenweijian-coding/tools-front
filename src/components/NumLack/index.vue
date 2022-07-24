<template>
  <s-dialog v-model:visible="visible" width="600px" title="小提示" @close="close">
    <p>本站已免费提供下载5个月，感谢大家的支持。但是免费的东西不长久。<br>
      由于官方风控、服务器成本增加以及为提供稳定的下载服务，我需要不断的购买官方VIP账号来维持。所以决定对下载做一定限制。</p>
    <p>本着能不花钱就不花钱的原则，特意开发了完任务送积分小程序，继续免费使用本站。</p>
    <p>或者以赞助的方式获取积分，感谢大家的体谅！</p>
    <br><br>
    <div style="display:flex;">
      <div>
        <p>1. 微信小程序-完任务送积分[免费]</p>
        <br>
        <img src="@/assets/images/wxapp.jpg" alt="小程序二维码" style="width:120px;height:120px;margin: auto;">
      </div>
      <div style="margin-left: 30px;text-align: center;">
        <p>2. 直接赞助本站获取积分</p>
        <a-button status="success" style="margin-top:12px;">立即赞助</a-button>
        <!-- <canvas id="qrcodeCanvas"> </canvas> -->
      </div>
    </div>
    <br>
  </s-dialog>
</template>
<script setup lang="ts">
import { Message } from '@arco-design/web-vue';
import sDialog from '@/components/s-dialog/index.vue';
import QRcode from 'qrcode';

const emit = defineEmits(['close'])

const shengcheng = () => {
  QRcode.toCanvas(
    document.getElementById('qrcodeCanvas'),
    localStorage.getItem('token'),
    {},
    function (err: any) {
      console.log(err);

    }
  );
}
const spon = () => {
  shengcheng()
}

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
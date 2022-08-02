<template>
  <s-dialog v-model:visible="visible" width="346px" @close="close">
    <div class="pay-box">
      <img src="https://11885878.s21i.faiusr.com/4/ABUIABAEGAAglOvoiQYo2orj2QIwuwE4QA.png" class="img-alipay" />
      <p class="order_title">{{ orderInfo.title }}</p>
      <div class="qr_code">
        <img
          :src="'/pay/createQRCode?text=' + encodeURIComponent(orderInfo.qrCode) + '&_=' + new Date().getTime()"
          style="display: inline-block;">
      </div>
      <p class="order-amount">
        ￥{{ orderInfo.price }}</p>
      <div class="hidden-xs-only tips-pc">
        请使用支付宝APP 扫一扫
        <br>
        扫描二维码支付
      </div>
    </div>
  </s-dialog>
</template>
<script setup lang="ts">
import sDialog from '@/components/s-dialog/index.vue';
const emit = defineEmits(['close'])
const props = defineProps({
  visible: Boolean,
  orderInfo: Object,
})
const close = () => {
  emit('close')
}
</script>
<style lang="less" scoped>
.xx-dialog {
  padding: 0 !important;
}

.pay-box {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  overflow: hidden;

  .img-alipay {
    height: 32px;
    margin-bottom: 4px;
    margin-top: 24px;
  }

  .order_title {
    margin: 16px 0 24px;
    font-size: 16px;
  }

  .qr_code {
    margin-bottom: 8px;
    height: 200px;

    img {
      width: 210px;
    }
  }

  .order-amount {
    font-size: 20px;
    color: #d64244;
    font-weight: 500;
    margin-bottom: 78px;
  }

  .tips-pc {
    position: absolute;
    height: 78px;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    padding: 24px 0;
    background-color: #555;
    color: #e7e7e7;
    border-radius: 0 0 4px 4px;
  }
}
</style>
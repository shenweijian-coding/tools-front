<template>
<div class="window-qr-code">
  <div style="display: flex;justify-content: center;">
    <img src="@/assets/images/QR.jpg" style="width: 200px;">
  </div>
  <div style="text-align: center; display: flex; align-items: center; justify-content: center;">
    <!-- <i class="iconfont icon-weixin1" style="color: rgb(0, 170, 127); font-size: 20px;"></i> -->
    <!-- <icon-wechat style="color: rgb(0, 170, 127); font-size: 20px;"/>  -->
    <span style="color: rgb(170, 170, 170); font-size: 13px; text-align: center; margin-left: 8px;"> 微信扫描二维码</span>
  </div>
  <div 
  style="text-align: center; font-size: 16px; margin: 8px;"><span style="font-size: 14px; color: rgb(51, 51, 51); font-weight: bold;">
  到公众号回复“<span style="margin: 0px 4px; color: rgb(32, 152, 209);">{{tip}}</span>”获取</span>
  </div>
</div>
</template>

<script setup>
const props = defineProps({
  tip: {
    type: String
  }
})
</script>

<style>
.window-qr-code{
  border-radius: 8px;
  background-color: #fff;
  /* max-width: 300px; */
  /* padding: 24px 8px; */
  margin: auto;
}
</style>
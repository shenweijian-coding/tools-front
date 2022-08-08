<template>
  <div>
    <div class="qr-code">
      <div class="qr-center">
        <img src="@/assets/images/wxapp.jpg" alt="二维码" style="width:140px;" />
        <span>图1：微信小程序码</span>
      </div>
      <div class="qr-center">
        <canvas id="qrcodeCanvas"></canvas>
        <span>图2：小程序端绑定码</span>
      </div>
    </div>
    <a-divider></a-divider>
    <p style="line-height: 30px;">
    1. 微信扫码图1,进入小程序;<br>
    2. 点击个人中心,点击扫码绑定扫码图2;<br>
    3. PC与小程序即可绑定;之后可获取积分用于网站下载;<br>
    4. 本站稳定解析极速下载,出现问题5分钟内解决;右侧有微信;欢迎咨询哈;
    </p>
  </div>
</template>

<script setup lang="ts">
import QRcode from 'qrcode';

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
setTimeout(() => {
  shengcheng()
})
</script>

<style scoped lang="less">
.qr-code {
  display: flex;
  justify-content: space-between;
}

.qr-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>

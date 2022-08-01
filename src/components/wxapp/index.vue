<template>
  <div class="frame-bg">
    <div class="frame-body">
      <div class="frame-aside">
        <a-steps changeable :current="current" direction="vertical" @change="change" small>
          <a-step>微信扫码小程序</a-step>
          <a-step>小程序扫码绑定【点我】</a-step>
          <a-step>完任务送积分</a-step>
        </a-steps>
      </div>
      <div class="frame-main">
        <div class="main-content">
          <div v-if="current === 1">
            <img src="@/assets/images/wxapp.jpg" alt="二维码" style="width:140px;">
            <p style="line-height: 24px;">使用微信扫码<br>进入小程序<br>点击【赚积分下素材】</p>
          </div>
          <div v-else-if="current === 2">
            <canvas id="qrcodeCanvas"></canvas>
            <p style="line-height: 24px;">点击【扫码绑定】<br>扫描上方二维码<br>PC端与小程序端即可完成绑定</p>
          </div>
          <div v-else-if="current === 3">
            <p style="line-height: 24px;margin-top: 24px;font-weight: bold;">每日完成任务<br>即可免费获取积分<br>免费下载全站的素材。</p>
            <br>
            <p style="line-height: 24px;">您也可以通过赞助本站获取积分<br>资费用于对接新素材网站<br>以及服务器运营开销<br>
              感谢您的支持</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRcode from 'qrcode';

const current = ref(1);

const change = (val) => {
  current.value = val
  if (val === 2) {
    setTimeout(() => {
      shengcheng()
    });
  }
}
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
</script>

<style scoped lang="less">
.frame-body {
  display: flex;
  background: var(--color-bg-2);
}

.frame-aside {
  padding: 24px 0;
}

.frame-main {
  // padding-top:24px;
  width: 260px;
}

.main-content {
  height: 84%;
  text-align: center;

  div {
    height: 70%;
    text-align: center;

    img,
    canvas {
      display: inline-block;
      margin-bottom: 12px;
    }
  }
}
</style>

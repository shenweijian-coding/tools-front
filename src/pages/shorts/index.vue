<template>
  <div class="shorts-box" v-loading="loading">
    <p class="shorts-desc">
      支持平台：<br>
      <b>抖音、快手、火山、微视、小红书、哔哩哔哩 、百度贴吧、 QQ看点、 AcFun、 淘宝、 UC视频、 趣头条、 皮皮虾、 小咖秀、 趣多拍、
        美拍、网易云、 陌陌、 映客、 迅雷、 阳光宽频、 全民K歌、 刷宝 、WIDE短视频 、 微博、秒拍、最右、酷燃</b>
      等平台视频主流短视频无水印原画质视频解析下载，短视频无水印原画质解析下载
    </p>
    <p class="shorts-desc">
      使用方法:<br>
      打开视频APP或者对应PC网页，点开某个视频，点击分享按钮或者复制PC链接，复制的链接粘贴到下面的输入框。
    </p>
    <Input @getPlay="getPlay" :loading="loading" />
    <div v-if="video.video">
      <a-divider />
      <div class="shorts-title">{{ video.text }}</div>
      <div class="shorts-action">
        <a :href="video.downurl" target="_blank" rel="noreferrer">
          <a-button type="primary" status="success">下载高清视频</a-button>
        </a>
        <a :href="video.cover" target="_blank" rel="noreferrer">
          <a-button type="primary" status="warning">下载视频封面</a-button>
        </a>
      </div>
      <video controls autoplay name="media"
        style="width: 100%; height: 540px; background-color: rgb(0, 0, 0); border-radius: 5px; padding: 0px 5px;">
        <source :src="video.video" type="video/mp4">
      </video>
    </div>
    <div v-else class="qr-code">
      <img src="https://pic.imgdb.cn/item/6300a79b16f2c2beb1ccc2dd.jpg" style="width: 260px;display: inline;" />
      <div class="tips">体验小程序下载</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getShortsUrl } from '@api/play'

const loading = ref(false)
const video = reactive({
  video: '',
  text: '',
  downurl: '',
  cover: ''
})
const getPlay = async (url) => {
  try {
    loading.value = true
    video.video = ''
    const data = {
      link: url.value,
      timestamp: Math.floor(new Date().getTime() / 1000)
    }
    const res = await getShortsUrl(data)
    if (res.code === 200) {
      video.video = res.data.video
      video.downurl = res.data.downurl
      video.text = res.data.text
      video.cover = res.data.cover
    }
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }
}
</script>
<style lang="less" scoped>
// https://www.bilibili.com/video/BV1RL4y1w7Ff?spm_id_from=333.337.search-card.all.click
.shorts-box {
  // width: 80%;
  // margin: 12px auto 0;
  padding: 20px 20%;
  background-color: #fff;
  min-height: 500px;

  .shorts-desc {
    line-height: 20px;
    margin-bottom: 12px;
  }

  .shorts-title {
    text-align: center;
    margin: 10px 0;
  }

  .shorts-action {
    text-align: center;

    button {
      margin: 12px;
    }
  }

  .qr-code {
    margin: 12px 0;
    text-align: center;
    .tips{
      line-height: 40px;
    }
  }
}
</style>
<template>
  <span>
      关于本站:

  支持解析抖、快、火、微、Youtube、Facebook、Instagram、Twitter、 小红书、哔哩哔哩 、 百度贴吧、 QQ看点、 AcFun、 淘宝、 UC视频、 趣头条、 皮皮虾、 小咖秀、 趣多拍、 微视、 美拍、
  网易云、 陌陌、 映客、 迅雷、 阳光宽频、 全民K歌、 刷宝 、WIDE短视频 、 微博、秒拍
  、轻视频、最右、开眼、酷燃、等主流短视频无水印原画质视频解析下载，国外主流视频平台原画质无水印解析下载，短视频无水印原画质解析下载，后续支持更多功能！等平台的视频
  使用方法:

  打开视频APP，点开某个视频，点击分享按钮，在分享弹框中点击复制链接或通过分享到微信QQ等获取分享链接
  将刚才复制的链接粘贴到下面的输入框
  </span>
  <Input @getPlay="getPlay" :loading="loading" />
  <video controls="" autoplay="" name="media" v-if="video" style="width: 100%; height: 540px; background-color: rgb(0, 0, 0); border-radius: 5px; padding: 0px 5px;">
    <source
      :src="video"
      type="video/mp4">
  </video>

</template>

<script setup lang="ts">
import { getShortsUrl } from '@api/play'
const loading = ref(false)
const video = ref('')
const getPlay = async (url) => {
  try {
    loading.value = true
    video.value = ''
    const data = {
      link: url.value,
      timestamp: Math.floor(new Date().getTime() / 1000)
    }
    const res = await getShortsUrl(data)
    if (res.code === 200) {
      video.value = res.data.video
    }
    console.log(res);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false
  }
}
</script>
<script setup lang="ts">
import HLSCore from '@cloudgeek/playcore-hls'
  const videoSource =  [{
    src: 'https://media.vued.vanthink.cn/sparkle_your_name_am360p.mp4',
    resolution: 360,
  }]
  const cover = "https://img1.wxzxzj.com/vpc-example-cover-your-name-c.png"
  const title = "你的名字"
</script>
<template>
  <div style="width: 300px;height: 100px;">
    <vue3-video-player :core="HLSCore" :src="videoSource" :title="title"></vue3-video-player>
  </div>
</template>
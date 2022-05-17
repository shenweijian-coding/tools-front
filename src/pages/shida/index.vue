<script setup lang="ts">
import { getPlayUrl, getDownFile } from '@api/play'
import { Message } from '@arco-design/web-vue';
import useLoading from '../../hooks/loading'
import { videoPlay } from 'vue3-video-play'
import Header from "@components/Header/index.vue"

const { loading, setLoading } = useLoading();

  const options =  reactive({
    width: 'auto', //播放器高度
    height: window.screen.availHeight -200 + 'px', //播放器高度
    color: "#409eff", //主题色
    title: '', //视频名称
    src: "https://video.shida66.com/m3u8_sd/2020/09/07/71DB98D0-2E85-E046-3803-E78F4AD65F35.m3u8", //视频源
    muted: false, //静音
    webFullScreen: false,
    speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
    autoPlay: false, //自动播放
    loop: false, //循环播放
    mirror: false, //镜像画面
    ligthOff: false,  //关灯模式
    volume: 0.3, //默认音量大小
    control: true, //是否显示控制
    poster: 'https://img.shida66.com/upload/special_cover_img/2020/11/18/a2274b1a631f51e2a721ad982322b84d.jpg',
    controlBtns:['audioTrack', 'speedRate', 'volume', 'setting', 'pip', 'pageFullScreen', 'fullScreen'] //显示所有按钮,
  })
  const url = ref()
  const isDown = ref(true)
  const downParams = { vid: '', sid: '' }
  const getPlay = async () => {
    setLoading(true)
    if(!url.value) {
      Message.warning('Url不能为空！')
      return
    }
    try {
      const { data } = await getPlayUrl({ url: url.value })
      Message.success('success')
      console.log(data, 'res');
      options.poster = data.cover
      options.src = data.playUrl
      options.title = data.title
      if(data.isDown) {
        isDown.value = data.isDown
        downParams.vid = data.vid
        downParams.sid = data.sid
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }
  const downFile = async () => {
      const { data } = await getDownFile(downParams)
      console.log(data);
      window.open(data.data)
  }
</script>
<template>
  <div class="container mx-auto px-60 pt-4">
    <!-- <div for="" class="text-3xl text-center mb-4">vue3+vite</div> -->
    <a-input-search
    :loading="loading"
    style="height: 44px"
    placeholder="复制链接到此处，点击解析，稍等片刻即可观看！"
    v-model="url"
    button-text="解析"
    search-button
    @search="getPlay"
    size="large"/>
    <div class="mt-2 text-center">
      <a-button v-if="isDown" type="outline" class="mb-2" @click="downFile" >下载素材+课堂源文件</a-button>
    </div>
    <videoPlay class="w-full" type="m3u8" v-bind="options" ></videoPlay>
  </div>
</template>
<style>
@import 'vue3-video-play/dist/style.css';
.arco-input-append button{
  height: 100%;
  width: 100px;
}
</style>